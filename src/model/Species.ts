import {SpeciesStage} from "@/model/SpeciesStage";

export interface Species {
  id: number;
  created_at: string;
  name: string;
  plant_stages: SpeciesStage[];
  updated_at: string;
}
