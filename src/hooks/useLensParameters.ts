import { useState, useCallback } from 'react';
import { LensParameters } from '../types';
import { adjustLensParameters } from '../utils/lensCalculations';

const defaultParams: LensParameters = {
  diameter: 25.0,
  centerThickness: 4.0,
  radius1: 50.0,
  type1: 'CX',
  radius2: 50.0,
  type2: 'CV',
};

export const useLensParameters = () => {
  const [params, setParams] = useState<LensParameters>(defaultParams);

  const updateParam = useCallback((key: keyof LensParameters, value: number | string) => {
    setParams(prevParams => adjustLensParameters(prevParams, key, value));
  }, []);

  return { params, updateParam };
};