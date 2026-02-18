<template>
  <!-- Mobile TOC Dropdown -->
  <div v-if="isMobile" class="mobile-toc" :class="{ 'mobile-toc-expanded': isExpanded }">
    <button
      class="mobile-toc-trigger"
      @click="toggleExpand"
      :aria-expanded="isExpanded"
      aria-controls="mobile-toc-content"
    >
      <div class="trigger-content">
        <span class="trigger-label">Contents</span>
        <span class="trigger-current">{{ currentSectionTitle }}</span>
      </div>
      <svg
        class="trigger-arrow"
        :class="{ 'arrow-rotated': isExpanded }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>

    <Transition name="toc-expand">
      <div v-if="isExpanded" id="mobile-toc-content" class="mobile-toc-content">
        <nav class="mobile-toc-nav">
          <ul class="mobile-toc-list">
            <li
              v-for="section in flatSections"
              :key="section.id"
              class="mobile-toc-item"
              :class="{
                'toc-active': activeSectionId === section.id,
                'toc-level-2': section.level === 2,
                'toc-level-3': section.level === 3
              }"
            >
              <a :href="`#${section.id}`" @click="handleNavClick(section.id)">
                {{ section.title }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>

  <!-- Desktop Sidebar TOC -->
  <aside v-else class="desktop-toc glass">
    <h3>Contents</h3>
    <nav>
      <ul class="toc-list">
        <li
          v-for="section in flatSections"
          :key="section.id"
          class="toc-item"
          :class="{
            'toc-active': activeSectionId === section.id,
            'toc-level-2': section.level === 2,
            'toc-level-3': section.level === 3
          }"
        >
          <a :href="`#${section.id}`">{{ section.title }}</a>
        </li>
      </ul>
    </nav>
    <div class="toc-progress">
      <div class="toc-progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    default: () => []
  }
})

// State
const isMobile = ref(false)
const isExpanded = ref(false)
const activeSectionId = ref('')
const progressPercent = ref(0)

// Flatten nested sections for easier iteration
const flatSections = computed(() => {
  const result = []
  function flatten(items, level = 2) {
    for (const item of items) {
      result.push({
        id: item.id,
        title: item.title,
        level
      })
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1)
      }
    }
  }
  flatten(props.sections)
  return result
})

// Get current section title
const currentSectionTitle = computed(() => {
  if (!activeSectionId.value && flatSections.value.length > 0) {
    return flatSections.value[0].title
  }
  const section = flatSections.value.find(s => s.id === activeSectionId.value)
  return section?.title || 'Overview'
})

// Toggle mobile TOC
function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// Handle navigation click
function handleNavClick(sectionId) {
  activeSectionId.value = sectionId
  isExpanded.value = false
}

// Check for mobile viewport
function checkMobile() {
  isMobile.value = window.innerWidth <= 1024
}

// Scroll spy - detect which section is currently in view
function handleScroll() {
  if (flatSections.value.length === 0) return

  const scrollY = window.scrollY
  const headerHeight = 80 // Approximate header height
  const offset = headerHeight + 100 // Offset for better detection

  // Find the current section
  let currentId = flatSections.value[0]?.id

  for (const section of flatSections.value) {
    const element = document.getElementById(section.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const top = rect.top + scrollY

      if (scrollY >= top - offset) {
        currentId = section.id
      }
    }
  }

  activeSectionId.value = currentId

  // Calculate progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    progressPercent.value = Math.min(100, (scrollY / docHeight) * 100)
  }
}

// Close TOC when clicking outside
function handleClickOutside(event) {
  const tocElement = document.querySelector('.mobile-toc')
  if (tocElement && !tocElement.contains(event.target)) {
    isExpanded.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)

  // Initial scroll check
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

// Watch for sections changes
watch(() => props.sections, () => {
  setTimeout(handleScroll, 100)
}, { deep: true })
</script>

<style scoped>
/* Mobile TOC */
.mobile-toc {
  position: sticky;
  top: var(--header-height);
  z-index: 50;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  margin: 0 calc(-1 * var(--spacing-md));
}

.mobile-toc-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--spacing-sm);
}

.trigger-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.trigger-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.trigger-current {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trigger-arrow {
  width: 20px;
  height: 20px;
  color: var(--color-text-light);
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}

.arrow-rotated {
  transform: rotate(180deg);
}

.mobile-toc-content {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  max-height: 60vh;
  overflow-y: auto;
}

.mobile-toc-nav {
  padding: var(--spacing-sm) 0;
}

.mobile-toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-toc-item {
  margin: 0;
}

.mobile-toc-item a {
  display: block;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.mobile-toc-item.toc-level-3 a {
  padding-left: var(--spacing-xl);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.mobile-toc-item a:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.mobile-toc-item.toc-active a {
  background: rgba(59, 126, 128, 0.08);
  color: var(--color-primary);
  border-left-color: var(--color-accent);
  font-weight: var(--font-weight-medium);
}

/* Desktop TOC */
.desktop-toc {
  padding: var(--spacing-lg);
  height: fit-content;
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-xl));
  max-height: calc(100vh - var(--header-height) - var(--spacing-2xl));
  overflow-y: auto;
}

.desktop-toc h3 {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-md);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: var(--spacing-xs);
}

.toc-item a {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-left: 2px solid transparent;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.toc-item.toc-level-3 a {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  padding-left: var(--spacing-md);
}

.toc-item a:hover {
  color: var(--color-primary);
  background: var(--color-background);
}

.toc-item.toc-active a {
  color: var(--color-primary);
  border-left-color: var(--color-accent);
  background: rgba(59, 126, 128, 0.05);
  font-weight: var(--font-weight-medium);
}

.toc-progress {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.toc-progress-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

/* Transitions */
.toc-expand-enter-active,
.toc-expand-leave-active {
  transition: all var(--transition-normal);
}

.toc-expand-enter-from,
.toc-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.toc-expand-enter-to,
.toc-expand-leave-from {
  opacity: 1;
  max-height: 60vh;
}
</style>
