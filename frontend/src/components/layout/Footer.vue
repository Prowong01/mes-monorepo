<template>
  <a-layout-footer style="text-align: center">
    MES System ©{{ currentYear }} Created by Eddie
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>
