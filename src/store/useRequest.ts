// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestRepository from "@/repository/requestRepository";

interface RequestStoreState {
  request: Request | undefined;
  seeds_left_to_plant: number;
}

export const useRequest = defineStore('request', {
  state: (): RequestStoreState => ({
    request: undefined,
    seeds_left_to_plant: 0,
  }),

  getters: {
    seedQuantity: (state): number => state.request ? state.request.quantity : 0,
    plantStageId: (state): number => state.request ? state.request.plant_stage_id : 0,
  },

  actions: {
    async loadRequest(requestId: number) {
      this.request = await RequestRepository.getRequest(requestId);
      this.seeds_left_to_plant = this.request.quantity
    },

    decreasesNumberOfSeedsLeftToPlant(quantity: number) {
      this.seeds_left_to_plant -= quantity;
    }
  }
});
