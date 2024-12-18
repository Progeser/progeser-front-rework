// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import PotRepository from "@/repository/potRepository";

interface PotStoreState {
  pots: Pot[];
  _selectedPot: Pot | null;
}

export const usePot = defineStore('pot', {
  state: (): PotStoreState => ({
    pots: [],
    _selectedPot: null,
  }),

  getters: {
    selectedPot: (state): Pot | null => state._selectedPot,
  },

  actions: {
    async loadPots() {
      this.pots = await PotRepository.getPots();
    },

    selectPot(id: number | null) {
      if (id === null) {
        this._selectedPot = null;
        return;
      }

      this._selectedPot = this.pots.find(p => p.id === id) || null;
    },
  }
});
