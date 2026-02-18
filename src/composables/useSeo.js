/**
 * useSeo Composable for SIPM Standards
 */

import { useHead } from '@unhead/vue'
import { computed, unref } from 'vue'

const defaultConfig = {
  siteName: 'SIPM Standards',
  siteUrl: 'https://sipm.org/standards',
  defaultImage: '/standards/images/og-default.jpg',
  twitterHandle: '@sipm_org'
}

export function useSeo(options) {
  const {
    title,
    description,
    image,
    url,
    type = 'website'
  } = options

  const fullTitle = computed(() => {
    const titleValue = unref(title)
    if (!titleValue) return defaultConfig.siteName
    return `${titleValue} | SIPM Standards`
  })

  const fullImage = computed(() => {
    const imageValue = unref(image)
    if (!imageValue) return defaultConfig.defaultImage
    return imageValue.startsWith('http') ? imageValue : `${defaultConfig.siteUrl}${imageValue}`
  })

  const fullUrl = computed(() => {
    const urlValue = unref(url)
    if (!urlValue) return defaultConfig.siteUrl
    return urlValue.startsWith('http') ? urlValue : `${defaultConfig.siteUrl}${urlValue}`
  })

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: fullImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: defaultConfig.siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: fullImage },
      { name: 'twitter:site', content: defaultConfig.twitterHandle }
    ],
    link: [
      { rel: 'canonical', href: fullUrl }
    ]
  })
}

export function useGlobalSeo() {
  useHead({
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#3b7e80' }
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/standards/favicon.svg' }
    ]
  })
}
