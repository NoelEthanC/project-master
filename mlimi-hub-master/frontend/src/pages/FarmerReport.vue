<script setup>
  import Logo from "../components/Logo.vue";
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Weather Report for the Next 7 Days</h1>
      <button
        class="print-button bg-tertiary hover:bg-blue-600 text-cardLight px-4 py-2 rounded"
        v-print="'#report'"
      >
        <i class="fas fa-print mr-2"></i>
        Print 
      </button>
    </div>

    <div id="report" class="report-container bg-cardLight shadow-md rounded-lg p-6">
      <div class="header-container mb-6 flex items-center justify-between">
        <div>
          <Logo/>
          <h2 class="report-title text-xl font-bold">Weather Forecast for Blantyre, Malawi</h2>
          <p class="text-gray-500">{{ reportDate }}</p>
        </div>
        <div class="uv-index-container">
          <h3 class="text-lg font-bold mb-4">UV Index Forecast</h3>
          <div class="uv-index-box p-4 rounded-lg" :class="getUVIndexClass(day.uvindex)">
            <p class="text-textLighter font-bold text-2xl">{{ day.uvindex }}</p>
            <p class="text-textLighter">{{ getUVIndexDescription(day.uvindex) }}</p>
          </div>
        </div>
      </div>

      <div class="charts-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div class="temperature-chart-container">
          <h3 class="text-lg font-bold mb-4">Temperature Forecast</h3>
          <div id="temperatureChart"></div>
        </div>
        <div class="wind-chart-container">
          <h3 class="text-lg font-bold mb-4">Wind Speed Forecast</h3>
          <div id="windSpeedChart"></div>
        </div>
        <div class="precipitation-chart-container">
          <h3 class="text-lg font-bold mb-4">Precipitation Forecast</h3>
          <div id="precipitationChart"></div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="table-auto w-full bg-secondary text-textLighter font-bold rounded-lg p-4">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Date</th>
              <th class="px-4 py-2 text-left">Conditions</th>
              <th class="px-4 py-2 text-left">Temperature (°C)</th>
              <th class="px-4 py-2 text-left">Precip (mm)</th>
              <th class="px-4 py-2 text-left">Wind (m/s)</th>
              <th class="px-4 py-2 text-left">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, index) in nextSevenDays" :key="index">
              <td class="border px-4 py-2">{{ formatDate(day.datetime) }}</td>
              <td class="border px-4 py-2">{{ day.conditions }}</td>
              <td class="border px-4 py-2">{{ day.tempmin }} - {{ day.tempmax }}</td>
              <td class="border px-4 py-2">{{ day.precip }}</td>
              <td class="border px-4 py-2">{{ day.windspeed }}</td>
              <td class="border px-4 py-2">
                {{ getRecommendation(day.conditions, day.tempmin, day.tempmax, day.precip, day.windspeed) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import print from "vue3-print-nb";
import Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HCExporting from 'highcharts/modules/exporting';
import HCExportData from 'highcharts/modules/export-data';
import HCSolidGauge from 'highcharts/modules/solid-gauge';
import LoaderAlt from "../components/LoaderAlt.vue";

import theme from 'highcharts/themes/grid-light.src';

HCMore(Highcharts);
HCExporting(Highcharts);
HCExportData(Highcharts);
HCSolidGauge(Highcharts);

// Apply the theme
theme(Highcharts);


export default {
  name: "WeatherReport",
  directives: { print },
  components:{LoaderAlt},
  data() {
    return {
      loading:false,
      days: [],
      day: {},
      reportDate: new Date().toLocaleDateString(),
    };
  },
  created() {
    this.fetchWeatherForecast();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
  },
  computed: {
    nextSevenDays() {
      return this.days.slice(0, 7);
    },
  },
  methods: {
    fetchWeatherForecast() {
      this.loading = true;
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/forecast?location=blantyre, malawi`
        )
        .then((response) => {
          this.days = response.data.days;
          this.day = response.data.days[0];
          this.createCharts();
        })
        .catch((error) => {
          console.error("Error fetching weather forecast:", error);
        }).finally(() => {
          this.loading = false;
        });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
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
    getRecommendation(conditions, tempmin, tempmax, precip, windspeed) {
      if (conditions === "Sunny") {
        return "Optimal conditions for outdoor activities and farming.";
      } else if (conditions === "Cloudy") {
        return "Consider delaying outdoor activities due to potential rain.";
      } else if (conditions === "Rain") {
        return "Avoid outdoor activities and focus on indoor tasks. Bring an umbrella if going out.";
      } else {
        return "Check weather conditions regularly and plan accordingly.";
      }
    },
    getUVIndexClass(uvindex) {
      if (uvindex <= 2) {
        return "bg-green-500";
      } else if (uvindex <= 5) {
        return "bg-yellow-500";
      } else if (uvindex <= 7) {
        return "bg-orange-500";
      } else {
        return "bg-red-500";
      }
    },
    getUVIndexDescription(uvindex) {
      if (uvindex <= 2) {
        return "Low";
      } else if (uvindex <= 5) {
        return "Moderate";
      } else if (uvindex <= 7) {
        return "High";
      } else {
        return "Extreme";
      }
    },
    createCharts() {
      this.createTemperatureChartImage();
      this.createWindSpeedChartImage();
      this.createPrecipitationChartImage();
    },
    createTemperatureChartImage() {
      Highcharts.chart('temperatureChart', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Temperature Forecast'
        },
        xAxis: {
          categories: this.nextSevenDays.map((day) => this.formatDate(day.datetime))
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          }
        },
        series: [
          {
            name: 'Minimum Temperature',
            data: this.nextSevenDays.map((day) => day.tempmin)
          },
          {
            name: 'Maximum Temperature',
            data: this.nextSevenDays.map((day) => day.tempmax)
          }
        ]
      });
    },
    createWindSpeedChartImage() {
      Highcharts.chart('windSpeedChart', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Wind Speed Forecast'
        },
        xAxis: {
          categories: this.nextSevenDays.map((day) => this.formatDate(day.datetime))
        },
        yAxis: {
          title: {
            text: 'Wind Speed (m/s)'
          }
        },
        series: [
          {
            name: 'Wind Speed',
            data: this.nextSevenDays.map((day) => day.windspeed)
          }
        ]
      });
    },
    createPrecipitationChartImage() {
      Highcharts.chart('precipitationChart', {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Precipitation Forecast'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [
          {
            name: 'Precipitation',
            colorByPoint: true,
            data: this.nextSevenDays.map((day) => ({
              name: this.formatDate(day.datetime),
              y: day.precip
            }))
          }
        ]
      });
    }
  }
};
</script>

<style>
@import "./report.css";
@media print {
  .no-print {
    display: none;
  }
}
</style>