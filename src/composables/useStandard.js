/**
 * Composable for loading standards data
 * Supports both SSG (build-time) and CSR (runtime) loading
 */

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Import all standards JSON files at build time for SSG
const standardsModules = import.meta.glob('/src/content/standards/*.json', { eager: true })

// Build a lookup map from the imported modules
const standardsMap = {}
for (const path in standardsModules) {
  const match = path.match(/\/(SIPM-\d+)\.json$/)
  if (match) {
    standardsMap[match[1]] = standardsModules[path].default || standardsModules[path]
  }
}

export function useStandard() {
  const route = useRoute()
  const loading = ref(false)
  const error = ref(null)

  const standardId = computed(() => route.params.id)

  const standard = computed(() => {
    const id = standardId.value
    if (id && standardsMap[id]) {
      return standardsMap[id]
    }
    return null
  })

  const hasStaticData = computed(() => !!standard.value)

  async function loadStandard() {
    if (standard.value) {
      return standard.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/standards/content/standards/${standardId.value}.json`)
      if (!response.ok) {
        throw new Error('Standard not found')
      }
      const data = await response.json()
      standardsMap[standardId.value] = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to load standard'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    standard,
    standardId,
    loading,
    error,
    hasStaticData,
    loadStandard
  }
}

export function getAllStandards() {
  return Object.values(standardsMap)
}

export function getStandardById(id) {
  return standardsMap[id] || null
}
