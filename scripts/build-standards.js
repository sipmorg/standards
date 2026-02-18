/**
 * Build script to convert AsciiDoc standards to JSON
 * Run: node scripts/build-standards.js
 *
 * Outputs:
 * - src/content/standards/*.json - Full standard content
 * - src/content/standards/index.json - List of all standards
 * - public/content/standards/search-index.json - Search index for client-side search
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import Asciidoctor from '@asciidoctor/core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const asciidoctor = Asciidoctor()

// Standards are in the parent directory (root of repo)
const STANDARDS_SRC = join(__dirname, '..')
const OUTPUT_DIR = join(__dirname, '../src/content/standards')
const PUBLIC_DIR = join(__dirname, '../public/content/standards')

/**
 * Extract searchable content from a parsed document
 */
function extractSearchContent(doc, standardId, title) {
  const searchItems = []

  // Add the standard itself as a search item
  searchItems.push({
    id: standardId,
    type: 'standard',
    title: title,
    category: getCategory(standardId),
    path: `/${standardId}`,
    content: ''
  })

  // Extract text content from blocks within a section
  function extractBlockText(blocks, maxDepth = 2) {
    const texts = []
    for (const block of blocks) {
      const context = block.getContext()

      if (context === 'paragraph') {
        texts.push(block.getSource())
      } else if (context === 'ulist' || context === 'olist') {
        const items = block.getItems()
        for (const item of items) {
          texts.push(item.getText())
        }
      } else if (context === 'table') {
        // Skip tables for now - too complex
      } else if (context === 'example' || context === 'sidebar') {
        const innerBlocks = block.getBlocks()
        if (innerBlocks && innerBlocks.length > 0) {
          texts.push(extractBlockText(innerBlocks, maxDepth - 1))
        }
      }
    }
    return texts.join(' ').substring(0, 300)
  }

  // Extract sections recursively
  function processSections(blocks, parentPath = '') {
    for (const block of blocks) {
      if (block.getContext() === 'section') {
        const sectionId = block.getId()
        const sectionTitle = block.getTitle()
        const sectionLevel = block.getLevel()
        const sectionPath = parentPath ? `${parentPath}/${sectionId}` : sectionId

        // Get text content from blocks within the section
        const innerBlocks = block.getBlocks()
        const textContent = innerBlocks ? extractBlockText(innerBlocks) : ''

        searchItems.push({
          id: `${standardId}-${sectionId}`,
          type: 'section',
          title: sectionTitle,
          standardId: standardId,
          standardTitle: title,
          level: sectionLevel,
          path: `/${standardId}#${sectionId}`,
          content: textContent
        })

        // Process child sections
        processSections(block.getBlocks(), sectionPath)
      }
    }
  }

  processSections(doc.getBlocks())

  return searchItems
}

function parseAdocFile(content, filePath) {
  const baseDir = dirname(filePath)

  const doc = asciidoctor.load(content, {
    base_dir: baseDir,
    safe: 'safe',
    attributes: {
      'skip-front-matter': true,
      'sectnums': true,
      'toc': 'left',
      'linkcss': false,
      'copycss': false
    }
  })

  const attributes = {}
  const attrNames = [
    'docnumber', 'partnumber', 'edition', 'revdate', 'copyright-year',
    'language', 'title-intro-en', 'title-main-en', 'title-part-en',
    'doctype', 'docstage', 'docsubstage', 'technical-committee',
    'workgroup', 'library-ics'
  ]

  for (const name of attrNames) {
    const value = doc.getAttribute(name)
    if (value) attributes[name] = value
  }

  const title = doc.getTitle() || attributes['title-main-en'] || 'Untitled Standard'
  const html = doc.convert()

  function extractSections(blocks) {
    const sections = []
    for (const block of blocks) {
      if (block.getContext() === 'section') {
        const section = {
          id: block.getId(),
          title: block.getTitle(),
          level: block.getLevel(),
          children: extractSections(block.getBlocks())
        }
        sections.push(section)
      }
    }
    return sections
  }

  const toc = extractSections(doc.getBlocks())

  return {
    id: basename(dirname(filePath)),
    title,
    attributes,
    html,
    toc,
    raw: content,
    category: getCategory(basename(dirname(filePath))),
    status: attributes.docstage === '60' ? 'published' : 'draft',
    date: attributes.revdate || new Date().toISOString().split('T')[0]
  }
}

async function processStandards() {
  console.log('Building standards content...')

  await mkdir(OUTPUT_DIR, { recursive: true })
  await mkdir(PUBLIC_DIR, { recursive: true })

  const standards = []
  const searchIndex = []
  const standardDirs = await readdir(STANDARDS_SRC)

  for (const dir of standardDirs) {
    if (!dir.startsWith('SIPM-')) continue

    const standardPath = join(STANDARDS_SRC, dir, 'document.adoc')
    try {
      const content = await readFile(standardPath, 'utf-8')
      const parsed = parseAdocFile(content, standardPath)

      const jsonStr = JSON.stringify(parsed, null, 2)

      await writeFile(join(OUTPUT_DIR, `${dir}.json`), jsonStr)
      await writeFile(join(PUBLIC_DIR, `${dir}.json`), jsonStr)

      standards.push({
        id: parsed.id,
        title: parsed.title,
        number: dir,
        category: getCategory(dir),
        status: parsed.attributes.docstage === '60' ? 'published' : 'draft',
        date: parsed.attributes.revdate || new Date().toISOString().split('T')[0]
      })

      // Extract search content for this standard
      const baseDir = dirname(standardPath)
      const doc = asciidoctor.load(content, {
        base_dir: baseDir,
        safe: 'safe',
        attributes: {
          'skip-front-matter': true,
          'sectnums': true
        }
      })
      const searchContent = extractSearchContent(doc, dir, parsed.title)
      searchIndex.push(...searchContent)

      console.log(`  Processed: ${dir} - ${parsed.title}`)
    } catch (err) {
      console.log(`  Skipped: ${dir} (${err.message})`)
    }
  }

  const indexJson = JSON.stringify(standards, null, 2)
  await writeFile(join(OUTPUT_DIR, 'index.json'), indexJson)
  await writeFile(join(PUBLIC_DIR, 'index.json'), indexJson)

  // Write search index to public directory for client-side access
  const searchIndexJson = JSON.stringify(searchIndex, null, 2)
  await writeFile(join(PUBLIC_DIR, 'search-index.json'), searchIndexJson)
  console.log(`\nGenerated search index with ${searchIndex.length} items`)

  console.log(`\nBuilt ${standards.length} standards to ${OUTPUT_DIR}`)
  console.log(`Also copied to ${PUBLIC_DIR}`)

  return standards
}

function getCategory(number) {
  const num = parseInt(number.replace('SIPM-', ''))
  if (num < 100) return 'foundation'
  if (num < 200) return 'governance'
  if (num < 300) return 'quality'
  if (num < 400) return 'science'
  if (num < 500) return 'science'
  return 'governance'
}

processStandards().catch(console.error)

export { parseAdocFile, processStandards }
