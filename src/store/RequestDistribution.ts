// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestDistributionRepository from "@/repository/requestDistributionRepository";
import {Dimension, Position} from "@/utils/canvas";

interface RequestDistributionStoreState {
  requestDistributions: RequestDistribution[];

  newDistributionsNotSaved: Set<number>;
  updatedDistributionsNotSaved: Set<number>;
  deletedDistributionsNotSaved: Set<number>;
}

export const useRequestDistributionStore = defineStore('requestDistribution', {
  state: (): RequestDistributionStoreState => ({
    requestDistributions: [],
    newDistributionsNotSaved: new Set(),
    updatedDistributionsNotSaved: new Set(),
    deletedDistributionsNotSaved: new Set(),
  }),

  actions: {
    async loadDistributions() {
      this.requestDistributions = await RequestDistributionRepository.getRequestDistributions();
    },

    async loadDistributionByIds(distributionIds: Set<number>) {
      this.requestDistributions = [];
      for (const id of distributionIds) {
        const distribution = await RequestDistributionRepository.getDistributionById(id);
        if (!distribution) continue;
        this.requestDistributions = [...this.requestDistributions, distribution];
      }
    },

    getDistributionById(id: number): RequestDistribution | null {
      return this.requestDistributions.find(rd => rd.id === id) || null;
    },

    gedPlantedSeedsForRequest(requestId: number): number {
      let seedQuantity = 0
      for (const distribution of this.requestDistributions) {
        if (distribution.request_id !== requestId) continue;
        seedQuantity += distribution.pot_quantity
      }
      return seedQuantity;
    },

    getDistributionByBenchId(benchId: number): RequestDistribution[] {
      return this.requestDistributions.filter(rd => rd.bench_id === benchId);
    },

    getIdsOfDistributionNotAssociatedWithRequestId(request_id: number): number[] {
      const ids: number[] = []

      this.requestDistributions.forEach(rd => {
        rd.request_id !== request_id && ids.push(rd.id)
      })

      return ids;
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
    },

    updateDistributionPositions(distributionId: number, x: number, y: number) {
      const distribution = this.requestDistributions.find(distribution => distribution.id === distributionId);
      if (!distribution) return;

      distribution.positions_on_bench = [x, y];
      distribution.updated_at = new Date();

      this.requestDistributions = [...this.requestDistributions.filter(distribution => distribution.id !== distributionId), distribution];
      !this.newDistributionsNotSaved.has(distributionId) && this.updatedDistributionsNotSaved.add(distribution.id);
    },

    updateDistributionDimensions(distributionId: number, w: number, h: number) {
      const distribution = this.requestDistributions.find(distribution => distribution.id === distributionId);
      if (!distribution) return;

      if (w < 0) {
        distribution.positions_on_bench[0] += w;
      }
      if (h < 0) {
        distribution.positions_on_bench[1] += h;
      }

      distribution.dimensions = [Math.abs(w), Math.abs(h)];
      distribution.updated_at = new Date();

      this.requestDistributions = [...this.requestDistributions.filter(distribution => distribution.id !== distributionId), distribution];
      !this.newDistributionsNotSaved.has(distributionId) && this.updatedDistributionsNotSaved.add(distribution.id);
    },

    updateDistributionPotQuantity(distributionId: number, quantity: number) {
      const distribution = this.requestDistributions.find(distribution => distribution.id === distributionId);
      if (!distribution) return;

      distribution.pot_quantity = quantity;
      distribution.updated_at = new Date();

      this.requestDistributions = [...this.requestDistributions.filter(distribution => distribution.id !== distributionId), distribution];
      !this.newDistributionsNotSaved.has(distributionId) && this.updatedDistributionsNotSaved.add(distribution.id);
    },

    updateDistributionBenchId(distributionId: number, bench_id: number) {
      const distribution = this.requestDistributions.find(distribution => distribution.id === distributionId);
      if (!distribution) return;

      distribution.bench_id = bench_id
      distribution.updated_at = new Date();

      this.requestDistributions = [...this.requestDistributions.filter(distribution => distribution.id !== distributionId), distribution];
      !this.newDistributionsNotSaved.has(distributionId) && this.updatedDistributionsNotSaved.add(distribution.id);
    },

    nextBenchId(): number {
      const ids = this.requestDistributions.map(distribution => distribution.id);
      return Math.max(...ids, 0) + 1;
    },

    addDistribution(requestId: number, pos: Position, dim: Dimension, potId: number, potQuantity: number, plantStageId: number): number {
      const id = this.nextBenchId();
      this.requestDistributions = [...this.requestDistributions, {
        id: id,
        request_id: requestId,
        bench_id: -1,
        positions_on_bench: [pos.x, pos.y],
        dimensions: [dim.w, dim.h],
        pot_id: potId,
        pot_quantity: potQuantity,
        plant_stage_id: plantStageId,
        created_at: new Date(),
        updated_at: new Date(),
      }];
      this.newDistributionsNotSaved.add(id);
      return id;
    },

    removeDistribution(distributionId: number) {
      this.requestDistributions = this.requestDistributions.filter(distribution => distribution.id !== distributionId);
      this.deletedDistributionsNotSaved.add(distributionId);
    },


    async save(): Promise<any[]> {
      const errors = []

      for (const distributionId of this.deletedDistributionsNotSaved) {
        try {
          await RequestDistributionRepository.removeDistributionById(distributionId)
        } catch (e) {
          errors.push(e)
        }
      }
      this.deletedDistributionsNotSaved.clear();

      for (const distributionId of this.updatedDistributionsNotSaved) {
        const distribution = this.getDistributionById(distributionId)
        if (!distribution) continue;
        try {
          const updatedBench = await RequestDistributionRepository.updateDistribution(distribution)
          this.requestDistributions = [...this.requestDistributions.filter(rd => rd.id !== distributionId), updatedBench]
        } catch (e) {
          errors.push(e)
        }
      }
      this.updatedDistributionsNotSaved.clear();

      for (const distributionId of this.newDistributionsNotSaved) {
        const distribution = this.getDistributionById(distributionId)
        if (!distribution) continue;
        try {
          const newBench = await RequestDistributionRepository.addDistribution(distribution.request_id, distribution)
          this.requestDistributions = [...this.requestDistributions.filter(rd => distributionId !== rd.id), newBench]
        } catch (e) {
          errors.push(e)
        }
      }
      this.newDistributionsNotSaved.clear();

      return errors
    },
  }
});

export type RequestDistributionStore = ReturnType<typeof useRequestDistributionStore>;
