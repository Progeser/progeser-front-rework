// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import DistributionRepository from "@/repository/distributionRepository";

interface DistributionStoreState {
  distributions: Distribution[];
  _selectedDistribution: Distribution | null;
}

export const useDistribution = defineStore('distribution', {
  state: (): DistributionStoreState => ({
    distributions: [],
    _selectedDistribution: null,
  }),

  getters: {
    selectedDistribution: (state): Distribution | null => state._selectedDistribution,
  },

  actions: {
    async loadDistributions(greenhouseId: number) {
      this.distributions = await DistributionRepository.getDistributions(greenhouseId);
    },

    getDistributionByBenchId(bench_id: number): Distribution[] | null {
      return this.distributions.filter(d => d.bench_id === bench_id) || null;
    },

    getDistributionByRequestDistributionId(request_distribution_id: number): Distribution[] | null {
      return this.distributions.filter(d => d.request_distribution_id === request_distribution_id) || null;
    },

    selectDistribution(distribution: Distribution | null) {
      this._selectedDistribution = distribution;
    },

    updateDistributionPositions(positions: number[]) {
      if (!this._selectedDistribution) {
        return;
      }

      this._selectedDistribution = {...this._selectedDistribution, positions_on_bench: positions};
    },

    async updateDistribution(distribution: Distribution) {
      try {
        const updateDistribution = await DistributionRepository.updateDistribution(distribution);
        this.distributions = this.distributions.map(d => d.id === updateDistribution.id ? updateDistribution : d);
        this._selectedDistribution = updateDistribution;
      } catch (error) {
        this._selectedDistribution = this.distributions.find(d => d.id === distribution.id) || null;
      }
    },

    async addDistribution(distribution: Partial<Distribution>) {
      const newDistribution = await DistributionRepository.addDistribution(distribution);
      this.distributions.push(newDistribution);
      this._selectedDistribution = newDistribution;
    },
  }
});
