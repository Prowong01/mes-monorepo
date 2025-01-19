<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Production Status</h2>
        <p>{{ dashboardData.productionStatus }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Machine Utilization</h2>
        <p>{{ dashboardData.machineUtilization }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold">Defect Rate</h2>
        <p>{{ dashboardData.defectRate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const dashboardData = ref({
  productionStatus: 0,
  machineUtilization: 0,
  defectRate: 0,
});

onMounted(async () => {
  try {
    const response = await fetch("/api/dashboard");
    const data = await response.json();
    dashboardData.value = data;
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  }
});
</script>