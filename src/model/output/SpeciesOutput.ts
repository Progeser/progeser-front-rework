import {SpeciesStageAttributes} from "@/model/output/SpeciesStageAttributes";

export class SpeciesOutput {
  constructor(
    public name: string = '',
    public plant_stages_attributes: SpeciesStageAttributes[] = []
  ) {}
}
