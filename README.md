# Optical Drawing Generator

A web application for generating optical lens drawings in the ISO 10110 format. Built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time lens visualization with interactive dimensions
- Comprehensive lens parameter controls:
  - Surface parameters (R, ∅e MIN, PROT. CHAMFER, etc.)
  - Material specifications (GLASS, Nd, Vd)
  - ISO 10110 notations (0/, 1/, 2/, etc.)
- Automatic effective diameter calculation (∅e = ∅ - 1mm)
- Support for different lens types:
  - Convex (CX)
  - Concave (CV)
  - Plano (∞)

## Development

### Prerequisites
- Node.js
- npm

### Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

### Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

## Roadmap

### UI/UX Improvements
- [ ] Enhance parameter table layout with proper grid lines and consistent formatting
- [ ] Fix center thickness and diameter input handling
- [ ] Relocate surface type selector (CX/CV/∞) to a more intuitive spot
- [ ] Add toggle for rectangular vs. diameter optics
- [ ] Create modular UI elements for different optic types (lenses, mirrors, prisms, beamsplitters, etc.)
- [ ] Enable text/voice-to-LLM input for dimensioning (conversational design flow)

### Drawing Enhancements
- [ ] Improve arc drawing methodology for better accuracy
- [ ] Add drawing zone markings for ISO compliance
- [ ] Add revision table and version control tracking
- [ ] Add title block (with customizable branding in paid plans)
- [ ] Add limit dimension to diameter, plus typical ISO 10110 notations
- [ ] Add datum features and alignment references
- [ ] Offer mechanical tolerancing (ASME Y14.5 or ISO equivalents) for barrels, mounts, etc.

### Feature Additions
#### Lens Barrel & Mount Generator
- [ ] Parameterized threads (Mxx x 0.xx)
- [ ] Retaining ring options
- [ ] Flange/shoulder adjustments
- [ ] Wave washer/snap ring library

#### Optic Geometry Expansion
- [ ] Mirrors (spherical, off-axis paraboloids)
- [ ] Prisms & Beamsplitters (corner cubes, right-angle prisms, etc.)
- [ ] Filters & Windows

#### Tolerance Options
- [ ] Automatic suggestions for lens surface tolerances
- [ ] Switch between nm and µm for coating specs

#### Collaboration & Workspace
- [ ] Shared folders and real-time editing for teams
- [ ] Revision control logs and rollback

#### Vendor/Manufacturer Integration
- [ ] One-click RFQs to partnered machine shops/coating houses
- [ ] Automatic BOM generation for mounting hardware

#### LLM-Powered "Compliance Buddy"
- [ ] Trained on ISO 10110 (and relevant mechanical standards)
- [ ] Suggests or flags missing specs and questionable tolerances

### Data Management
#### Glass Database
- [ ] Expand comprehensive glass info and search/filter UI
- [ ] Maintain or auto-update new glass types

#### Lens/Optic Database
- [ ] Store common configurations (meniscus, plano-convex, etc.)
- [ ] Add import/export from Zemax, CodeV
- [ ] Capture mechanical parameters (barrel lengths, diameters, etc.)

### Learning Portal
- [ ] Quick ISO 10110 tutorials and best-practice videos
- [ ] Guides on advanced optics (prisms, OAPs, coatings)
- [ ] Intro to mechanical design for optics (mount tolerances, alignment)

### Monetization & Access Control
#### Free vs. Paid Plans
- [ ] Free plan includes basic drawing generation and standard watermark/title block
- [ ] Paid plan unlocks custom branding, private drawings, advanced geometry, collaboration tools

#### Pay-Per-Transaction
- [ ] Option to generate and securely share a custom link/QR code with paid upgrades

#### Training & Consulting Services
- [ ] Offer an ISO10110 certification track or specialized courses

#### Affiliate Partnerships
- [ ] Optical software partnerships (Zemax, CodeV)
- [ ] Manufacturer/supplier referrals for parts and coatings

## License
MIT
