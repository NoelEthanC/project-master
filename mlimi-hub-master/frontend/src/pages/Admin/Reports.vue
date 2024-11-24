<script setup>
import Logo from "../../components/Logo.vue";
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-center text-indigo-700">
      <i class="fas fa-chart-line mr-2"></i>Sales Report
    </h1>

    <div class="flex flex-wrap justify-center mb-4">
      <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-4">
        <label for="startTime" class="block font-medium mb-2 text-gray-700"
          ><i class="fas fa-calendar-alt mr-2"></i>Start Time:</label
        >
        <input
          id="startTime"
          v-model="startTime"
          type="datetime-local"
          class="border rounded p-2 w-full"
          :class="{ 'border-red-500': startTimeError }"
          placeholder="Select start time"
        />
        <div v-if="startTimeError" class="text-red-500 mt-1">
          {{ startTimeError }}
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 px-4 mb-4">
        <label for="endTime" class="block font-medium mb-2 text-gray-700"
          ><i class="fas fa-calendar-alt mr-2"></i>End Time:</label
        >
        <input
          id="endTime"
          v-model="endTime"
          type="datetime-local"
          class="border rounded p-2 w-full"
          :class="{ 'border-red-500': endTimeError }"
          placeholder="Select end time"
        />
        <div v-if="endTimeError" class="text-red-500 mt-1">
          {{ endTimeError }}
        </div>
      </div>
    </div>

    <div class="flex justify-center mb-4">
      <button
        class="bg-indigo-500 text-white rounded p-2 mr-2 hover:bg-indigo-600 transition-colors duration-300 flex items-center"
        @click="generateReport"
      >
        <i class="fas fa-file-alt mr-2"></i>
        Generate Report
      </button>
      <button
        class="bg-green-500 text-white rounded p-2 hover:bg-green-600 transition-colors duration-300 flex items-center"
        v-print="'#report'"
      >
        <i class="fas fa-print mr-2"></i>
        Print Report
      </button>
    </div>

    <div
      v-if="!reportData"
      class="mt-4 bg-gray-100 rounded-lg shadow p-4 text-gray-500 flex items-center justify-center"
    >
      <i class="fas fa-spinner fa-spin mr-2"></i>
      No report data available. Please generate a report first.
    </div>

    <div id="report" v-if="reportData" class="mt-4 bg-white">
      <div >
        <div>
          <Logo />
        </div>
        <div class="flex flex-col items-center">
          <div class="w-full  px-4 mb-4">
            <div class="bg-white rounded-lg shadow p-4">
              <highcharts :options="chartOptions"></highcharts>
            </div>
          </div>
          <div class="w-full  px-4 mb-4">
            <div class="bg-white rounded-lg shadow p-4">
              <highcharts :options="barChartOptions"></highcharts>
            </div>
          </div>
          <div class="w-full px-4 mb-4">
            <div class="bg-white rounded-lg shadow p-4">
              <highcharts :options="pieChartOptions"></highcharts>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div
          class="bg-white rounded-lg shadow p-4"
          v-for="calculation in calculations"
          :key="calculation.method"
        >
          <h3
            class="text-lg font-semibold mb-2 text-gray-700 flex items-center"
          >
            <i :class="calculation.icon" class="mr-2"></i>
            {{ calculation.title }}
          </h3>
          <p class="text-gray-600">{{ calculation.result }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-semibold mb-2 text-gray-700 flex items-center">
          <i :class="resource.icon" class="mr-2"></i>
          {{ resource.label }}
        </h3>
        <TableView
          :resource="resource"
          :items="reportData.data"
          :selected-rows="[]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
import print from "vue3-print-nb";
import axios from "axios";
import TableView from "./TableView.vue";
import Swal from "sweetalert2";

export default {
  directives: { print },
  components: {
    Highcharts: Chart,
    TableView,
  },

  data() {
    return {
      startTime: this.setDefaultTime(),
      endTime: this.setDefaultTime(),
      startTimeError: null,
      endTimeError: null,
      reportData: null,
      chartOptions: null,
      barChartOptions: null,
      pieChartOptions: null,
      calculations: [],
      resource: {
        name: "payments",
        icon: "fa fa-credit-card",
        label: "Payments",
        menuGroup: "Ecommerce",
        menuGroupIcon: "fa fa-shopping-cart",
        schema: [
          {
            name: "farmer",
            title: "Farmer",
            type: "ref",
            resource: "farmers",
            field: "fullname",
          },
          {
            name: "product",
            title: "Product",
            type: "ref",
            resource: "products",
            field: "title",
          },
          {
            name: "amount",
            title: "Amount Paid",
            type: "number",
            required: true,
          },
          {
            name: "status",
            title: "Payment Status",
            type: "ref",
            resource: "payment-statuses",
            field: "status",
          },
        ],
        renderMode: "report",
      },
    };
  },

  computed: {
    calculationFieldOptions() {
      return this.resource.schema.filter((field) => field.type === "number");
    },
  },

  methods: {
    setDefaultTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },

    async generateReport() {
      this.resetErrors();

      if (!this.validateTimeRange()) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${
            this.resource.name
          }/filterByTime`,
          {
            params: {
              startTime: this.startTime,
              endTime: this.endTime,
            },
          }
        );
        this.reportData = response.data;

        // Prepare calculations
        this.calculations = this.calculationFieldOptions.map((field) => {
          const calculation = {
            title: field.title,
            method: "sum",
            result: this.calculateResult(
              field.name,
              "sum",
              this.reportData.data
            ),
            icon: "fas fa-plus",
          };
          calculation.result = ` ${calculation.result}`;
          return calculation;
        });
        this.calculations = [
          ...this.calculations,
          ...[
            { title: "Average", method: "average", icon: "fas fa-calculator" },
            { title: "Product", method: "product", icon: "fas fa-times" },
            { title: "Maximum", method: "max", icon: "fas fa-arrow-up" },
            { title: "Minimum", method: "min", icon: "fas fa-arrow-down" },
            { title: "Count", method: "count", icon: "fas fa-hashtag" },
            {
              title: "Median",
              method: "median",
              icon: "fas fa-sort-numeric-down",
            },
            { title: "Mode", method: "mode", icon: "fas fa-sync-alt" },
          ].map((item) => {
            const calculation = {
              title: `${this.calculationFieldOptions[0].title} (${item.title})`,
              method: item.method,
              result: this.calculateResult(
                this.calculationFieldOptions[0].name,
                item.method,
                this.reportData.data
              ),
              icon: item.icon,
            };
            return calculation;
          }),
        ];

        // Prepare line chart
        this.chartOptions = {
          chart: {
            type: "line",
          },
          title: {
            text: "Sales Over Time",
          },
          xAxis: {
            type: "datetime",
          },
          yAxis: {
            title: {
              text: "Amount Paid",
            },
          },
          series: [
            {
              name: "Sales",
              data: this.reportData.data.map((item) => [
                new Date(item.createdAt).getTime(),
                item.amount,
              ]),
            },
          ],
        };

        // Prepare bar chart
        this.barChartOptions = {
          chart: {
            type: "column",
          },
          title: {
            text: "Sales by Product",
          },
          xAxis: {
            type: "category",
            categories: [
              ...new Set(this.reportData.data.map((item) => item.product)),
            ],
          },
          yAxis: {
            title: {
              text: "Total Amount Paid",
            },
          },
          series: [
            {
              name: "Sales",
              data: this.reportData.data.reduce((acc, item) => {
                const index = acc.findIndex((obj) => obj.name === item.product);
                if (index === -1) {
                  acc.push({ name: item.product, y: item.amount });
                } else {
                  acc[index].y += item.amount;
                }
                return acc;
              }, []),
            },
          ],
        };

        // Prepare pie chart
        this.pieChartOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
          },
          title: {
            text: "Sales by Product (Pie Chart)",
          },
          tooltip: {
            pointFormat: "{series.name}: <b>{point.y}</b>",
          },
          accessibility: {
            point: {
              valueSuffix: "%",
            },
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b>: {point.y}",
              },
            },
          },
          series: [
            {
              name: "Sales",
              data: this.reportData.data.reduce((acc, item) => {
                const index = acc.findIndex((obj) => obj.name === item.product);
                if (index === -1) {
                  acc.push({ name: item.product, y: item.amount });
                } else {
                  acc[index].y += item.amount;
                }
                return acc;
              }, []),
            },
          ],
        };
      } catch (error) {
        console.error(error);
      }
    },

    calculateResult(fieldName, method, data) {
      const values = data.map((item) => item[fieldName]);
      switch (method) {
        case "sum":
          return values.reduce((a, b) => a + b, 0);
        case "average":
          return values.reduce((a, b) => a + b, 0) / values.length;
        case "product":
          return values.reduce((a, b) => a * b, 1);
        case "max":
          return Math.max(...values);
        case "min":
          return Math.min(...values);
        case "count":
          return values.length;
        case "median":
          values.sort((a, b) => a - b);
          const half = Math.floor(values.length / 2);
          return values.length % 2 === 0
            ? (values[half - 1] + values[half]) / 2
            : values[half];
        case "mode":
          const occurrences = values.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          }, {});
          const maxOccurrence = Math.max(...Object.values(occurrences));
          const modes = Object.keys(occurrences).filter(
            (key) => occurrences[key] === maxOccurrence
          );
          return modes.join(", ");
        default:
          return null;
      }
    },

    validateTimeRange() {
      this.resetErrors();

      const startDateTime = new Date(`${this.startTime}:00`).getTime();
      const endDateTime = new Date(`${this.endTime}:00`).getTime();

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        this.showError("Please select a valid date and time range.");
        return false;
      }

      if (endDateTime <= startDateTime) {
        this.showError("The end time must be after the start time.");
        return false;
      }

      return true;
    },

    resetErrors() {
      this.startTimeError = null;
      this.endTimeError = null;
    },

    showError(message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    },
  },
};
</script>
