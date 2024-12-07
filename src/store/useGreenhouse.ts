// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import GreenhouseRepository from "@/repository/greenhouseRepository";

interface GreenhouseStoreState {
  greenhouse: Greenhouse[];
}

export const useGreenhouse = defineStore('greenhouse', {
  state: (): GreenhouseStoreState => ({
    greenhouse: [],
  }),

  actions: {
    async loadGreenhouse(building_id: number) {
      this.greenhouse = await GreenhouseRepository.getGreenhouses(building_id);
    },

    getGreenhouseById(id: number): Greenhouse | null {
      return this.greenhouse.find(g => g.id === id) || null;
    },
  }
});
