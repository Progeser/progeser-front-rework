import { defineStore } from 'pinia';
import {UserModel} from "@/model/UserModel";
import UserRepository from "@/repository/userRepository";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    currentUser: null as UserModel | null
  }),
  actions: {
    async setCurrentUser() {
      this.currentUser = await new UserRepository().getCurrentUser();
    },
    async getCurrentUser() {
      return this.currentUser;
    }
  },
  persist: {
    key: 'user',
    storage: localStorage,
  }
});
