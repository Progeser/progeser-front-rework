// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestDistributionRepository from "@/repository/requestDistributionRepository";

interface RequestDistributionStoreState {
  requestDistributions: RequestDistribution[];
}

export const useRequestDistribution = defineStore('requestDistribution', {
  state: (): RequestDistributionStoreState => ({
    requestDistributions: [],
  }),

  actions: {
    async loadRequestDistributions() {
      this.requestDistributions = await RequestDistributionRepository.getRequestDistributions();
    },

    getRequestDistributionById(id: number): RequestDistribution | null {
      return this.requestDistributions.find(rd => rd.id === id) || null;
    },

    decreasesNumberOfSeedsLeftToPlant(id: number, quantity: number) {
      const requestDistribution = this.getRequestDistributionById(id);
      if (!requestDistribution) return;

      requestDistribution.seeds_left_to_plant -= quantity;
    }
  }
});
