// src/stores/useBenchStore.ts
import {defineStore} from 'pinia';
import RequestRepository from "@/repository/requestRepository";

interface RequestStoreState {
  request: Request[];
}

export const useRequest = defineStore('request', {
  state: (): RequestStoreState => ({
    request: [],
  }),

  actions: {
    async loadRequests() {
      this.request = await RequestRepository.getDistributions();
    },

    getRequestById(id: number): Request | null {
      return this.request.find(r => r.id === id) || null;
    },
  }
});
