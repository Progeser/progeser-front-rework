import { defineStore } from 'pinia';
import axios from "axios";
import { AuthModel } from "@/model/AuthModel";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
const clientId = `${import.meta.env.VITE_CLIENT_ID}`;
const grantTypes = `${import.meta.env.VITE_GRANT_TYPE}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: null as AuthModel | null,
    tokenExpirationTime: 0 as number
  }),
  actions: {
    async login(email: string, password: string) {
      await this.fetchAuth(email, password);
    },

    async getBearer(): Promise<string> {
      if (this.token && Date.now() < this.tokenExpirationTime) {
        return `${this.token.token_type} ${this.token.access_token}`;
      }

      if (this.token?.refresh_token) {
        try {
          await this.refreshToken();
          if (this.token) {
            return `${this.token.token_type} ${this.token.access_token}`;
          }
        } catch (error) {
          console.error("Échec du rafraîchissement du token :", error);
        }
      }
      this.logout();
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    },

    async fetchAuth(email: string, password: string) {
      await axios.post<AuthModel>(`${baseUrl}/oauth/token`, null, {
        params: {
          email,
          password,
          "grant_type": grantTypes,
          "client_id": clientId
        }
      }).then(response => {
        this.setToken(response.data);
      });
    },

    async refreshToken() {
      try {
        const response = await axios.post<AuthModel>(`${baseUrl}/oauth/token`, null, {
          params: {
            "grant_type": "refresh_token",
            "refresh_token": this.token!.refresh_token,
            "client_id": clientId
          }
        });
        this.setToken(response.data);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        this.logout();
      }
    },

    setToken(data: AuthModel) {
      this.token = data;
      const expiresInMs = parseInt(String(data.expires_in), 10) * 1000;
      this.tokenExpirationTime = Date.now() + expiresInMs;
    },

    logout() {
      this.token = null;
      this.tokenExpirationTime = 0;
    }
  }
});
