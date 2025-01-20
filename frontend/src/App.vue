<template>
  <a-layout class="min-h-screen">
    <Sidebar />
    <a-layout>
      <Navbar />
      <a-layout-content class="px-6">
        <router-view></router-view>
      </a-layout-content>
      <Footer />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
</script>
