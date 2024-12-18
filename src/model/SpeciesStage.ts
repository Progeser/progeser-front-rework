export class SpeciesStage {
  constructor(
    public id: number | null = null,
    public created_at: string = '',
    public duration: number = 0,
    public name: string = '',
    public position: number = 0,
    public updated_at: string = '',
    public _destroy : boolean = false
  ) {}
}
