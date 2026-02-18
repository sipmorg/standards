<template>
  <div class="standards-page">
    <div class="container">
      <TheBreadcrumbs :items="breadcrumbs" />

      <div class="page-layout">
        <aside class="page-sidebar">
          <nav class="sidebar-nav">
            <router-link to="/foundation" class="sidebar-link" :class="{ active: isActive('/foundation') }">
              Foundation
            </router-link>
            <router-link to="/quality" class="sidebar-link" :class="{ active: isActive('/quality') }">
              Quality
            </router-link>
            <router-link to="/science" class="sidebar-link" :class="{ active: isActive('/science') }">
              Science
            </router-link>
            <router-link to="/governance" class="sidebar-link" :class="{ active: isActive('/governance') }">
              Governance
            </router-link>
          </nav>
        </aside>

        <main class="page-content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheBreadcrumbs from '@/components/layout/TheBreadcrumbs.vue'
import { useSeo } from '@/composables/useSeo.js'

const route = useRoute()

useSeo({
  title: 'Standards',
  description: 'Explore SIPM\'s comprehensive standards for phytomedicine covering foundation, quality, science, and governance.',
  url: '/'
})

const breadcrumbs = computed(() => {
  const items = []
  if (route.name && route.name !== 'standards-index') {
    items.push({
      label: route.meta?.title || route.name?.charAt(0).toUpperCase() + route.name?.slice(1),
      path: route.path
    })
  }
  return items
})

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.standards-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.page-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-2xl);
}

.page-sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-xl));
  height: fit-content;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.sidebar-link {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--color-glass-dark);
  color: var(--color-primary);
}

.sidebar-link.active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .page-sidebar {
    position: static;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
  }
}
</style>
