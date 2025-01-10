import React from 'react';
import { LensParameters } from '../types';
import { calculateLensMetrics } from '../utils/lensCalculations';

interface LensVisualizerProps {
  params: LensParameters;
}

const LensVisualizer: React.FC<LensVisualizerProps> = ({ params }) => {
  const {
    diameter,
    centerThickness,
    radius1,
    type1,
    radius2,
    type2,
  } = params;

  // Calculate lens metrics
  const metrics = calculateLensMetrics(params);

  // SVG viewport settings
  const width = 400;
  const height = 300;
  const padding = 40;
  const scale = Math.min((width - 2 * padding) / (diameter * 1.2), (height - 2 * padding) / diameter) || 1;
  const centerX = width / 2;
  const centerY = height / 2;
  const halfDiameter = (diameter * scale) / 2;
  const thicknessScaled = centerThickness * scale;
  const x1 = centerX - thicknessScaled / 2;
  const x2 = centerX + thicknessScaled / 2;

  // Calculate vertex points
  const calculateVertexPoint = (
    radius: number,
    type: string,
    isFirst: boolean
  ): { x: number; y: number } => {
    if (type === 'PLANO') {
      return { x: isFirst ? x1 : x2, y: centerY };
    }

    const surfaceX = isFirst ? x1 : x2;
    const h = diameter / 2;
    const minRadius = Math.max(h * 1.05, 0.1);
    const effectiveRadius = Math.max(Math.abs(radius || minRadius), minRadius);
    const direction = type === 'CX' ? (isFirst ? 1 : -1) : (isFirst ? -1 : 1);
    
    const sagitta = effectiveRadius - Math.sqrt(effectiveRadius * effectiveRadius - h * h);
    const sagittaScaled = (sagitta * scale * direction) || 0;
    
    return { 
      x: Number(surfaceX + sagittaScaled) || surfaceX, 
      y: centerY 
    };
  };

  // Calculate surface paths
  const calculateSurfacePath = (
    radius: number,
    type: string,
    isFirst: boolean
  ): string => {
    if (type === 'PLANO') {
      const x = isFirst ? x1 : x2;
      return `${x},${centerY - halfDiameter} L ${x},${centerY + halfDiameter}`;
    }

    const surfaceX = isFirst ? x1 : x2;
    const h = diameter / 2;
    const minRadius = Math.max(h * 1.05, 0.1);
    const effectiveRadius = Math.max(Math.abs(radius || minRadius), minRadius);
    const radiusScaled = effectiveRadius * scale;
    const direction = type === 'CX' ? (isFirst ? 1 : -1) : (isFirst ? -1 : 1);
    const [startY, endY] = isFirst 
      ? [centerY - halfDiameter, centerY + halfDiameter]
      : [centerY + halfDiameter, centerY - halfDiameter];
    
    const sweepFlag = isFirst ? (direction > 0 ? 1 : 0) : (direction > 0 ? 0 : 1);
    return `${surfaceX},${startY} A ${radiusScaled},${radiusScaled} 0 0 ${sweepFlag} ${surfaceX},${endY}`;
  };

  // Get vertex points
  const vertex1 = calculateVertexPoint(radius1, type1, true);
  const vertex2 = calculateVertexPoint(radius2, type2, false);

  // Construct the complete lens path
  const lensPath = `M ${calculateSurfacePath(radius1, type1, true)} 
                    L ${calculateSurfacePath(radius2, type2, false)}
                    Z`;

  const vertexDimensionY = centerY - halfDiameter - padding / 2;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className="bg-white"
    >
      {/* Arrow markers */}
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000" />
        </marker>
      </defs>

      {/* Grid lines */}
      <line
        x1={x1 - padding || 0}
        y1={centerY}
        x2={x2 + padding || width}
        y2={centerY}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <line
        x1={centerX}
        y1={padding}
        x2={centerX}
        y2={height - padding}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4,4"
      />

      {/* Lens outline */}
      <path
        d={lensPath}
        fill="none"
        stroke="#000000"
        strokeWidth="2"
      />

      {/* Vertex dots */}
      <circle cx={vertex1.x || x1} cy={vertex1.y || centerY} r="3" fill="#000000" />
      <circle cx={vertex2.x || x2} cy={vertex2.y || centerY} r="3" fill="#000000" />

      {/* Vertex dimension */}
      <line
        x1={vertex1.x || x1}
        y1={vertex1.y || centerY}
        x2={vertex1.x || x1}
        y2={vertexDimensionY}
        stroke="#000000"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <line
        x1={vertex2.x || x2}
        y1={vertex2.y || centerY}
        x2={vertex2.x || x2}
        y2={vertexDimensionY}
        stroke="#000000"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <line
        x1={vertex1.x || x1}
        y1={vertexDimensionY}
        x2={vertex2.x || x2}
        y2={vertexDimensionY}
        stroke="#000000"
        strokeWidth="1"
        markerEnd="url(#arrow)"
        markerStart="url(#arrow)"
      />
      <text
        x={centerX}
        y={vertexDimensionY - 8}
        textAnchor="middle"
        className="text-sm fill-gray-600"
      >
        {`${centerThickness.toFixed(2)} mm`}
      </text>

      {/* Diameter dimension */}
      <line
        x1={x2}
        y1={centerY - halfDiameter}
        x2={x2 + padding + 3}
        y2={centerY - halfDiameter}
        stroke="#000000"
        strokeWidth="1"
      />
      <line
        x1={x2}
        y1={centerY + halfDiameter}
        x2={x2 + padding + 3}
        y2={centerY + halfDiameter}
        stroke="#000000"
        strokeWidth="1"
      />
      <line
        x1={x2 + padding}
        y1={centerY - halfDiameter}
        x2={x2 + padding}
        y2={centerY + halfDiameter}
        stroke="#000000"
        strokeWidth="1"
        markerEnd="url(#arrow)"
        markerStart="url(#arrow)"
      />
      <text
        x={x2 + padding + 10}
        y={centerY}
        textAnchor="start"
        dominantBaseline="middle"
        className="text-sm fill-gray-600"
      >
        {`∅${diameter.toFixed(2)} mm`}
      </text>
    </svg>
  );
};

export default LensVisualizer;