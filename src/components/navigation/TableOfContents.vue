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
          <TocTree
            :sections="sections"
            :active-section-id="activeSectionId"
            :expanded-sections="expandedSections"
            @navigate="handleNavClick"
            @toggle="toggleSection"
          />
        </nav>
      </div>
    </Transition>
  </div>

  <!-- Desktop Sidebar TOC -->
  <aside v-else class="desktop-toc glass">
    <h3>Contents</h3>
    <nav>
      <TocTree
        :sections="sections"
        :active-section-id="activeSectionId"
        :expanded-sections="expandedSections"
        @navigate="handleNavClick"
        @toggle="toggleSection"
      />
    </nav>
    <div class="toc-progress">
      <div class="toc-progress-bar" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, defineComponent, h } from 'vue'

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
const expandedSections = ref(new Set())

// Flatten sections for scroll spy
const flatSections = computed(() => {
  const result = []
  function flatten(items) {
    for (const item of items) {
      result.push({
        id: item.id,
        title: item.title,
        level: item.level
      })
      if (item.children && item.children.length > 0) {
        flatten(item.children)
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

// Toggle section expand/collapse
function toggleSection(sectionId) {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
  } else {
    expandedSections.value.add(sectionId)
  }
  // Force reactivity
  expandedSections.value = new Set(expandedSections.value)
}

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
  const headerHeight = 80
  const offset = headerHeight + 100

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

  // Auto-expand parent sections when active section changes
  expandParents(currentId)

  // Calculate progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) {
    progressPercent.value = Math.min(100, (scrollY / docHeight) * 100)
  }
}

// Expand parent sections of active section
function expandParents(sectionId) {
  function findParents(items, parents = []) {
    for (const item of items) {
      if (item.id === sectionId) {
        return parents
      }
      if (item.children && item.children.length > 0) {
        const found = findParents(item.children, [...parents, item.id])
        if (found) return found
      }
    }
    return null
  }

  const parents = findParents(props.sections)
  if (parents) {
    parents.forEach(id => expandedSections.value.add(id))
    expandedSections.value = new Set(expandedSections.value)
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

  // Expand first level sections by default on desktop
  if (!isMobile.value) {
    props.sections.forEach(s => {
      if (s.children && s.children.length > 0) {
        expandedSections.value.add(s.id)
      }
    })
  }

  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})

watch(() => props.sections, () => {
  setTimeout(handleScroll, 100)
}, { deep: true })

// Recursive TOC Tree Component
const TocTree = defineComponent({
  name: 'TocTree',
  props: {
    sections: { type: Array, default: () => [] },
    activeSectionId: { type: String, default: '' },
    expandedSections: { type: Set, default: () => new Set() },
    depth: { type: Number, default: 0 }
  },
  emits: ['navigate', 'toggle'],
  setup(props, { emit }) {
    return () => {
      if (!props.sections || props.sections.length === 0) return null

      return h('ul', {
        class: ['toc-tree', `toc-depth-${props.depth}`]
      }, props.sections.map(section => {
        const hasChildren = section.children && section.children.length > 0
        const isExpanded = props.expandedSections.has(section.id)
        const isActive = props.activeSectionId === section.id
        const level = section.level || 2

        return h('li', {
          class: [
            'toc-node',
            `toc-level-${level}`,
            { 'toc-has-children': hasChildren },
            { 'toc-expanded': isExpanded },
            { 'toc-active': isActive }
          ]
        }, [
          h('div', { class: 'toc-node-content' }, [
            // Expand/collapse arrow
            hasChildren
              ? h('button', {
                  class: ['toc-toggle', { 'toc-toggle-expanded': isExpanded }],
                  onClick: (e) => {
                    e.preventDefault()
                    emit('toggle', section.id)
                  },
                  'aria-label': isExpanded ? 'Collapse' : 'Expand'
                }, [
                  h('svg', {
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2'
                  }, [
                    h('path', { d: 'm9 18 6-6-6-6' })
                  ])
                ])
              : h('span', { class: 'toc-spacer' }),

            // Section link
            h('a', {
              href: `#${section.id}`,
              onClick: (e) => {
                e.preventDefault()
                emit('navigate', section.id)
              },
              class: { 'toc-link-active': isActive }
            }, section.title)
          ]),

          // Children
          hasChildren && isExpanded
            ? h(TocTree, {
                sections: section.children,
                activeSectionId: props.activeSectionId,
                expandedSections: props.expandedSections,
                depth: props.depth + 1,
                onNavigate: (id) => emit('navigate', id),
                onToggle: (id) => emit('toggle', id)
              })
            : null
        ])
      }))
    }
  }
})
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

/* TOC Tree Styles */
.toc-tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-depth-0 {
  padding: 0;
}

.toc-depth-1,
.toc-depth-2 {
  padding-left: var(--spacing-md);
}

.toc-node {
  margin: 0;
}

.toc-node-content {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toc-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  border-radius: var(--radius-sm);
}

.toc-toggle:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.toc-toggle svg {
  width: 14px;
  height: 14px;
  transition: transform var(--transition-fast);
}

.toc-toggle-expanded svg {
  transform: rotate(90deg);
}

.toc-spacer {
  width: 20px;
  flex-shrink: 0;
}

.toc-node-content a {
  flex: 1;
  display: block;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-left: 2px solid transparent;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Level-specific styles */
.toc-level-2 > .toc-node-content a {
  font-weight: var(--font-weight-medium);
}

.toc-level-3 > .toc-node-content a {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  padding-left: var(--spacing-sm);
}

.toc-level-4 > .toc-node-content a {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  opacity: 0.8;
}

.toc-node-content a:hover {
  color: var(--color-primary);
  background: var(--color-background);
}

.toc-node.toc-active > .toc-node-content a {
  color: var(--color-primary);
  border-left-color: var(--color-accent);
  background: rgba(59, 126, 128, 0.08);
  font-weight: var(--font-weight-medium);
}

/* Progress bar */
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

/* Mobile adjustments */
@media (max-width: 1024px) {
  .toc-node-content a {
    padding: var(--spacing-sm) var(--spacing-md);
    border-left: 3px solid transparent;
  }

  .toc-level-3 > .toc-node-content a {
    padding-left: var(--spacing-xl);
  }

  .toc-level-4 > .toc-node-content a {
    padding-left: var(--spacing-2xl);
  }

  .toc-toggle {
    width: 24px;
    height: 24px;
  }

  .toc-spacer {
    width: 24px;
  }
}
</style>
