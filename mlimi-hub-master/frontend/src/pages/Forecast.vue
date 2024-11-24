<template>
  <div
    class="flex mb-28 flex-col lg:flex-row justify-between space-x-5 space-y-8 lg:space-y-0"
  >
    <div class="w-full lg:w-1/2 space-y-8">
      <div>
        <h1 class="font-extrabold text-2xl mb-3">Weather Averages</h1>
        <div class="overflow-x-auto rounded-lg bg-cardLight shadow-md">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-secondary">
                <th class="px-4 py-2">Parameter</th>
                <th class="px-4 py-2">Average</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="px-4 py-2">Temperature</td>
                <td class="px-4 py-2">{{ averageTemperature }}°C</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2">Precipitation</td>
                <td class="px-4 py-2">{{ averagePrecipitation }}mm</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2">Wind Speed</td>
                <td class="px-4 py-2">{{ averageWindSpeed }}m/s</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2">Humidity</td>
                <td class="px-4 py-2">{{ averageHumidity }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h1 class="font-extrabold text-2xl mb-2">Weather Alerts</h1>
        <div class="overflow-x-auto rounded-lg bg-cardLight shadow-md">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-secondary">
                <th class="px-4 py-2">Date</th>
                <th class="px-4 py-2">Type</th>
                <th class="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="alerts.length > 0"
                v-for="alert in alerts"
                :key="alert.id"
                class="border-b"
              >
                <td class="px-4 py-2">{{ formatDate(alert.datetime) }}</td>
                <td class="px-4 py-2">
                  <i :class="getAlertIcon(alert.type)" class="text-2xl"></i>
                  {{ alert.type }}
                </td>
                <td class="px-4 py-2">{{ alert.description }}</td>
              </tr>
              <div
                v-else
                class="p-4 flex justify-center items-center text-center text-gray-500"
              >
                No weather alerts to display.
              </div>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="px-3 py-3 bg-secondary flex justify-between items-center">
          <h1 class="font-extrabold text-2xl text-textLight">Weather Trends</h1>
        </div>
        <div id="weatherTrendsChart"></div>
      </div>
    </div>
    <div class="w-full lg:w-1/2 space-y-8">
      <div class="rounded-lg shadow-md bg-cardLight mt-8">
        <div class="px-3 py-3 bg-secondary flex justify-between items-center">
          <h1 class="font-extrabold text-2xl text-textLight">Geo Spacial Map</h1>
        </div>

        <div>
          <div class="bg-cardLight rounded-lg shadow-md p-6">
            <div id="malawi-map"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as Highcharts from "highcharts/highmaps";
import malawi from "@highcharts/map-collection/countries/mw/mw-all.geo.json";

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LCircle,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "WeatherReport",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LCircle,
    LIcon,
  },
  data() {
    return {
      malawiBounds: [
        [-17.125, 32.6739], // Southwest corner of Malawi
        [-9.2306, 35.8952], // Northeast corner of Malawi
      ],
      days: [],
      alerts: [],
      loading: false,
      currentPage: 1,
      pageSize: 5,
      searchQuery: "",
      mapCenter: [-13.2543, 34.3015], // Center of Malawi
      selectedLocation: "Mzuzu, Malawi",
    };
  },
  created() {
    this.fetchWeatherData();
  },
  mounted() {
    this.createMalawiMap();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredDays.length / this.pageSize);
    },
    paginatedDays() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredDays.slice(startIndex, endIndex);
    },
    filteredDays() {
      return this.days.filter((day) => {
        return (
          day.datetime.includes(this.searchQuery) ||
          day.conditions.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    averageTemperature() {
      return (
        this.days.reduce((sum, day) => sum + day.temp, 0) / this.days.length
      ).toFixed(2);
    },
    averagePrecipitation() {
      return (
        this.days.reduce((sum, day) => sum + day.precip, 0) / this.days.length
      ).toFixed(2);
    },
    averageWindSpeed() {
      return (
        this.days.reduce((sum, day) => sum + day.windspeed, 0) /
        this.days.length
      ).toFixed(2);
    },
    averageHumidity() {
      return (
        this.days.reduce((sum, day) => sum + day.humidity, 0) / this.days.length
      ).toFixed(2);
    },
  },
  methods: {
    createMalawiMap() {
      Highcharts.mapChart("malawi-map", {
        chart: {
          map: malawi,
          height: "750px",
        },
        title: {
          text: "Malawi",
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: "spacingBox",
          },
        },
        colorAxis: {
          min: 0,
          max: 100,
          type: "linear",
          minColor: "#FFFFFF",
          maxColor: "#34c759",
        },
        series: [
          {
            name: "Malawi Districts",
            data: [
              ["mw-ba", 60], // Balaka district
              ["mw-bl", 75], // Blantyre district
              ["mw-ck", 82], // Chikwawa district
              ["mw-ct", 68], // Chitipa district
              ["mw-de", 72], // Dedza district
              ["mw-do", 58], // Dowa district
              ["mw-1011", 64], // Karonga district
              ["mw-ks", 75], // Kasungu district
              ["mw-li", 70], // Lilongwe district
              ["mw-6970", 70],
              ["mw-ma", 62], // Machinga district
              ["mw-mg", 68], // Mangochi district
              ["mw-mc", 73], // Mchinji district
              ["mw-mj", 71], // Mulanje district
              ["mw-mw", 65], // Mwanza district
              ["mw-mz", 78], // Mzimba district
              ["mw-na", 66], // Nkhata Bay district
              ["mw-nk", 72], // Nkhotakota district
              ["mw-nu", 69], // Ntcheu district
              ["mw-ni", 74], // Ntchisi district
              ["mw-ph", 67], // Phalombe district
              ["mw-ru", 71], // Rumphi district
              ["mw-sa", 75], // Salima district
              ["mw-th", 68], // Thyolo district
              ["mw-zo", 72],
              ["mw-ns", 72],
            ],
            dataLabels: {
              enabled: true,
              format: "{point.name}",
            },
            point: {
              events: {
                click: function () {
                  // Handle click on a district, e.g., display more detailed information
                  console.log("Clicked on", this.name);
                },
              },
            },
          },
        ],
      });
    },
    fetchWeatherData() {
      this.loading = true;
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/forecast?location=${this.selectedLocation}`
        )
        .then((response) => {
          this.days = response.data.days;
          this.alerts = response.data.alerts;
          this.updateWeatherTrendsChart();
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    updateWeatherTrendsChart() {
      Highcharts.chart("weatherTrendsChart", {
        chart: {
          type: "line",
        },
        title: {
          text: "Weather Trends",
        },
        xAxis: {
          categories: this.days.map((day) => this.formatDate(day.datetime)),
          title: {
            text: "Date",
          },
        },
        yAxis: [
          {
            title: {
              text: "Temperature (°C)",
            },
          },
          {
            title: {
              text: "Wind Speed (m/s)",
            },
            opposite: true,
          },
          {
            title: {
              text: "Humidity (%)",
            },
            opposite: true,
          },
          {
            title: {
              text: "Rainfall (mm)",
            },
            opposite: true,
          },
        ],
        series: [
          {
            name: "Temperature",
            data: this.days.map((day) => day.temp),
            yAxis: 0,
          },
          {
            name: "Wind Speed",
            data: this.days.map((day) => day.windspeed),
            yAxis: 1,
          },
          {
            name: "Humidity",
            data: this.days.map((day) => day.humidity),
            yAxis: 2,
          },
          {
            name: "Rainfall",
            data: this.days.map((day) => day.precip),
            yAxis: 3,
          },
        ],
      });
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    getWeatherIcon(icon) {
      switch (icon) {
        case "rain":
          return "fas fa-cloud-rain text-tertiary";
        case "cloudy":
          return "fas fa-cloud text-gray-500";
        case "sun":
          return "fas fa-sun text-yellow-500";
        default:
          return "fas fa-weather-unknown text-gray-500";
      }
    },
    getAlertIcon(type) {
      switch (type) {
        case "severe":
          return "fas fa-exclamation-triangle text-red-500";
        case "warning":
          return "fas fa-exclamation-circle text-orange-500";
        case "advisory":
          return "fas fa-info-circle text-blue-500";
        default:
          return "fas fa-alert-unknown text-gray-500";
      }
    },
  },
};
</script>
