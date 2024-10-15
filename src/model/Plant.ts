import {PlantStage} from "@/model/PlantStage";

export interface Plant {
  id: number;
  created_at: string;
  name: string;
  plant_stages: PlantStage[];
  updated_at: string;
}
