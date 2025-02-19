// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestRepository from "@/repository/requestRepository";
import {RequestModel} from "@/model/RequestModel";

interface RequestStoreState {
  request: RequestModel | undefined;
  requests: RequestModel[];
  seeds_left_to_plant: number;
}

export const useRequestStore = defineStore('request', {
  state: (): RequestStoreState => ({
    request: undefined,
    requests: [],
    seeds_left_to_plant: 0,
  }),

  getters: {
    seedQuantity: (state): number => state.request ? state.request.quantity : 0,
    plantStageId: (state): number => state.request ? state.request.plant_stage_id : 0,
  },

  actions: {
    async loadRequest(requestId: string) {
      this.request = await RequestRepository.getRequest(requestId);
      this.seeds_left_to_plant = this.request.quantity
    },

    async loadRequestById(requestIds: Set<number>) {
      this.requests = [];
      for (const id of requestIds) {
        const request = await RequestRepository.getRequest(id.toString());
        if (!request) continue;
        this.requests = [...this.requests, request];
      }
    },

    decreasesNumberOfSeedsLeftToPlant(quantity: number) {
      this.seeds_left_to_plant -= quantity;
    },

    getRequestById(id: number): RequestModel | null {
      return this.requests.find(request => request.id === id) || null;
    }
  }
});

export type RequestStore = ReturnType<typeof useRequestStore>;
