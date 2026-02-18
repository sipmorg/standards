<template>
  <div class="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <TheHeader />
    <main id="main-content" class="main-content">
      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import { useGlobalSeo } from '@/composables/useSeo.js'

// Initialize global SEO
useGlobalSeo()
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: var(--header-height, 80px);
}
</style>
