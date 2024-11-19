import { ContainerShape } from "../Container";

export class ContainerOutput {
  constructor(
    public name: string = '',
    public area: number | null = null,
    public dimensions: number[] | null = null,
    public shape_name: ContainerShape | '' = ''
  ) {}
}
