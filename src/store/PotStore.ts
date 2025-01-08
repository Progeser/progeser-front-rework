// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import PotRepository from "@/repository/potRepository";

interface PotStoreState {
  pots: Pot[];
}

export const usePotStore = defineStore('pot', {
  state: (): PotStoreState => ({
    pots: [],
  }),

  actions: {
    async loadPots() {
      this.pots = await PotRepository.getPots();
    },

    getPotById(potId: number): Pot | null {
      return this.pots.find((p) => p.id === potId) || null
    },
  }
});

export type PotStore = ReturnType<typeof usePotStore>;
