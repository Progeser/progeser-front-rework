export class Compartiment {
  constructor(
    public id: number | null = null,
    public created_at: string = "",
    public height: number = 0,
    public name: string = "",
    public occupancy: number = 0,
    public updated_at: string = "",
    public width: number = 0
  ) {}
}
