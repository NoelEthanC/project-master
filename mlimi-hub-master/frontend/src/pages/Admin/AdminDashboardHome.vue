<template>
  <LoaderAlt v-if="loading" />
  <div v-else class="bg-background min-h-screen">
    <div class="p-6">
      <div class="font-bold text-2xl mb-2">{{ title }}</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Metric cards -->

        <div
          v-for="(metric, index) in metricsWithValues"
          :key="index"
          class="bg-cardLight rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
          <div class="flex flex-col items-start">
            <div class="flex items-center justify-between w-full">
              <h3 class="text-lg font-bold">{{ metric.title }}</h3>
              <i :class="`${metric.iconClass} text-4xl`"></i>
            </div>
            <Loader v-if="loading" />
            <p v-else class="text-4xl font-bold" :class="metric.colorClass">
              {{ metric.value }}
            </p>
            <RouterLink
              :to="metric.redirectPath"
              :class="`${metric.colorClass} flex items-center mt-2 font-medium hover:underline`"
            >
              View more
              <i class="fas fa-arrow-right ml-2"></i>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Widgets Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div
          v-for="(widget, index) in widgets"
          :key="index"
          class="bg-cardLight rounded-lg shadow-md p-6"
        >
          <h3 class="text-xl font-bold mb-4">{{ widget.title }}</h3>
          <div v-if="widget.type === 'tableview'">
            <Loader v-if="!tableDataLoaded[widget.resource.name]" />
            <!-- Add this line -->
            <TableView
              v-else
              :items="tableData[widget.resource.name]"
              :resource="widget.resource"
              :selected-rows="[]"
            />
            <!-- Update this line -->
          </div>
          <div v-else :id="`chart-${index}`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import TableView from "./TableView.vue";
import resourceFunctions from "../../utils/actions";
import { dashboardconfig } from "../../data/Dashboard.config";
import Loader from "../../components/Loader.vue";
import axios from "axios";
import LoaderAlt from "../../components/LoaderAlt.vue";

export default {
  components: { TableView, Loader, LoaderAlt },
  data() {
    return {
      title: null,
      loading: false,
      metrics: [],
      metricsWithValues: [],
      widgets: [],
      tableData: {},
      tableDataLoaded: {}, // Add this line
    };
  },

  async mounted() {
    this.metrics = dashboardconfig.metrics;
    this.title = dashboardconfig.title;
    this.widgets = dashboardconfig.widgets;
    this.metricsWithValues = await Promise.all(
      this.metrics.map(async (metric) => ({
        ...metric,
        value: await this.getMetricValue(metric.value),
      }))
    );

    this.getTableData();
    this.renderCharts();
  },

  methods: {
    async getTableData() {
      const getFunction = resourceFunctions.find(
        (f) => f.key === "getResources"
      );

      if (getFunction) {
        try {
          for (const widget of this.widgets) {
            if (widget.type === "tableview") {
              const returnedData = await getFunction.value({
                resource: widget.resource.name,
                params: {},
              });
              this.tableData[widget.resource.name] = returnedData.resources;
              this.tableDataLoaded[widget.resource.name] = true; // Update this line
            }
          }
        } catch (error) {
          console.error(error.message);
        }
      } else {
        console.warn(`function not found in resourceFunctions`);
      }
    },
    async getMetricValue(endpoint) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${endpoint}`
        );
        return response.data.count;
      } catch (error) {
        console.error("Error fetching data:", error);
        return 0;
      }
    },
    renderCharts() {
      this.widgets.forEach((widget, index) => {
        if (widget.type !== "tableview") {
          Highcharts.chart(`chart-${index}`, this.getChartOptions(widget));
        }
      });
    },
    getChartOptions(widget) {
      const options = {
        chart: {
          type: widget.type,
        },
        title: {
          text: widget.title,
        },
      };

      switch (widget.type) {
        case "column":
        case "bar":
          options.xAxis = {
            categories: widget.data.categories,
          };
          options.yAxis = {
            min: 0,
            title: {
              text: "Amount",
            },
          };
          options.series = widget.data.series;
          break;
        case "pie":
          options.series = widget.data.series;
          break;
        case "line":
          options.xAxis = {
            categories: widget.data.categories,
          };
          options.series = widget.data.series;
          break;
        default:
          break;
      }

      return options;
    },
  },
};
</script>
