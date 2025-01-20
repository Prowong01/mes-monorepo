<template>
  <div class="dashboard">

    <div class="metric">
      <h2>Production Status</h2>
      <canvas ref="productionStatusChart"></canvas>
    </div>

    <div class="metric">
      <h2>Machine Utilization</h2>
      <canvas ref="machineUtilizationChart"></canvas>
    </div>

    <div class="metric">
      <h2>Defect Rate</h2>
      <p>{{ defectRate.toFixed(2) }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

const productionStatusChart = ref<HTMLCanvasElement | null>(null);
const machineUtilizationChart = ref<HTMLCanvasElement | null>(null);
const defectRate = ref(0);

// 获取仪表盘数据
onMounted(async () => {
  try {
    const response = await axios.get('/api/dashboard/data');
    const { productionStatus, machineUtilization, defectRate: rate } = response.data;

    defectRate.value = rate;

    if (productionStatusChart.value) {
      new Chart(productionStatusChart.value, {
        type: 'bar',
        data: {
          labels: productionStatus.map((item: any) => item.status),
          datasets: [
            {
              label: 'Production Status',
              data: productionStatus.map((item: any) => item.count),
              backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
            },
          ],
        },
      });
    }

    if (machineUtilizationChart.value) {
      new Chart(machineUtilizationChart.value, {
        type: 'line',
        data: {
          labels: machineUtilization.map((item: any) => `Machine ${item.machine_id}`),
          datasets: [
            {
              label: 'Utilization (%)',
              data: machineUtilization.map((item: any) => item.utilization),
              borderColor: '#FF6384',
              fill: false,
            },
          ],
        },
      });
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
.metric {
  margin-bottom: 40px;
}
</style>
