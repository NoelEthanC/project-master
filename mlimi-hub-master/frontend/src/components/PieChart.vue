<template>
  <div>
    <canvas id="pie-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import PlanetChartData from "../data/pieChartData"

export default {
  name: 'Piechart',
  data() {
    return {
      planetChartData: PlanetChartData
    }
  },
  mounted() {
    const ctx = document.getElementById('pie-chart');
    new Chart(ctx, this.planetChartData);
  }
}
</script>
