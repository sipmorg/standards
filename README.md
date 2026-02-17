# SIPM Standards Repository

This repository contains the official standards, technical reports, and guidance
documents published by the **Society for Integrative Phytomedicine (SIPM)**.

## Purpose

The SIPM Standards program develops and maintains consensus-based standards for
phytomedicine, medicinal fungi, and related natural health products. Our
standards support quality, safety, and efficacy throughout the supply chain,
from agricultural cultivation to clinical application.

## Document Identifier System

All SIPM documents follow the identifier format:

```
SIPM {n}:{year}
```

Where:

- `{n}` is a four-digit document number
- `{year}` is the year of publication

Example: `SIPM-0001:2026` refers to the first SIPM standard published in 2026.

## Number Blocks

SIPM document numbers are organized into thematic blocks:

| Block | Range | Category |
|-------|-------|----------|
| Terminology | 0001-0099 | Foundational terminology and vocabulary |
| Management | 0100-0199 | Management systems and processes |
| Quality | 0200-0299 | Quality specifications and practices |
| Testing | 0300-0399 | Analytical methods and test procedures |
| Clinical | 0400-0499 | Clinical evidence and protocols |
| Governance | 0500-0599 | Governance, ethics, and compliance |

## Document Types

SIPM publishes three types of documents:

### Standards (SIPM {n}:{year})

Normative documents that specify requirements, guidelines, or characteristics
for materials, processes, or outcomes. Compliance is expected for certification
or regulatory purposes.

### Technical Reports (SIPM TR {n}:{year})

Informative documents that provide technical data, analysis, or guidance on
specific topics. These do not establish mandatory requirements.

### Guidance Documents (SIPM GD {n}:{year})

Advisory documents that offer recommendations and best practices. These support
implementation of standards but do not establish binding requirements.

## Repository Structure

```
standards/
├── README.md           # This file
├── CLAUDE.md           # Development guidance
├── SIPM-0001/          # Terminology for Phytomedicine
├── SIPM-0002/          # Medicinal Fungi Taxonomy
├── SIPM-0200/          # Agricultural Practices
├── SIPM-0300/          # Analytical Methods
├── SIPM-0400/          # Clinical Evidence
├── schemas/            # Validation schemas
├── templates/          # Document templates
└── docs/               # Additional documentation
```

Each standard directory contains:

- `document.adoc` - Main document file
- `sections/` - Individual section files
- Supporting assets (figures, tables, etc.)

## Document Format

All SIPM documents are authored in AsciiDoc format (`.adoc`), following
ISO-style conventions for structure and formatting. Documents are processed
using the Metanorma toolchain to produce publication-ready outputs in multiple
formats (HTML, PDF, DOC, XML).

## Contributing

We welcome contributions from subject matter experts, industry stakeholders,
and the scientific community.

### How to Contribute

1. **Review existing standards** - Familiarize yourself with current documents
   and their structure.

2. **Submit a proposal** - Open an issue describing the new standard or
   revision you propose.

3. **Join a working group** - Contact standards@sipm.org to participate in
   technical committees.

4. **Submit pull requests** - For minor corrections or improvements, fork the
   repository and submit a pull request.

### Development Process

1. **Proposal stage** - New work item proposal (NWIP) submitted and approved
2. **Working draft** - Initial draft developed by working group
3. **Committee draft** - Draft circulated for technical committee review
4. **Draft International Standard** - Public consultation period
5. **Final Draft** - Incorporation of comments and final edits
6. **Publication** - Document published as official SIPM standard

### Code of Conduct

All contributors must adhere to our Code of Conduct, which promotes respectful,
inclusive, and professional collaboration.

## License

SIPM standards documents are copyright (c) Society for Integrative Phytomedicine.
Content may be used for educational and reference purposes. Commercial
reproduction requires written permission.

## Contact

- Website: https://sipm.org
- Email: standards@sipm.org
- GitHub: https://github.com/sipmorg/standards
