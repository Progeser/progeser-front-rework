import {defineStore} from 'pinia';
import PlantRepository from "@/repository/plantRepository";

interface PlantStoreState {
  plants: Plant[];
}

export const PlantStore = defineStore('plant', {
  state: (): PlantStoreState => ({
    plants: [],
  }),

  actions: {
    async loadPlants() {
      this.plants = await PlantRepository.getPlant();
    },
  }
});
