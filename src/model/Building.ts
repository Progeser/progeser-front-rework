export class Building {
  constructor(
    public id: number | null = null,
    public created_at: string = '',
    public name: string = '',
    public description: string = '',
    public updated_at: string = ''
  ) {}
}
