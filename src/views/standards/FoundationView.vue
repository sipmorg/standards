<template>
  <div class="content-page">
    <h1 class="page-title">Foundation Standards</h1>

    <div class="content-body">
      <p class="lead">
        Establishing the scientific foundation for phytomedicine through standardized
        terminology and classification systems.
      </p>

      <h2>Published Standards</h2>
      <div v-if="standards.length > 0" class="standards-list">
        <router-link
          v-for="standard in standards"
          :key="standard.id"
          :to="`/${standard.id}`"
          class="standard-card glass"
        >
          <div class="standard-header">
            <span class="standard-number">{{ standard.id }}</span>
            <Badge variant="success">{{ standard.status }}</Badge>
          </div>
          <h3 class="standard-title">{{ standard.title }}</h3>
          <p class="standard-date">Published {{ formatDate(standard.date) }}</p>
        </router-link>
      </div>
      <div v-else class="no-standards">
        <p>No standards have been published in this category yet.</p>
      </div>

      <h2>Working Groups</h2>
      <p>
        Foundation standards are developed by specialized working groups that focus
        on specific areas of phytomedicine standardization.
      </p>

      <div class="working-groups-list">
        <div class="working-group-card glass">
          <div class="group-header">
            <h3 class="group-name">Terminology Working Group</h3>
            <Badge variant="info">Active</Badge>
          </div>
          <p class="group-description">
            Developing standardized vocabulary for phytomedicine that encompasses
            botanical identification, chemical constituents, pharmacological activity,
            therapeutic indications, and regulatory classifications.
          </p>
        </div>

        <div class="working-group-card glass">
          <div class="group-header">
            <h3 class="group-name">Taxonomy and Classification Working Group</h3>
            <Badge variant="info">Active</Badge>
          </div>
          <p class="group-description">
            Creating standardized systems for classifying medicinal plants and
            phytomedicines based on botanical, chemical, pharmacological, and therapeutic criteria.
          </p>
        </div>
      </div>

      <h2>Get Involved</h2>
      <p>
        SIPM members can participate in working groups to contribute to standards development.
        If you have expertise in terminology, taxonomy, or classification systems for
        phytomedicine, we invite you to <a href="/members/working-groups">join our working groups</a>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import { useSeo } from '@/composables/useSeo.js'
import { getAllStandards } from '@/composables/useStandard.js'

const allStandards = getAllStandards()

const standards = computed(() => {
  return allStandards.filter(s => s.category === 'foundation')
})

function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

useSeo({
  title: 'Foundation Standards',
  description: 'SIPM Foundation Standards - Terminology and taxonomy standards for phytomedicine.',
  url: '/foundation'
})
</script>

<style scoped>
.content-page {
  max-width: 800px;
}

.page-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
}

.content-body {
  line-height: var(--line-height-relaxed);
}

.content-body h2 {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
}

.lead {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
}

.standards-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.standard-card {
  display: block;
  padding: var(--spacing-lg);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.standard-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.standard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.standard-number {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.standard-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.standard-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.no-standards {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-light);
}

.working-groups-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: var(--spacing-xl) 0;
}

.working-group-card {
  padding: var(--spacing-lg);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.group-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.group-description {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin: 0;
}

.content-body a {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
