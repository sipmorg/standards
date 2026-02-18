# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains SIPM (Society for Integrative Phytomedicine) standards documents authored in AsciiDoc format. Documents follow ISO-style conventions and are published via the main website at github.com/sipmorg/sipmorg.github.io.

## Key Commands

### Build Documents

```bash
# Build a single standard to HTML/PDF/XML
metanorma SIPM-0001/document.adoc

# Build with specific output formats
metanorma SIPM-0001/document.adoc -t html,pdf,xml

# Build all standards (if batch script exists)
./scripts/build-all.sh
```

### Validate

```bash
# Check AsciiDoc syntax
asciidoctor -d SIPM-0001/document.adoc

# Validate against schema (requires custom validator)
yaml-validator schemas/standard.schema.yaml SIPM-0001/metadata.yaml
```

## Architecture

### Directory Structure

```
SIPM-XXXX/
├── document.adoc          # Main document - includes all sections
├── sections/
│   ├── 00-foreword.adoc   # Standard SIPM boilerplate
│   ├── 00-introduction.adoc
│   ├── 01-scope.adoc      # Required: defines document scope
│   ├── 02-normref.adoc    # Required: normative references
│   ├── 03-terms.adoc      # Required: terms and definitions
│   ├── 04-*.adoc          # Technical content sections
│   └── b0-bibliography.adoc
└── figures/               # Optional: images and diagrams
```

### Document Number Blocks

| Range | Category | Example Use |
|-------|----------|-------------|
| 0001-0099 | Foundation | Terminology, vocabulary, taxonomy |
| 0100-0199 | Management | Organizational processes |
| 0200-0299 | Quality | Agricultural practices, specifications |
| 0300-0399 | Testing | Analytical methods, procedures |
| 0400-0499 | Clinical | Evidence protocols, therapeutic guidelines |
| 0500-0599 | Governance | Ethics, regulatory compliance |

### Document Attributes (document.adoc header)

Required attributes for all standards:

```asciidoc
= {Title}
:docnumber: XXXX
:partnumber: 1
:edition: 1
:revdate: YYYY-MM-DD
:copyright-year: YYYY
:language: en
:title-intro-en: SIPM Standards
:title-main-en: {Main Title}
:doctype: international-standard
:docstage: 60
:docsubstage: 60
:technical-committee: {Committee Name}
:library-ics: XX.XXX
:mn-document-class: iso
:mn-output-extensions: xml,html,doc,pdf
```

### Website Integration

The main website (sipmorg.github.io) consumes these standards:

1. GitHub Actions checks out both repositories
2. `scripts/build-standards.js` converts AsciiDoc to JSON
3. JSON files are placed in `src/content/standards/`
4. Vite SSG pre-renders pages at `/standards/{id}/`

When adding a new standard, ensure:
- Directory name matches pattern `SIPM-XXXX`
- `document.adoc` exists at root of standard directory
- Category is correctly assigned by number block (auto-detected)

## AsciiDoc Conventions

### Terminology Entries

```asciidoc
=== term name
alt:[alternative term]
deprecated:[old term]

Definition text here.

NOTE: Clarification.

[example]
Example text.

[.source]
<<ISO-12345,clause 3.1>>
```

### Cross-references

```asciidoc
<<section-id>>           # Section reference
<<table-id>>             # Table reference
<<figure-id>>            # Figure reference
term:[term-name]         # Defined term reference
```

### Tables

```asciidoc
[[table-id]]
.Table caption
|===
| Header 1 | Header 2

| Cell 1
| Cell 2
|===
```

## Creating a New Standard

1. Copy `templates/standard-template/` to `SIPM-XXXX/`
2. Update `document.adoc` header attributes
3. Create section files in `sections/`
4. Validate: `metanorma SIPM-XXXX/document.adoc`
5. Commit and push - website will auto-deploy

## Document Stages

| Stage | Meaning |
|-------|---------|
| 10 | New work item proposal |
| 20 | Working draft |
| 30 | Committee draft |
| 40 | Draft for consultation |
| 50 | Final draft |
| 60 | Published |

Set `:docstage: 60` when ready for publication.
