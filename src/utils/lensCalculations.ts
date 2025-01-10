import { LensParameters } from '../types';

export function calculateLensMetrics(params: LensParameters) {
  const { diameter, centerThickness, radius1, type1, radius2, type2 } = params;
  
  // Calculate sagitta for each surface
  function calculateSagitta(radius: number, type: 'CX' | 'CV' | 'PLANO'): number {
    if (type === 'PLANO') return 0;
    
    const h = diameter / 2;
    const minRadius = Math.max(h * 1.05, 0.1);
    const effectiveRadius = Math.max(Math.abs(radius), minRadius);
    
    const sagitta = effectiveRadius - Math.sqrt(effectiveRadius * effectiveRadius - h * h);
    return type === 'CX' ? sagitta : -sagitta;
  }

  const sag1 = calculateSagitta(Math.abs(radius1), type1);
  const sag2 = calculateSagitta(Math.abs(radius2), type2);

  const edgeThickness = Math.max(0.1, centerThickness - sag1 - sag2);

  return {
    edgeThickness: Number(edgeThickness.toFixed(2)),
    sagittas: {
      surface1: Number(sag1.toFixed(2)),
      surface2: Number(sag2.toFixed(2))
    }
  };
}

export function formatRadius(radius: number, type: 'CX' | 'CV' | 'PLANO'): string {
  if (type === 'PLANO') return '∞';
  return Math.abs(radius).toFixed(2);
}

export function adjustLensParameters(
  params: LensParameters,
  updatedParam: keyof LensParameters,
  newValue: string | number
): LensParameters {
  const newParams = { ...params };

  if (updatedParam === 'type1' || updatedParam === 'type2') {
    const newType = newValue as 'CX' | 'CV' | 'PLANO';
    newParams[updatedParam] = newType;

    // Adjust radius based on the new type
    if (newType === 'PLANO') {
      if (updatedParam === 'type1') newParams.radius1 = 0;
      else newParams.radius2 = 0;
    } else if (
      (updatedParam === 'type1' && params.type1 === 'PLANO') ||
      (updatedParam === 'type2' && params.type2 === 'PLANO')
    ) {
      const baseRadius = params.diameter * 2;
      const newRadius = newType === 'CX' ? baseRadius : -baseRadius;
      
      if (updatedParam === 'type1') newParams.radius1 = newRadius;
      else newParams.radius2 = newRadius;
    }
  } else if (updatedParam === 'radius1' || updatedParam === 'radius2') {
    // Store radius with sign based on surface type
    const type = updatedParam === 'radius1' ? params.type1 : params.type2;
    const absValue = Math.abs(Number(newValue));
    newParams[updatedParam] = type === 'CX' ? absValue : -absValue;
  } else if (updatedParam === 'diameter') {
    // Update diameter and automatically adjust effective diameters if they haven't been manually set
    newParams.diameter = Number(newValue);
    if (!params.leftDiameterManuallySet) {
      newParams.leftDiameter = Math.max(0, Number(newValue) - 1);
    }
    if (!params.rightDiameterManuallySet) {
      newParams.rightDiameter = Math.max(0, Number(newValue) - 1);
    }
  } else if (updatedParam === 'leftDiameter') {
    newParams.leftDiameter = Number(newValue);
    newParams.leftDiameterManuallySet = true;
  } else if (updatedParam === 'rightDiameter') {
    newParams.rightDiameter = Number(newValue);
    newParams.rightDiameterManuallySet = true;
  } else {
    // For all other parameters, just update the value directly
    newParams[updatedParam] = Number(newValue) || newParams[updatedParam];
  }

  return newParams;
}