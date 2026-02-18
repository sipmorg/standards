<template>
  <nav class="breadcrumbs" v-if="items.length > 0" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <a href="/" class="breadcrumb-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="sr-only">Home</span>
        </a>
      </li>
      <li class="breadcrumb-item">
        <span class="breadcrumb-separator">{{ separator }}</span>
        <router-link to="/" class="breadcrumb-link">Standards</router-link>
      </li>
      <li v-for="(item, index) in items" :key="item.path" class="breadcrumb-item">
        <span class="breadcrumb-separator">{{ separator }}</span>
        <router-link
          v-if="index < items.length - 1"
          :to="item.path"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb-current" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  separator: {
    type: String,
    default: '/'
  }
})
</script>

<style scoped>
.breadcrumbs {
  padding: var(--spacing-md) 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-xs);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-separator {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  margin: 0 var(--spacing-xs);
}

.breadcrumb-current {
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
