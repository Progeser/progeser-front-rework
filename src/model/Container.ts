export class Container {
  constructor(
    public id: number | null = null,
    public created_at: string = '',
    public name: string = '',
    public shape: Shape | null = null,
    public area: number | null = null,
    public dimensions: number[] | null = null,
    public updated_at: string = ''
  ) {}
}

export class Shape {
  constructor(
    public name: ContainerShape = ContainerShape.OTHER,
    public display_name: string = '',                 
    public dimension_names: string[] | null = null
  ) {}
}

export enum ContainerShape {
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  SQUARE = 'square',
  TRIANGLE = 'triangle',
  OTHER = 'other'
}

export const ContainerShapeDimensionNames = {
  CIRCLE: ['diameter'] as const,
  RECTANGLE: ['length', 'width'] as const,
  SQUARE: ['side'] as const,
  TRIANGLE: ['base', 'height'] as const,
} as const;
