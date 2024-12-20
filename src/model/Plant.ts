type PlantStage = {
  id: number,
  name: string
}

type Plant = {
  id: number,
  name: string
  plant_stages: PlantStage[];
  created_at: Date;
  updated_at: Date;
}
