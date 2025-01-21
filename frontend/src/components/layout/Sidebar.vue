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
      <a-menu-item key="/material">
        <tool-outlined />
        <span>Material</span>
      </a-menu-item>
      <a-menu-item key="/product">
        <gold-outlined />
        <span>Product</span>
      </a-menu-item>
      <a-menu-item key="/order">
        <profile-outlined />
        <span>Order List</span>
      </a-menu-item>
      <a-menu-item key="/tracking">
        <aim-outlined />
        <span>Tracking</span>
      </a-menu-item>
      <a-menu-item key="/quality">
        <search-outlined />
        <span>Quality Control</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DashboardOutlined, GoldOutlined, ProfileOutlined, AimOutlined, ToolOutlined, SearchOutlined } from '@ant-design/icons-vue'
import logo from '../../assets/logo.png'

const router = useRouter()
const route = useRoute();
const collapsed = ref(false)
const selectedKeys = ref([route.path]);

watch(() => route.path,
    (newPath) => {
      selectedKeys.value = [newPath];
    }
);

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
