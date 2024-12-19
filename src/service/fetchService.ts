import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from "@/store/AuthStore";
import { GenericPagination } from '@/model/GenericPagination';
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbarStore";

class FetchService {
  private readonly baseUrl: string = `${import.meta.env.VITE_API_URL}`;
  private readonly authStore = useAuthStore();
  private readonly snackbarStore = useSnackbarStore();

  // GET request
  public async get<T>(endpoint: string): Promise<T> {
    try {
      const bearer: string | undefined = await this.authStore.getBearer();
      const response: AxiosResponse<T> = await axios.get<T>(`${this.baseUrl}${endpoint}`, { headers: { Authorization: bearer } });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async getWithoutBearer<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get<T>(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // GET request with pagination
  public async getWithPagination<T>(endpoint: string): Promise<GenericPagination<T>> {
    try {
      const bearer: string | undefined = await this.authStore.getBearer();
      const response: AxiosResponse<T> = await axios.get<T>(`${this.baseUrl}${endpoint}`, {
        headers: { Authorization: bearer }
      });

      return new GenericPagination(
        response.headers['pagination-current-page'],
        response.headers['pagination-per'],
        response.headers['pagination-total-pages'],
        response.headers['pagination-total-count'],
        response.data
      );

    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  public async post<T, U>(endpoint: string, data?: U): Promise<T> {
    try {
      const bearer: string | undefined = await this.authStore.getBearer();
      const response: AxiosResponse<T> = await axios.post<T>(`${this.baseUrl}${endpoint}`, data, { headers: { Authorization: bearer } });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async postWithoutBearer<T, U>(endpoint: string, data: U): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post<T>(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  public async put<T, U>(endpoint: string, data: U): Promise<T> {
    try {
      const bearer: string | undefined = await this.authStore.getBearer();
      const response: AxiosResponse<T> = await axios.put<T>(`${this.baseUrl}${endpoint}`, data, { headers: { Authorization: bearer } });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<T> {
    try {
      const bearer: string | undefined = await this.authStore.getBearer();
      const response: AxiosResponse<T> = await axios.delete<T>(`${this.baseUrl}${endpoint}`, { headers: { Authorization: bearer } });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private async handleError(error: any): Promise<void> {
    if (error.status === 401 || error.status === 403) {
      this.snackbarStore.showMessage('Session expirée. Veuillez vous reconnecter.')

      await new Promise(resolve => setTimeout(resolve, 1000))
      await router.push({name: 'Login'})
    }

    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

export default FetchService;
