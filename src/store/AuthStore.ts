import { defineStore } from 'pinia';
import axios from "axios";
import { AuthModel } from "@/model/AuthModel";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const clientId = `${import.meta.env.VITE_CLIENT_ID}`;
const grantTypes = `${import.meta.env.VITE_GRANT_TYPE}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null as AuthModel | null
  }),
  actions: {
    async login(email: string, password: string) {
      await this.fetchAuth(email, password);
    },
    async getBearer(email: string, password: string): Promise<string>{
      await this.login(email,password)
      return `${this.token!.token_type} ${this.token!.access_token}`
    },
    async fetchAuth(email: string, password: string) {
      await axios.post<AuthModel>(`${baseUrl}/oauth/token`,null, {
        params: {
          email,
          password,
          "grant_type": grantTypes,
          "client_id": clientId
        }
      }).then(response => {
        this.token = response.data;
      });
    },
    logout(){
      this.token = null;
    }
  }
});
