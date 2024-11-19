export class Container {
  constructor(
    public id: number | null = null,
    public name: string = '',
    public shape: Shape = new Shape(),
    public area: number | null = null,
    public dimensions: number[] | null = null,
  ) {}
}

export class Shape {
  constructor(
    public name: ContainerShape = ContainerShape.OTHER,
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

export enum dimensions_names {
  CIRCLE = 'diamètre',
  RECTANGLE = 'longueur, largeur',
  SQUARE = 'côté',
  TRIANGLE = 'base, hauteur'
}

export function getDimensionsNamesFromShape(shape: ContainerShape): string {
  switch (shape) {
    case ContainerShape.CIRCLE:
      return dimensions_names.CIRCLE;
    case ContainerShape.RECTANGLE:
      return dimensions_names.RECTANGLE;
    case ContainerShape.SQUARE:
      return dimensions_names.SQUARE;
    case ContainerShape.TRIANGLE:
      return dimensions_names.TRIANGLE;
    default:
      return '';
  }
}
