import {SpeciesStage} from "@/model/SpeciesStage";

export class Species {
  constructor(
    public id: number | null = null,
    public name: string = '',
    public plant_stages: SpeciesStage[] = [],
  ) {}
}
