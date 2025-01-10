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
- [ ] Enhance parameter table layout with proper grid lines
- [ ] Standardize typeface and formatting across the application
- [ ] Fix center thickness and diameter input handling
- [ ] Move surface type selector (CX/CV/∞) to a more intuitive location
- [ ] Add toggle for rectangular vs diameter optics

### Drawing Enhancements
- [ ] Improve arc drawing methodology for better accuracy
- [ ] Add drawing zone markings
- [ ] Add revision table
- [ ] Add title block
- [ ] Add limit dimension to diameter
- [ ] Add datum feature

### Feature Additions
- [ ] Add tolerance options for parameters
- [ ] Add ability to switch between nm and µm for coating specifications

### Data Management
- [ ] Create glass database
  - [ ] Collect comprehensive glass information
  - [ ] Implement search and filtering
- [ ] Create lens database
  - [ ] Store common lens configurations
  - [ ] Import/export functionality

## License
MIT
