// src/stores/BenchStore.ts
import {defineStore} from 'pinia';
import BenchRepository from "@/repository/benchRepository";

interface BenchStoreState {
  benches: Bench[];
  benchesNotSaved: Set<number>;
}

export const useBenchStore = defineStore('bench', {
  state: (): BenchStoreState => ({
    benches: [],
    benchesNotSaved: new Set(),
  }),

  actions: {
    async loadBenches(greenhouseId: number) {
      this.benches = await BenchRepository.getBenches(greenhouseId);
    },

    getBenchById(benchId: number): (Bench | undefined) {
      return this.benches.find(bench => bench.id === benchId);
    },

    updateBenchDimensions(benchId: number, w: number, h: number) {
      const selectedBench = this.benches.find(bench => bench.id === benchId);
      if (!selectedBench) return;

      console.log(w, h)

      if (w < 0) {
        selectedBench.positions[0] += w;
      }
      if (h < 0) {
        selectedBench.positions[1] += h;
      }

      selectedBench.dimensions = [Math.abs(w), Math.abs(h)];

      this.benches = [...this.benches.filter(bench => bench.id !== benchId), selectedBench];
      this.benchesNotSaved.add(selectedBench.id);
    },

    updateBenchPositions(benchId: number, x: number, y: number) {
      const selectedBench = this.benches.find(bench => bench.id === benchId);
      if (!selectedBench) return;

      selectedBench.positions = [Math.abs(x), Math.abs(y)];

      this.benches = [...this.benches.filter(bench => bench.id !== benchId), selectedBench];
      this.benchesNotSaved.add(selectedBench.id);
    },

    getRequestDistributionIdsFromBenchesInStore(): Set<number> {
      const ids = new Set<number>();

      this.benches.forEach(bench => {
        bench.request_distribution_ids.forEach(id => ids.add(id));
      })

      return ids;
    }
  }
});

export type BenchStore = ReturnType<typeof useBenchStore>;
