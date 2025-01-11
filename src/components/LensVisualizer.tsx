import React from 'react';
import { LensParameters } from '../types';
import { calculateLensMetrics } from '../utils/lensCalculations';

interface LensVisualizerProps {
  params: LensParameters;
  updateParam: (key: keyof LensParameters, value: number | string) => void;
  darkMode?: boolean;
}

const LensVisualizer: React.FC<LensVisualizerProps> = ({ params, updateParam, darkMode }) => {
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
  const padding = 100;
  const scale = Math.min((width - 2 * padding) / (diameter * 0.6), (height - 2 * padding) / (diameter * 0.5)) || 1;
  const centerX = width / 2;
  const centerY = height / 2 + 40;
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

  const vertexDimensionY = centerY - halfDiameter - 40;

  return (
    <div className="relative w-full h-full">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className={darkMode ? 'bg-gray-900' : 'bg-[#f7f6f2]'}
        preserveAspectRatio="xMidYMid meet"
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill={darkMode ? '#ffffff' : '#000000'} />
          </marker>
        </defs>

        {/* Grid lines */}
        <line
          x1={x1 - padding || 0}
          y1={centerY}
          x2={x2 + padding || width}
          y2={centerY}
          stroke={darkMode ? '#4b5563' : '#e5e7eb'}
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        <line
          x1={centerX}
          y1={padding}
          x2={centerX}
          y2={height - padding}
          stroke={darkMode ? '#4b5563' : '#e5e7eb'}
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {/* Lens outline */}
        <path
          d={lensPath}
          fill="none"
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
        />

        {/* Vertex dots */}
        <circle cx={vertex1.x || x1} cy={vertex1.y || centerY} r="3" fill={darkMode ? '#ffffff' : '#000000'} />
        <circle cx={vertex2.x || x2} cy={vertex2.y || centerY} r="3" fill={darkMode ? '#ffffff' : '#000000'} />

        {/* Vertex dimension */}
        <line
          x1={vertex1.x || x1}
          y1={vertex1.y || centerY}
          x2={vertex1.x || x1}
          y2={vertexDimensionY}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <line
          x1={vertex2.x || x2}
          y1={vertex2.y || centerY}
          x2={vertex2.x || x2}
          y2={vertexDimensionY}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <line
          x1={vertex1.x || x1}
          y1={vertexDimensionY}
          x2={vertex2.x || x2}
          y2={vertexDimensionY}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
        <foreignObject
          x={centerX - 60}
          y={vertexDimensionY - 25}
          width="120"
          height="30"
        >
          <div className="flex items-center justify-center">
            <input
              type="number"
              value={params.centerThickness}
              onChange={(e) => updateParam('centerThickness', parseFloat(e.target.value))}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -1 : 1;
                updateParam('centerThickness', Math.max(0, Math.round(params.centerThickness) + delta));
              }}
              style={{ 
                backgroundColor: 'transparent',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
                padding: '0'
              }}
              className={`w-20 text-center ${darkMode ? 'text-white' : ''} focus:outline-none focus:ring-0 hover:outline-none active:outline-none`}
              min="0"
              step="0.1"
            />
          </div>
        </foreignObject>

        {/* Diameter dimension */}
        <line
          x1={x2}
          y1={centerY - halfDiameter}
          x2={x2 + padding + 3}
          y2={centerY - halfDiameter}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
        />
        <line
          x1={x2}
          y1={centerY + halfDiameter}
          x2={x2 + padding + 3}
          y2={centerY + halfDiameter}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
        />
        <line
          x1={x2 + padding}
          y1={centerY - halfDiameter}
          x2={x2 + padding}
          y2={centerY + halfDiameter}
          stroke={darkMode ? '#ffffff' : '#000000'}
          strokeWidth="1"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
        <foreignObject
          x={x2 + padding/2 + 5}
          y={centerY - 15}
          width="120"
          height="30"
        >
          <div className="flex items-center">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-1`}>∅</span>
            <input
              type="number"
              value={params.diameter}
              onChange={(e) => updateParam('diameter', parseFloat(e.target.value))}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -1 : 1;
                updateParam('diameter', Math.max(0, Math.round(params.diameter) + delta));
              }}
              style={{ 
                backgroundColor: 'transparent',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                outline: 'none',
                boxShadow: 'none',
                border: 'none',
                padding: '0'
              }}
              className={`w-20 text-center ${darkMode ? 'text-white' : ''} focus:outline-none focus:ring-0 hover:outline-none active:outline-none`}
              min="0"
              step="0.001"
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default LensVisualizer;