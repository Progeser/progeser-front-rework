// src/stores/BenchStore.ts
import {defineStore} from 'pinia';
import BenchRepository from "@/repository/benchRepository";
import {Dimension, Position} from "@/utils/canvas";

interface BenchStoreState {
  benches: Bench[];
  newBenchesNotSaved: Set<number>;
  updatedBenchesNotSaved: Set<number>;
  deletedBenchesNotSaved: Set<number>;
}

export const useBenchStore = defineStore('bench', {
  state: (): BenchStoreState => ({
    benches: [],
    newBenchesNotSaved: new Set(),
    updatedBenchesNotSaved: new Set(),
    deletedBenchesNotSaved: new Set(),
  }),

  actions: {
    async loadBenches(greenhouseId: number) {
      this.benches = await BenchRepository.getBenches(greenhouseId);
    },

    getBenchById(benchId: number): (Bench | undefined) {
      return this.benches.find(bench => bench.id === benchId);
    },

    nextBenchId(): number {
      const ids = this.benches.map(bench => bench.id);
      return Math.max(...ids, 0) + 1;
    },

    async save(): Promise<any[]> {
      const errors = []

      for (const benchId of this.deletedBenchesNotSaved) {
        try {
          await BenchRepository.deleteBench(benchId)
        } catch (e) {
          errors.push(e)
        }
      }
      this.deletedBenchesNotSaved.clear();

      for (const benchId of this.updatedBenchesNotSaved) {
        const bench = this.getBenchById(benchId)
        if (!bench) continue;
        try {
          const updatedBench = await BenchRepository.updateBench(bench)
          this.benches = [...this.benches.filter(b => bench.id !== b.id), updatedBench]
        } catch (e) {
          errors.push(e)
        }
      }
      this.updatedBenchesNotSaved.clear();

      for (const benchId of this.newBenchesNotSaved) {
        const bench = this.getBenchById(benchId)
        if (!bench) continue;
        try {
          const newBench = await BenchRepository.addBench(bench.greenhouse_id, bench)
          this.benches = [...this.benches.filter(bench => benchId !== bench.id), newBench]
        } catch (e) {
          errors.push(e)
        }
      }
      this.newBenchesNotSaved.clear();

      return errors
    },

    addBench(pos: Position, dim: Dimension, greenhouseId: number): number {
      const id = this.nextBenchId();
      this.benches = [...this.benches, {
        id: id,
        name: "New Bench",
        greenhouse_id: greenhouseId,
        positions: [pos.x, pos.y],
        dimensions: [dim.w, dim.h],
        request_distribution_ids: [],
        created_at: new Date(),
        updated_at: new Date(),
      }];
      this.newBenchesNotSaved.add(id);
      return id;
    },

    removeBench(benchId: number) {
      this.benches = this.benches.filter(bench => bench.id !== benchId);

      if (this.newBenchesNotSaved.has(benchId)) {
        this.newBenchesNotSaved.delete(benchId);
        return;
      }

      if (this.updatedBenchesNotSaved.has(benchId)) this.updatedBenchesNotSaved.delete(benchId);
      this.deletedBenchesNotSaved.add(benchId);
    },

    updateBenchDimensions(benchId: number, w: number, h: number) {
      const selectedBench = this.benches.find(bench => bench.id === benchId);
      if (!selectedBench) return;

      if (w < 0) {
        selectedBench.positions[0] += w;
      }
      if (h < 0) {
        selectedBench.positions[1] += h;
      }

      selectedBench.dimensions = [Math.abs(w), Math.abs(h)];
      selectedBench.updated_at = new Date();

      this.benches = [...this.benches.filter(bench => bench.id !== benchId), selectedBench];
      !this.newBenchesNotSaved.has(benchId) && this.updatedBenchesNotSaved.add(selectedBench.id);
    },

    updateBenchPositions(benchId: number, x: number, y: number) {
      const selectedBench = this.benches.find(bench => bench.id === benchId);
      if (!selectedBench) return;

      selectedBench.positions = [Math.abs(x), Math.abs(y)];
      selectedBench.updated_at = new Date();

      this.benches = [...this.benches.filter(bench => bench.id !== benchId), selectedBench];
      !this.newBenchesNotSaved.has(benchId) && this.updatedBenchesNotSaved.add(selectedBench.id);
    },

    updateBenchName(benchId: number, name: string) {
      const selectedBench = this.benches.find(bench => bench.id === benchId);
      if (!selectedBench) return;

      selectedBench.name = name;
      selectedBench.updated_at = new Date();

      this.benches = [...this.benches.filter(bench => bench.id !== benchId), selectedBench];
      !this.newBenchesNotSaved.has(benchId) && this.updatedBenchesNotSaved.add(selectedBench.id);
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
