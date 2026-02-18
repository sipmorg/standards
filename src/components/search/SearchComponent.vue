<template>
  <div class="search-container" ref="searchContainer">
    <!-- Search Input -->
    <div class="search-input-wrapper" :class="{ 'search-focused': isFocused, 'search-expanded': isMobileExpanded }">
      <button
        v-if="isMobile && !isMobileExpanded"
        class="search-toggle"
        @click="toggleMobileSearch"
        aria-label="Open search"
      >
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      <template v-else>
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          ref="searchInput"
          v-model="query"
          type="text"
          class="search-input"
          :placeholder="placeholder"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter="selectCurrent"
          @keydown.escape="closeSearch"
          aria-label="Search standards"
          aria-autocomplete="list"
          :aria-expanded="showResults && results.length > 0"
          aria-controls="search-results"
        />

        <button
          v-if="query"
          class="search-clear"
          @click="clearSearch"
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Mobile Close Button -->
        <button
          v-if="isMobile && isMobileExpanded"
          class="search-close"
          @click="closeMobileSearch"
          aria-label="Close search"
        >
          Cancel
        </button>
      </template>
    </div>

    <!-- Search Results Dropdown -->
    <Transition name="search-results">
      <div
        v-if="showResults && results.length > 0"
        id="search-results"
        class="search-results"
        :class="{ 'search-results-mobile': isMobile && isMobileExpanded }"
        role="listbox"
      >
        <div class="results-header" v-if="results.length > 0">
          <span class="results-count">{{ results.length }} result{{ results.length !== 1 ? 's' : '' }}</span>
        </div>

        <ul class="results-list" ref="resultsList">
          <li
            v-for="(result, index) in results"
            :key="result.id"
            class="result-item"
            :class="{ 'result-selected': selectedIndex === index }"
            @click="selectResult(result)"
            @mouseenter="selectedIndex = index"
            role="option"
            :aria-selected="selectedIndex === index"
          >
            <div class="result-content">
              <div class="result-type">
                <span class="type-badge" :class="`type-${result.type}`">
                  {{ result.type === 'standard' ? 'Standard' : 'Section' }}
                </span>
                <span v-if="result.category" class="category-badge">{{ result.category }}</span>
              </div>

              <div class="result-title" v-html="highlightMatch(result.title)"></div>

              <div v-if="result.type === 'section'" class="result-context">
                {{ result.standardTitle }}
              </div>

              <div v-if="result.content" class="result-preview" v-html="highlightMatch(truncate(result.content, 80))">
              </div>
            </div>

            <svg class="result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </li>
        </ul>

        <div class="results-footer">
          <span class="keyboard-hint">
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
            <kbd>Enter</kbd> to select
            <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-else-if="showResults && query && !isLoading && results.length === 0"
        class="search-results search-no-results"
      >
        <div class="no-results">
          <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M8 8l6 6M14 8l-6 6"/>
          </svg>
          <p>No results found for "{{ query }}"</p>
          <p class="no-results-hint">Try searching for terms like "adaptogen", "GACP", or "DNA barcoding"</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MiniSearch from 'minisearch'

const router = useRouter()

// State
const query = ref('')
const results = ref([])
const selectedIndex = ref(0)
const isFocused = ref(false)
const isLoading = ref(true)
const showResults = ref(false)
const isMobile = ref(false)
const isMobileExpanded = ref(false)
const searchInput = ref(null)
const searchContainer = ref(null)
const resultsList = ref(null)

// MiniSearch instance
let miniSearch = null

// Props
const placeholder = 'Search standards...'

// Initialize MiniSearch
async function initializeSearch() {
  try {
    const response = await fetch('/standards/content/standards/search-index.json')
    const searchIndex = await response.json()

    miniSearch = new MiniSearch({
      fields: ['title', 'content', 'standardTitle', 'category'],
      storeFields: ['id', 'type', 'title', 'path', 'content', 'standardId', 'standardTitle', 'category', 'level'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
        boost: { title: 3, standardTitle: 2, content: 1 },
        combineWith: 'AND'
      }
    })

    miniSearch.addAll(searchIndex)
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load search index:', error)
    isLoading.value = false
  }
}

// Perform search
function performSearch() {
  if (!miniSearch || !query.value.trim()) {
    results.value = []
    return
  }

  try {
    const searchResults = miniSearch.search(query.value, {
      fuzzy: 0.3,
      prefix: true,
      filter: (result) => result.score > 0.1
    })

    // Group results: show standards first, then sections
    const standards = searchResults.filter(r => r.type === 'standard')
    const sections = searchResults.filter(r => r.type === 'section')

    // Sort sections by level (higher level = more important sections)
    sections.sort((a, b) => (a.level || 10) - (b.level || 10))

    results.value = [...standards, ...sections].slice(0, 10)
    selectedIndex.value = 0
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  }
}

// Highlight matching text
function highlightMatch(text) {
  if (!text || !query.value) return text

  const terms = query.value.toLowerCase().split(/\s+/).filter(Boolean)
  let result = text

  for (const term of terms) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
    result = result.replace(regex, '<mark>$1</mark>')
  }

  return result
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Truncate text
function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Navigation
function navigateUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    scrollToSelected()
  }
}

function navigateDown() {
  if (selectedIndex.value < results.value.length - 1) {
    selectedIndex.value++
    scrollToSelected()
  }
}

function scrollToSelected() {
  if (resultsList.value) {
    const selected = resultsList.value.children[selectedIndex.value]
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }
}

// Selection
function selectCurrent() {
  if (results.value[selectedIndex.value]) {
    selectResult(results.value[selectedIndex.value])
  }
}

function selectResult(result) {
  router.push(result.path)
  closeSearch()
  clearSearch()
}

// Clear and close
function clearSearch() {
  query.value = ''
  results.value = []
  selectedIndex.value = 0
}

function closeSearch() {
  showResults.value = false
  isFocused.value = false
}

// Focus handlers
function handleFocus() {
  isFocused.value = true
  if (query.value) {
    showResults.value = true
  }
}

function handleBlur() {
  // Delay to allow click on results
  setTimeout(() => {
    if (!isMobileExpanded.value) {
      showResults.value = false
      isFocused.value = false
    }
  }, 200)
}

// Mobile handlers
function toggleMobileSearch() {
  isMobileExpanded.value = true
  setTimeout(() => {
    searchInput.value?.focus()
  }, 100)
}

function closeMobileSearch() {
  isMobileExpanded.value = false
  closeSearch()
  clearSearch()
}

// Check for mobile
function checkMobile() {
  isMobile.value = window.innerWidth <= 1024
}

// Click outside to close
function handleClickOutside(event) {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false
    if (isMobileExpanded.value) {
      isMobileExpanded.value = false
    }
  }
}

// Watch query changes
watch(query, (newQuery) => {
  if (newQuery.trim()) {
    performSearch()
    showResults.value = true
  } else {
    results.value = []
    showResults.value = false
  }
})

// Lifecycle
onMounted(() => {
  initializeSearch()
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
  transition: all var(--transition-fast);
}

.search-focused .search-input-wrapper {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 126, 128, 0.1);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-light);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--color-text-light);
}

.search-clear {
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
  transition: color var(--transition-fast);
}

.search-clear:hover {
  color: var(--color-text);
}

.search-clear svg {
  width: 14px;
  height: 14px;
}

.search-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
}

/* Search Results Dropdown */
.search-results {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 480px;
  overflow: hidden;
  z-index: 200;
}

.results-header {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.results-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-weight: var(--font-weight-medium);
}

.results-list {
  list-style: none;
  max-height: 360px;
  overflow-y: auto;
  padding: var(--spacing-xs);
  margin: 0;
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.result-item:hover,
.result-selected {
  background: var(--color-background);
}

.result-selected {
  background: rgba(59, 126, 128, 0.08);
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-type {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.type-badge,
.category-badge {
  font-size: 0.625rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.type-badge {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.type-section .type-badge {
  background: var(--color-secondary);
}

.category-badge {
  background: var(--color-accent-light);
  color: var(--color-text);
}

.result-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  line-height: 1.4;
}

.result-title :deep(mark) {
  background: var(--color-accent);
  color: inherit;
  padding: 0 2px;
  border-radius: 2px;
}

.result-context {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: 2px;
}

.result-preview {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin-top: var(--spacing-xs);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-preview :deep(mark) {
  background: var(--color-accent-light);
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
}

.result-arrow {
  width: 16px;
  height: 16px;
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.result-item:hover .result-arrow,
.result-selected .result-arrow {
  opacity: 1;
}

.results-footer {
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.keyboard-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.keyboard-hint kbd {
  display: inline-block;
  padding: 2px 5px;
  font-size: 0.625rem;
  font-family: var(--font-mono);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  box-shadow: 0 1px 0 var(--color-border);
  margin: 0 2px;
}

/* No Results */
.search-no-results {
  padding: var(--spacing-xl);
}

.no-results {
  text-align: center;
  color: var(--color-text-light);
}

.no-results-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.no-results p {
  margin: 0;
}

.no-results-hint {
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-sm) !important;
}

/* Mobile Styles */
@media (max-width: 1024px) {
  .search-container {
    max-width: none;
  }

  .search-input-wrapper {
    background: transparent;
    border: none;
    padding: 0;
  }

  .search-expanded.search-input-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    background: var(--color-surface);
    padding: var(--spacing-md);
    flex-direction: row;
    border-radius: 0;
    gap: var(--spacing-sm);
  }

  .search-expanded .search-input {
    font-size: var(--font-size-lg);
  }

  .search-results-mobile {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 70vh;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    z-index: 400;
  }

  .search-results-mobile .results-list {
    max-height: 50vh;
  }

  .search-close {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-primary);
    background: none;
    border: none;
    cursor: pointer;
  }

  .results-footer {
    display: none;
  }
}

/* Transitions */
.search-results-enter-active,
.search-results-leave-active {
  transition: all var(--transition-fast);
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1024px) {
  .search-results-enter-from,
  .search-results-leave-to {
    transform: translateY(100%);
  }
}
</style>
