export interface LensParameters {
  diameter: number;
  centerThickness: number;
  radius1: number;
  type1: 'CX' | 'CV' | 'PLANO';
  radius2: number;
  type2: 'CX' | 'CV' | 'PLANO';
  // Left surface parameters
  leftDiameter: number;
  leftChamfer: number;
  leftAR: string;
  leftBevel: string;
  leftWavelength: number;
  // Right surface parameters
  rightDiameter: number;
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