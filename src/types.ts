export interface LensParameters {
  diameter: number;
  centerThickness: number;
  radius1: number;
  type1: 'CX' | 'CV' | 'PLANO';
  radius2: number;
  type2: 'CX' | 'CV' | 'PLANO';
  // Material parameters
  glass: string;
  nd: string;
  vd: string;
  bubbles: string;  // 0/
  inclusions: string;  // 1/
  stress: string;  // 2/
  // Left surface parameters
  leftDiameter: number;
  leftDiameterManuallySet: boolean;
  leftChamfer: number;
  leftAR: string;
  leftBevel: string;
  leftWavelength: number;
  // Right surface parameters
  rightDiameter: number;
  rightDiameterManuallySet: boolean;
  rightChamfer: number;
  rightAR: string;
  rightBevel: string;
  rightWavelength: number;
}

export interface LensMetrics {
  edgeThickness: number;
  sagittas: {
    surface1: number;
    surface2: number;
  };
}