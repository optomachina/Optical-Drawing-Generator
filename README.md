# Optical-Drawing-Generator

A React-based web application for creating and visualizing optical lens cross-sections in real-time, following ISO 10110 standards.

## Features

- Interactive lens parameter controls:
  - Diameter
  - Center thickness
  - Surface types (Convex, Concave, Plano)
  - Surface radii
- Real-time visualization of lens cross-sections
- Automatic calculation of:
  - Edge thickness
  - Surface sagittas
  - Vertex positions
- Dimension annotations showing:
  - Center thickness
  - Diameter
- Grid alignment guides
- Responsive SVG-based rendering

## Technical Details

The application uses:
- React with TypeScript
- SVG for precise lens visualization
- Tailwind CSS for styling
- Mathematical calculations following optical formulas for:
  - Sagitta calculations
  - Surface curvature rendering
  - Parameter validation and adjustments

## Usage

The interface allows users to:
1. Adjust lens parameters using input fields
2. Scroll/wheel over inputs to fine-tune values
3. Switch between surface types (CX/CV/PLANO)
4. View real-time updates to the lens visualization
5. See accurate dimensional measurements

## Mathematical Implementation

The lens visualization implements proper optical calculations including:
- Sagitta computation for curved surfaces
- Minimum radius constraints based on diameter
- Surface direction handling for convex/concave surfaces
- Scale adjustments for viewport fitting
- Edge thickness calculations

## License

[Add your license information here]
