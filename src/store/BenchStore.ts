// src/stores/BenchStore.ts
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
    async loadBenches(greenhouseId: number) {
      this.benches = await BenchRepository.getBenches(greenhouseId);
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

    async addBench(greenhouseId: number, bench: Partial<Bench>) {
      const newBench = await BenchRepository.addBench(greenhouseId, bench);
      this.benches.push(newBench);
      this._selectedBench = newBench;
    },

    async updateBench(bench: Bench) {
      try {
        const updateBench = await BenchRepository.updateBench(bench);
        this.benches = this.benches.map(b => b.id === updateBench.id ? updateBench : b);
        this._selectedBench = updateBench;
      } catch (error) {
        this._selectedBench = this.benches.find(b => b.id === bench.id) || null;
      }
    },

    async deleteBench(benchId: number) {
      await BenchRepository.deleteBench(benchId);
      this.benches = this.benches.filter(bench => bench.id !== benchId);
      this._selectedBench = null;
    },

    getBenchById(benchId: number): (Bench | undefined) {
      return this.benches.find(bench => bench.id === benchId);
    }
  }
});
