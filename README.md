# SIPM Standards Repository

This repository contains the official standards, technical reports, and guidance
documents published by the **Society for Integrative Phytomedicine (SIPM)**.

## Document Identifier System

All SIPM documents follow the identifier format:

```
SIPM {n}:{year}
```

- `{n}` is a four-digit document number (e.g., `0001`, `0200`)
- `{year}` is the year of publication (e.g., `2026`)

Example: `SIPM-0001:2026` refers to the first SIPM standard published in 2026.

## Number Blocks

| Block | Range | Category |
|-------|-------|----------|
| Foundation | 0001-0099 | Terminology, vocabulary, taxonomy |
| Management | 0100-0199 | Management systems, organizational processes |
| Quality | 0200-0299 | Quality specifications, agricultural practices |
| Testing | 0300-0399 | Analytical methods, test procedures |
| Clinical | 0400-0499 | Clinical evidence, therapeutic protocols |
| Governance | 0500-0599 | Governance, ethics, regulatory compliance |

## Creating a New Standard

### Step 1: Choose a Document Number

Select an available number from the appropriate block:

```bash
# Check existing standards
ls -d SIPM-*/
```

### Step 2: Copy the Template

```bash
cp -r templates/standard-template SIPM-XXXX
cd SIPM-XXXX
```

### Step 3: Update Document Attributes

Edit `document.adoc` and update the header:

```asciidoc
= Terminology for Phytomedicine
:docnumber: 0001
:partnumber: 1
:edition: 1
:revdate: 2026-02-17
:copyright-year: 2026
:language: en
:title-intro-en: SIPM Standards
:title-main-en: Terminology for Phytomedicine
:title-part-en: General vocabulary
:doctype: international-standard
:docstage: 30
:docsubstage: 00
:technical-committee: Terminology and Nomenclature
:library-ics: 01.040.11
:mn-document-class: iso
:mn-output-extensions: xml,html,doc,pdf
```

### Step 4: Write Content

Create or edit section files in `sections/`:

| File | Required | Description |
|------|----------|-------------|
| `00-foreword.adoc` | Yes | Standard SIPM boilerplate |
| `00-introduction.adoc` | No | Background and context |
| `01-scope.adoc` | Yes | What the document covers |
| `02-normref.adoc` | Yes | Normative references |
| `03-terms.adoc` | Yes* | Terms and definitions |
| `04-*.adoc` | Varies | Technical content sections |
| `b0-bibliography.adoc` | No | Informative references |

*Required if defining terminology.

### Step 5: Validate

```bash
# Check AsciiDoc syntax
asciidoctor SIPM-XXXX/document.adoc

# Build with Metanorma (if installed)
metanorma SIPM-XXXX/document.adoc
```

### Step 6: Commit and Push

```bash
git add SIPM-XXXX/
git commit -m "feat: add SIPM-XXXX - {Title}"
git push origin main
```

The website (sipmorg.github.io) will automatically rebuild and deploy.

## Document Stages

| Stage | Name | Description |
|-------|------|-------------|
| 10 | NP | New work item proposal |
| 20 | WD | Working draft |
| 30 | CD | Committee draft |
| 40 | DIS | Draft for consultation |
| 50 | FDIS | Final draft |
| 60 | IS | Published International Standard |

Set `:docstage:` to control publication status.

## AsciiDoc Quick Reference

### Terminology Entry

```asciidoc
=== phytomedicine
alt:[herbal medicine]
deprecated:[phytopharmaceutical]

Plant-based medicinal product used for therapeutic purposes.

NOTE: This term encompasses both traditional and modern preparations.

[example]
Echinacea tincture is a common phytomedicine used for immune support.

[.source]
<<WHO-2019,definition 3.1>>
```

### Cross-References

```asciidoc
<<section-id>>           # Reference to section
<<table-myx>>            # Reference to table
term:[phytomedicine]     # Reference to defined term
```

### Tables

```asciidoc
[[table-extraction-methods]]
.Extraction methods and their characteristics
|===
| Method | Solvent | Temperature

| Maceration
| Ethanol-water
| Room temperature

| Percolation
| Ethanol-water
| Room to 50°C
|===
```

### Figures

```asciidoc
[[figure-supply-chain]]
.Supply chain overview
image::figures/supply-chain.png[Supply chain diagram]
```

## Repository Structure

```
standards/
├── README.md           # This file
├── CLAUDE.md           # AI development guidance
├── SIPM-0001/          # Terminology for Phytomedicine
├── SIPM-0002/          # Medicinal Fungi Taxonomy
├── SIPM-0200/          # Agricultural Practices
├── SIPM-0300/          # Analytical Methods
├── SIPM-0400/          # Clinical Evidence
├── schemas/            # Validation schemas
├── templates/          # Document templates
└── docs/               # Additional documentation
```

## Website Integration

This repository integrates with the SIPM website (github.com/sipmorg/sipmorg.github.io):

1. Push changes to `main` branch
2. Website CI checks out this repository
3. `build-standards.js` converts AsciiDoc to JSON
4. Website builds with the updated content
5. Changes are deployed to GitHub Pages

No manual website updates are required.

## Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes following the guidelines above
4. Submit a pull request

For major changes, contact standards@sipm.org to join the relevant working group.

## License

SIPM standards documents are copyright (c) Society for Integrative Phytomedicine.
Content may be used for educational and reference purposes. Commercial
reproduction requires written permission.

## Contact

- Website: https://sipm.org
- Email: standards@sipm.org
- GitHub: https://github.com/sipmorg/standards
