export interface LensParameters {
  diameter: number;
  centerThickness: number;
  radius1: number;
  type1: 'CX' | 'CV' | 'PLANO';
  radius2: number;
  type2: 'CX' | 'CV' | 'PLANO';
}

export interface LensMetrics {
  edgeThickness: number;
  sagittas: {
    surface1: number;
    surface2: number;
  };
}