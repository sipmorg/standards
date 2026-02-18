<template>
  <div class="content-page">
    <h1 class="page-title">Quality Standards</h1>

    <div class="content-body">
      <p class="lead">
        Ensuring quality from seed to patient through standardized agricultural practices,
        processing methods, and logistics.
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
        Quality standards are developed by specialized working groups that focus
        on specific areas of phytomedicine quality assurance.
      </p>

      <div class="working-groups-list">
        <div class="working-group-card glass">
          <div class="group-header">
            <h3 class="group-name">Agricultural and Collection Practices Working Group</h3>
            <Badge variant="info">Active</Badge>
          </div>
          <p class="group-description">
            Developing guidelines for growing, harvesting, and collecting medicinal plants
            to ensure quality, efficacy, and sustainability of the phytomedicine supply chain.
          </p>
        </div>

        <div class="working-group-card glass">
          <div class="group-header">
            <h3 class="group-name">Preparation and Processing Working Group</h3>
            <Badge variant="info">Active</Badge>
          </div>
          <p class="group-description">
            Establishing best practices for transforming raw plant materials into safe,
            effective, and high-quality phytomedicines through standardized processing techniques.
          </p>
        </div>

        <div class="working-group-card glass">
          <div class="group-header">
            <h3 class="group-name">Preservation, Storage and Logistics Working Group</h3>
            <Badge variant="info">Active</Badge>
          </div>
          <p class="group-description">
            Developing standards for storage conditions, packaging requirements, cold chain
            management, and traceability systems to maintain product integrity.
          </p>
        </div>
      </div>

      <h2>Get Involved</h2>
      <p>
        SIPM members can participate in working groups to contribute to standards development.
        If you have expertise in agricultural practices, processing methods, or logistics for
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
  return allStandards.filter(s => s.category === 'quality')
})

function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

useSeo({
  title: 'Quality Standards',
  description: 'SIPM Quality Standards - Agricultural practices, processing, and logistics in phytomedicine.',
  url: '/quality'
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
