export class SpeciesStageAttributes {
  constructor(
    public id: number | null = null,
    public duration: number = 0,
    public name: string = '',
    public position: number = 0,
    public _destroy: boolean = false
  ) {}
}
