export class Container {
  constructor(
    public id: number | null = null,
    public name: string = '',
    public area: string = '',
    public dimensions: string | null = null,
    public shape: { name: string; display_name: string } | null = null,
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
