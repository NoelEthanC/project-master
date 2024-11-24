<template>
  <div class="">
    <div class=" mx-4">
      <div
        class="px-4 py-6 mb-6 rounded-lg shadow-md bg-gradient-to-r from-secondary to-primary text-textLighter"
      >
        <p class="text-sm uppercase font-semibold tracking-wide">
          Current Weather conditions
        </p>
        <h1 class="text-4xl font-extrabold">
          <Loader v-if="loading" />
          <span v-else>{{ current || "No data found" }}</span>
        </h1>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="(metric, index) in metrics"
          :key="index"
          class="bg-cardLight rounded-lg shadow-md overflow-hidden"
        >
          <div class="px-3 py-3 bg-cardLight text-textDark flex justify-between items-center">
            <h1 class="font-semibold text-xl">Today's {{ metric }}</h1>
            <i  class=" fa fa-ellipsis h-4 w-4"></i>
          </div>
          <div class="flex items-center justify-between p-4">
            <span class="text-6xl text-textDark/50"><i :class="metricIcons[index]" ></i></span>
            <div class="flex items-center">
              <h1 class="text-3xl font-extrabold">
                <Loader v-if="loading" />
                <span v-else>{{ metricValues[index] || "N/A" }}</span>
              </h1>
              <h4 class="text-lg font-bold ml-1">{{ metricUnits[index] }}</h4>
            </div>
          </div>
        </div>
        <div>
          <RouterLink to="/dashboard/farmer/preferences" class="bg-secondary text-cardDark font-bold py-2 px-4 rounded-md">
            See More <i class="fa fa-arrow-right"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto px-4">
    <div class="flex flex-col">
      <div>
        <Forecast />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Forecast from "./Forecast.vue";
import Loader from "../components/Loader.vue";


export default {
  data() {
    return {
      loading: true,
      temperature: null,
      rainFall: null,
      windSpeed: null,
      humidity: null,
      current: null,
      metrics: ["Temperature", "Rainfall", "Wind Speed", "Humidity"],
      metricIcons: [
  "fas fa-temperature-high", // Temperature Icon
  "fas fa-cloud-rain",       // Rain Icon
  "fas fa-wind",             // Wind Icon
  "fas fa-tint"              // Humidity Icon
],
      metricValues: [null, null, null, null],
      metricUnits: ["°C", "mm", "km/h", "%"],
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.bXltYWlsQGdtYWlsLmNvbQ.QM_e32qrpZ4-SoOluSFxjTibrhZSlxeH0XS3qO9SxKU",
    };
  },
  components: { Forecast, Loader },
  async mounted() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/v1/forecast?location=blantyre, malawi`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      const conditions = response.data.currentConditions;
      this.metricValues[0] = conditions.temp;
      this.metricValues[1] = conditions.dew;
      this.metricValues[2] = conditions.windspeed;
      this.metricValues[3] = conditions.humidity;
      this.current = conditions.conditions;

      console.log("API Response:", response.data.currentConditions);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.current = null;
      this.metricValues = [null, null, null, null];
    } finally {
      this.loading = false;
    }
  },
};
</script>
