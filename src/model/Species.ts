import {SpeciesStage} from "@/model/SpeciesStage";

export class Species {
  constructor(
    public id: number | null = null,
    public created_at: string = '',
    public name: string = '',
    public plant_stages: SpeciesStage[] = [],
    public updated_at: string = ''
  ) {}
}
