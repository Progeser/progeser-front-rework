import { defineStore } from 'pinia';
import {UserModel} from "@/model/UserModel";
import router from "@/router"
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
      if (!this.currentUser) {
        await this.setCurrentUser();
      }
      return this.currentUser;
    },
    async isGrower() {
      if (!this.currentUser) {
        await this.setCurrentUser()
      }
      if (this.currentUser?.role === 'Grower') {
        await router.push({name: 'Login'});
      }
    }
  },
  persist: {
    key: 'user',
    storage: localStorage,
  }
});
