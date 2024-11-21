// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import BenchRepository from "@/repository/benchRepository";

interface BenchStoreState {
  benches: Bench[];
  _selectedBench: Bench | null;
}

export const useBenchStore = defineStore('bench', {
  state: (): BenchStoreState => ({
    benches: [],
    _selectedBench: null,
  }),

  getters: {
    selectedBench: (state): Bench | null => state._selectedBench,
  },

  actions: {
    async loadBenches(buildingId: number, greenhouseId: number) {
      this.benches = await BenchRepository.getBenches(buildingId, greenhouseId);
    },

    selectBench(bench: Bench | null) {
      this._selectedBench = bench;
    },

    updateSelectedBenchName(name: string) {
      if (!this._selectedBench) {
        return;
      }

      this._selectedBench = {...this._selectedBench, name: name};
    },

    updateSelectedBenchDimensions(dimensions: number[]) {
      if (!this._selectedBench) {
        return;
      }

      this._selectedBench = {...this._selectedBench, dimensions: dimensions};
    },

    updateSelectedBenchPositions(positions: number[]) {
      if (!this._selectedBench) {
        return;
      }

      this._selectedBench = {...this._selectedBench, positions: positions};
    },

    async addBench(buildingId: number, greenhouseId: number, bench: Partial<Bench>) {
      const newBench = await BenchRepository.addBench(buildingId, greenhouseId, bench);
      this.benches.push(newBench);
      this._selectedBench = newBench;
    },

    async updateBench(buildingId: number, greenhouseId: number, bench: Bench) {
      try {
        const updateBench = await BenchRepository.updateBench(buildingId, greenhouseId, bench);
        this.benches = this.benches.map(b => b.id === updateBench.id ? updateBench : b);
        this._selectedBench = updateBench;
      } catch (error) {
        this._selectedBench = this.benches.find(b => b.id === bench.id) || null;
      }
    },

    async deleteBench(buildingId: number, greenhouseId: number, benchId: number) {
      await BenchRepository.deleteBench(buildingId, greenhouseId, benchId);
      this.benches = this.benches.filter(bench => bench.id !== benchId);
      this._selectedBench = null;
    },
  }
});
