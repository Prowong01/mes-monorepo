<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(route, index) in breadcrumbs" :key="index">
      <router-link
          :to="route.path"
      >
        {{route.name }}
      </router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  return route.matched.map(route => ({
    name: route.name,
    path: route.path
  }))
})
</script>
