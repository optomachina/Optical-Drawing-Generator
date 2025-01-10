import { useState, useCallback } from 'react';
import { LensParameters } from '../types';
import { adjustLensParameters } from '../utils/lensCalculations';

const defaultParams: LensParameters = {
  diameter: 43.0,
  centerThickness: 4.5,
  radius1: 50.0,
  type1: 'CX',
  radius2: 50.0,
  type2: 'CV',
  // Material parameters
  glass: "S-FPL51",
  nd: "±0.0005",
  vd: "±0.5",
  bubbles: "10",
  inclusions: "4 X 0.1",
  stress: "3:3",
  // Left surface parameters
  leftDiameter: 42.0,
  leftDiameterManuallySet: false,
  leftChamfer: 0.1,
  leftAR: "AR @0.500-0.600µm BBAR AVG T < 99.7%",
  leftBevel: "3 (0.25)",
  leftWavelength: 0.5,
  // Right surface parameters
  rightDiameter: 42.0,
  rightDiameterManuallySet: false,
  rightChamfer: 0.1,
  rightAR: "AR @0.500-0.600µm BBAR AVG T < 99.7%",
  rightBevel: "3 (0.25)",
  rightWavelength: 0.5,
};

export const useLensParameters = () => {
  const [params, setParams] = useState<LensParameters>(defaultParams);

  const updateParam = useCallback((key: keyof LensParameters, value: number | string) => {
    setParams(prevParams => adjustLensParameters(prevParams, key, value));
  }, []);

  return { params, updateParam };
};