// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestDistributionRepository from "@/repository/requestDistributionRepository";

interface RequestDistributionStoreState {
  requestDistributions: RequestDistribution[];
  _selectedDistribution: RequestDistribution | null;
}

export const useRequestDistributionStore = defineStore('requestDistribution', {
  state: (): RequestDistributionStoreState => ({
    requestDistributions: [],
    _selectedDistribution: null,
  }),


  getters: {
    selectedDistribution: (state): RequestDistribution | null => state._selectedDistribution,
  },

  actions: {
    async loadDistributions() {
      this.requestDistributions = await RequestDistributionRepository.getRequestDistributions();
    },

    async loadDistributionByIds(distributionIds: Set<number>) {
      for (const id of distributionIds) {
        const distribution = await RequestDistributionRepository.getDistributionById(id);
        if (!distribution) continue;
        this.requestDistributions = [...this.requestDistributions, distribution];
      }
    },

    getDistributionById(id: number): RequestDistribution | null {
      return this.requestDistributions.find(rd => rd.id === id) || null;
    },

    getDistributionByBenchId(benchId: number): RequestDistribution[] {
      return this.requestDistributions.filter(rd => rd.bench_id === benchId);
    },

    selectDistribution(distribution: RequestDistribution | null) {
      this._selectedDistribution = distribution;
    },

    async updateDistribution(distribution: RequestDistribution) {
      try {
        const updateDistribution = await RequestDistributionRepository.updateDistribution(distribution);
        this.requestDistributions = this.requestDistributions.map(d => d.id === updateDistribution.id ? updateDistribution : d);
        this._selectedDistribution = updateDistribution;
      } catch (error) {
        this._selectedDistribution = this.requestDistributions.find(d => d.id === distribution.id) || null;
      }
    },

    updateDistributionPositions(positions: number[]) {
      if (!this._selectedDistribution) {
        return;
      }

      this._selectedDistribution = {...this._selectedDistribution, positions_on_bench: positions};
    },

    getDistributionByRequestId(requestId: number): RequestDistribution[] | null {
      return this.requestDistributions.filter(rd => rd.request_id === requestId) || null;
    },

    async addDistribution(requestId: number, distribution: Partial<RequestDistribution>) {
      const newDistribution = await RequestDistributionRepository.addDistribution(requestId, distribution);
      this.requestDistributions.push(newDistribution);
      this._selectedDistribution = newDistribution;
    },

    idsOfDistributionNotAssociatedWithPlantStageList(plantStageIds: Set<number>): number[] {
      const ids: number[] = []

      this.requestDistributions.forEach(rd => {
        plantStageIds.has(rd.plant_stage_id) && ids.push(rd.id)
      })

      return ids
    },

    getRequestIdsFromDistributionInStore(): Set<number> {
      const ids = new Set<number>();

      this.requestDistributions.forEach(distribution => {
        ids.add(distribution.request_id);
      })

      return ids;
    }
  }
});

export type RequestDistributionStore = ReturnType<typeof useRequestDistributionStore>;
