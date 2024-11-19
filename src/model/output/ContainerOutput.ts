import { ContainerShape } from "../Container";

export class ContainerOutput {
  constructor(
    public name: string = '',
    public area: string | undefined = undefined,
    public dimensions: number[] | undefined = undefined,
    public shape: ContainerShape | '' = ''
  ) {}
}
