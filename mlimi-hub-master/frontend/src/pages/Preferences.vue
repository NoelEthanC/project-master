<template>
  <div class="lg:flex-row justify-between space-x-5 space-y-8 lg:space-y-0">
    <div class="flex justify-between items-center mb-4 mx-4">
              <button
                @click="$router.go(-1)"
                class="bg-secondary text-tertiary font-bold py-2 px-4 rounded-md"
              >
              <i class="fa fa-arrow-left"></i>
                Back
              </button>
              <input
                type="text"
                placeholder=" &#x1F50D; Search..."
                class="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tertiary pl-10"
                v-model="searchQuery"
                @input="filterCourses"
              />
            </div>
    <h1 class="ml-5 mb-5 font-extrabold text-2xl">Forecast</h1>
    <div class="overflow-x-auto rounded-lg bg-cardLight shadow-md w-full">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-secondary">
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Conditions</th>
            <th class="px-4 py-2">Temperature</th>
            <th class="px-4 py-2">Precipitation</th>
            <th class="px-4 py-2">Wind Speed</th>
          </tr>
        </thead>
        <tbody class="divide-y">
  <tr
    v-for="(day, index) in paginatedDays"
    :key="day.datetime"
    class="border-b hover:bg-background"
  >
    <td class="px-4 py-2 text-left">{{ formatDate(day.datetime) }}</td>
    <td class="px-4 py-2 text-left">
      <i :class="getWeatherIcon(day.icon)" class="text-2xl"></i>
      {{ day.conditions }}
    </td>
    <td class="px-4 py-2 text-left">{{ day.tempmin }}°C - {{ day.tempmax }}°C</td>
    <td class="px-4 py-2 text-left">
      <i class="fas fa-tint text-tertiary"></i>
      {{ day.precip }}mm
    </td>
    <td class="px-4 py-2 text-left">
      <i class="fas fa-wind text-gray-500"></i>
      {{ day.windspeed }}m/s
    </td>
  </tr>
</tbody>

      </table>
      <div class="flex justify-center mt-4">
        <div class="flex justify-center mt-4">
          <div class="flex space-x-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="{ 'bg-tertiary text-textLighter': currentPage === page }"
              class="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200 ease-in-out"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";

export default {
  name: "WeatherForecast",
  data() {
    return {
      days: [],
      currentPage: 1,
      pageSize: 500,
    };
  },
  created() {
    this.fetchWeatherForecast();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.days.length / this.pageSize);
    },
    paginatedDays() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.days.slice(startIndex, endIndex);
    },
  },
  methods: {
    fetchWeatherForecast() {
      axios
        .get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/forecast?location=mzuzu, malawi`
        )
        .then((response) => {
          this.days = response.data.days;
          this.updateChartData();
        })
        .catch((error) => {
          console.error("Error fetching weather forecast:", error);
        });
    },
    updateChartData() {
      this.chartData.labels = this.days.map((day) =>
        this.formatDate(day.datetime)
      );
      this.chartData.datasets[0].data = this.days.map((day) => day.temp);
      this.chartData.datasets[1].data = this.days.map((day) => day.windspeed);
      this.chartData.datasets[2].data = this.days.map((day) => day.humidity);
      this.chartData.datasets[3].data = this.days.map((day) => day.precip);
      this.createChart();
    },

    formatDate(dateString) {
      // Create a new Date object from the dateString
      const date = new Date(dateString);

      // Define options for formatting the date
      const options = {
        year: "numeric", // Full year, e.g., 2024
        month: "long", // Full month name, e.g., April
        day: "numeric", // Numeric day, e.g., 14
      };

      // Create an Intl.DateTimeFormat instance with the desired locale and options
      const dateFormatter = new Intl.DateTimeFormat("en-GB", options); // Locale can be changed as per preference

      // Format the date and return it
      return dateFormatter.format(date);
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
  },
};
</script>
