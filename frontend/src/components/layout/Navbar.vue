<template>
  <a-layout-header style="background: #fff; padding: 0 16px">
    <div class="header-content">
      <Breadcrumb />
      <div class="header-right">
        <a-space>
          <a-button type="text">
            <notification-outlined />
          </a-button>
          <a-avatar>User</a-avatar>
        </a-space>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NotificationOutlined } from '@ant-design/icons-vue'
import Breadcrumb from '../Breadcrumb.vue'

</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
