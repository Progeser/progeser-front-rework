import { defineStore } from 'pinia';
import axios from "axios";
import { AuthModel } from "@/model/AuthModel";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null as AuthModel | null
  }),
  actions: {
    async login(email: string, password: string) {
      await this.fetchAuth(email, password);
    },

    async fetchAuth(email: string, password: string) {
      await axios.post<AuthModel>(`${baseUrl}/oauth/token`,null, {
        params: {
          email,
          password,
          "grant_type": password,
          "client_id": "VkU79vCSfXw0rkYEOBbjMWflqsvBbznAr340OZ_3yAU"
        }
      }).then(response => {
        console.log(response);
        this.token = response.data;
      });
    },
  }
});
