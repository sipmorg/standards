<template>
  <div class="standard-page">
    <div class="container container-narrow">
      <TheBreadcrumbs :items="breadcrumbs" />

      <div v-if="!standard && loading" class="loading-state">
        <p>Loading standard...</p>
      </div>

      <div v-else-if="!standard && error" class="error-state glass">
        <h1>Standard Not Found</h1>
        <p>{{ error }}</p>
        <router-link to="/" class="back-link">← Back to Standards</router-link>
      </div>

      <article v-else-if="standard" class="standard">
        <header class="standard-header">
          <div class="standard-meta glass">
            <div class="meta-item">
              <span class="meta-label">Document Number</span>
              <span class="meta-value">{{ standard.id }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Edition</span>
              <span class="meta-value">{{ standard.attributes?.edition || '1.0' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date</span>
              <span class="meta-value">{{ formatDate(standard.attributes?.revdate) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Status</span>
              <Badge :variant="statusVariant">{{ statusText }}</Badge>
            </div>
          </div>

          <h1 class="standard-title">{{ standard.title }}</h1>

          <div v-if="standard.attributes?.workgroup" class="standard-workgroup">
            <span>Developed by:</span> {{ standard.attributes.workgroup }}
          </div>
        </header>

        <div class="standard-layout">
          <div class="standard-content" v-html="standard.html"></div>
        </div>

        <!-- TOC positioned via CSS based on viewport -->
        <TableOfContents
          v-if="standard.toc && standard.toc.length > 0"
          :sections="standard.toc"
          class="standard-toc-wrapper"
        />

        <footer class="standard-footer">
          <div class="footer-actions">
            <GradientButton variant="gold" @click="downloadPdf">
              Download PDF
            </GradientButton>
            <GradientButton variant="outline" @click="viewOnGithub">
              View on GitHub
            </GradientButton>
          </div>
        </footer>
      </article>

      <div v-else class="error-state glass">
        <h1>Standard Not Found</h1>
        <p>The requested standard could not be found.</p>
        <router-link to="/" class="back-link">← Back to Standards</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TheBreadcrumbs from '@/components/layout/TheBreadcrumbs.vue'
import Badge from '@/components/ui/Badge.vue'
import GradientButton from '@/components/ui/GradientButton.vue'
import TableOfContents from '@/components/navigation/TableOfContents.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useStandard } from '@/composables/useStandard.js'

const route = useRoute()
const { standard: standardData, loading, error, hasStaticData, loadStandard } = useStandard()

const standard = ref(standardData.value)

const standardId = computed(() => route.params.id)

const statusVariant = computed(() => {
  const stage = standard.value?.attributes?.docstage
  if (stage === '60') return 'success'
  if (stage === '40') return 'warning'
  return 'info'
})

const statusText = computed(() => {
  const stage = standard.value?.attributes?.docstage
  if (stage === '60') return 'Published'
  if (stage === '40') return 'Draft'
  if (stage === '30') return 'Committee Draft'
  return 'Under Development'
})

const breadcrumbs = computed(() => {
  const standardData = standard.value
  const category = standardData?.category || 'standards'
  const categoryNames = {
    foundation: 'Foundation',
    quality: 'Quality',
    science: 'Science',
    governance: 'Governance'
  }

  return [
    { label: categoryNames[category] || 'Standards', path: `/${category}` },
    { label: standardData?.id || standardId.value, path: route.path }
  ]
})

function formatDate(dateStr) {
  if (!dateStr) return 'TBD'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function downloadPdf() {
  alert('PDF download will be available once the standard is finalized.')
}

function viewOnGithub() {
  window.open(`https://github.com/sipmorg/standards/tree/main/${standardId.value}`, '_blank')
}

onMounted(async () => {
  if (!hasStaticData.value && !standard.value) {
    const data = await loadStandard()
    if (data) {
      standard.value = data
    }
  }
})

useSeo({
  title: computed(() => standard.value?.title || 'Loading Standard'),
  description: computed(() => standard.value?.attributes?.['title-intro-en'] || 'SIPM Standard'),
  url: computed(() => route.path)
})
</script>

<style scoped>
.standard-page {
  padding: var(--spacing-xl) 0 var(--spacing-3xl);
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.error-state h1 {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  display: inline-block;
  margin-top: var(--spacing-lg);
}

.standard-header {
  margin-bottom: var(--spacing-xl);
}

.standard-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.meta-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.meta-value {
  font-weight: var(--font-weight-medium);
}

.standard-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-md);
}

.standard-workgroup {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.standard-workgroup span {
  font-weight: var(--font-weight-medium);
}

.standard-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

.standard-content {
  line-height: var(--line-height-relaxed);
  min-width: 0; /* Prevent overflow */
}

/* Desktop: Position TOC as sidebar */
@media (min-width: 1025px) {
  .standard-page :deep(.standard-toc-wrapper) {
    position: fixed;
    top: calc(var(--header-height) + var(--spacing-xl));
    left: max(calc((100vw - 1200px) / 2 + var(--spacing-lg)), var(--spacing-lg));
    width: 250px;
    max-height: calc(100vh - var(--header-height) - var(--spacing-2xl));
    overflow-y: auto;
  }

  .standard-layout {
    margin-left: calc(250px + var(--spacing-xl));
  }
}

.standard-footer {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.footer-actions {
  display: flex;
  gap: var(--spacing-md);
}

@media (max-width: 1024px) {
  .standard-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 640px) {
  .standard-meta {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .footer-actions {
    flex-direction: column;
  }

  .standard-title {
    font-size: var(--font-size-xl);
  }
}
</style>

<style>
/* Global styles for AsciiDoc content */
.standard-content h1 {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-lg);
}

.standard-content h2 {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
}

.standard-content h3 {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
}

.standard-content p {
  margin-bottom: var(--spacing-md);
}

.standard-content ul,
.standard-content ol {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-xl);
}

.standard-content li {
  margin-bottom: var(--spacing-sm);
}

.standard-content table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-lg) 0;
}

.standard-content th,
.standard-content td {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  text-align: left;
}

.standard-content th {
  background: var(--color-glass-dark);
  font-weight: var(--font-weight-semibold);
}

.standard-content tr:nth-child(even) td {
  background: var(--color-glass);
}

.standard-content pre {
  background: var(--color-glass-dark);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
}

.standard-content code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.standard-content blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  color: var(--color-text-light);
  font-style: italic;
}

.standard-content .admonitionblock {
  padding: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  border-radius: var(--radius-md);
  background: var(--color-glass);
}

.standard-content .admonitionblock.note {
  border-left: 4px solid var(--color-info, #3498db);
}

.standard-content .admonitionblock.warning {
  border-left: 4px solid var(--color-warning, #f39c12);
}

.standard-content .admonitionblock.important {
  border-left: 4px solid var(--color-error, #e74c3c);
}

.standard-content a {
  color: var(--color-primary);
  text-decoration: underline;
}

.standard-content .exampleblock {
  background: var(--color-glass);
  padding: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  border-radius: var(--radius-md);
}

.standard-content #toc {
  display: none;
}

/* Mobile fixes for content */
@media (max-width: 768px) {
  .standard-content table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }

  .standard-content pre {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    font-size: var(--font-size-xs);
  }

  .standard-content ul,
  .standard-content ol {
    padding-left: var(--spacing-lg);
  }

  .standard-content h1 {
    font-size: var(--font-size-xl);
  }

  .standard-content h2 {
    font-size: var(--font-size-lg);
  }

  .standard-content h3 {
    font-size: var(--font-size-base);
  }

  .standard-content img {
    max-width: 100%;
    height: auto;
  }
}
</style>
