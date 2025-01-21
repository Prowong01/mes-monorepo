<template>
  <a-layout>
    <a-layout-content>
      <a-page-header title="Dashboard" />

      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="8">
          <a-card>
            <p>Total Materials</p>
            <h2>{{ dashboardData.summary?.totalMaterials || 0 }}</h2>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card>
            <p>Total Products</p>
            <h2>{{ dashboardData.summary?.totalProducts || 0 }}</h2>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card>
            <p>Total Orders</p>
            <h2>{{ dashboardData.summary?.totalOrders || 0 }}</h2>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="Production Status">
            <v-chart :option="productionStatusChartOption" style="height: 400px" />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="Machine Utilization">
            <v-chart :option="machineUtilizationChartOption" style="height: 400px" />
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 24px">
        <a-col :span="24">
          <a-card title="Defect Rate">
            <v-chart :option="defectRateChartOption" style="height: 400px" />
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import axios from "axios";
import { DashboardData } from "../types";

// 注册 ECharts 组件
use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const dashboardData = ref<DashboardData>({
  summary: { totalMaterials: 0, totalProducts: 0, totalOrders: 0 },
  productionStatus: [],
  machineUtilization: [],
  defectRate: { total: 0, fail: 0, defectRate: 0 },
});

const fetchDashboardData = async () => {
  try {
    const response = await axios.get("/api/dashboard");
    dashboardData.value = response.data;
    console.log(dashboardData.value)
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
};

const productionStatusChartOption = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    bottom: "10%",
    left: "center",
  },
  series: [
    {
      name: "Production Status",
      type: "pie",
      radius: "50%",
      data: dashboardData.value.productionStatus.map((item) => ({
        value: item.count,
        name: item.status,
      })),
    },
  ],
});

const machineUtilizationChartOption = ref({
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: dashboardData.value.machineUtilization.map((item) => `Machine ${item.machine_id}`),
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Utilization",
      type: "bar",
      data: dashboardData.value.machineUtilization.map((item) => item.utilization),
    },
  ],
});

const defectRateChartOption = ref({
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      name: "Defect Rate",
      type: "pie",
      radius: "50%",
      data: [
        { value: dashboardData.value.defectRate.fail, name: "Fail" },
        { value: dashboardData.value.defectRate.total - dashboardData.value.defectRate.fail, name: "Pass" },
      ],
    },
  ],
});

watch(
    () => dashboardData.value,
    (newData) => {
      // 更新生产状态图表
      productionStatusChartOption.value.series[0].data = newData.productionStatus.map((item) => ({
        value: item.count,
        name: item.status,
      }));

      // 更新机器利用率图表
      machineUtilizationChartOption.value.xAxis.data = newData.machineUtilization.map(
          (item) => `Machine ${item.machine_id}`
      );
      machineUtilizationChartOption.value.series[0].data = newData.machineUtilization.map(
          (item) => item.utilization
      );

      // 更新缺陷率图表
      defectRateChartOption.value.series[0].data = [
        { value: newData.defectRate.fail, name: "Fail" },
        { value: newData.defectRate.total - newData.defectRate.fail, name: "Pass" },
      ];
    },
    { deep: true }
);

// 初始化
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
</style>
