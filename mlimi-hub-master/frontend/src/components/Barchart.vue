<template>
  <div>
    <h1 class="font-bold text-xl">My Profits </h1>
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import PlanetChartData from "../data/chartData"

export default {
  name: 'Barchart',
  data() {
    return {
      planetChartData: PlanetChartData,
      isMenuOpen: true,
    }
  },
  mounted() {
    const ctx = document.getElementById('planet-chart');
    new Chart(ctx, this.planetChartData);
  }
}
</script>
