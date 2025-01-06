import {defineStore} from 'pinia';
import PlantRepository from "@/repository/plantRepository";

interface PlantStoreState {
  plants: Plant[];
}

export const usePlantStore = defineStore('plant', {
  state: (): PlantStoreState => ({
    plants: [],
  }),

  actions: {
    async loadPlants() {
      this.plants = await PlantRepository.getPlant();
    },

    getPlantStagesIdsFromPlantIds(plantIds: number[]): Set<number> {
      const stagesIds = new Set<number>();

      this.plants.filter(p => plantIds.includes(p.id)).forEach(p => {
        p.plant_stages.forEach(ps => stagesIds.add(ps.id));
      });

      return stagesIds;
    },

    getPlantByPlantStageId(plantStageId: number): Plant | null {
      return this.plants.find(p => p.plant_stages.some(ps => ps.id == plantStageId)) || null;
    }
  }
});

export type PlantStore = ReturnType<typeof usePlantStore>;

