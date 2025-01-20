<template>
  <a-layout-sider v-model:collapsed="collapsed" theme="light" collapsible>
    <div class="logo-container">
      <img :src="logo" alt="Logo" class="logo" />
      <span v-if="!collapsed" class="company-name">A Serious Company</span>
    </div>
    <a-menu theme="light" mode="inline" v-model:selectedKeys="selectedKeys" @click="handleMenuClick">
      <a-menu-item key="/">
        <dashboard-outlined />
        <span>Dashboard</span>
      </a-menu-item>
      <a-menu-item key="/production">
        <monitor-outlined />
        <span>Production</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DashboardOutlined, MonitorOutlined, BarChartOutlined } from '@ant-design/icons-vue'
import logo from '../../assets/logo.png'

const router = useRouter()
const collapsed = ref(false)
const selectedKeys = ref(['/']) // default route

const handleMenuClick = ({ key }) => {
  router.push(key)
}
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 16px;
  background: #fff;
}

.logo {
  height: 32px;
  width: 32px;
  background: rgba(255, 255, 255, 0.3);
}

.company-name {
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
}
</style>
