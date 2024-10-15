import axios, {AxiosResponse} from 'axios';
import {useAuthStore} from "@/store/AuthStore";

class FetchService {
  private readonly baseUrl: string = `${import.meta.env.VITE_API_URL}`;

  private authStore = useAuthStore()

  private login: string = "dev+grower@progeser.com"
  private pass: string = "password"

  // GET request
  public async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    try {
      const bearer: string = await this.authStore.getBearer(this.login,this.pass)
      return await axios.get<T>(`${this.baseUrl}${endpoint}`, {headers:{Authorization: bearer}});
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  public async post<T, U>(endpoint: string, data: U): Promise<AxiosResponse<T>> {
    try {
      const bearer: string = await this.authStore.getBearer(this.login,this.pass)
      return await axios.post<T>(`${this.baseUrl}${endpoint}`, data, {headers:{Authorization: bearer}});
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  public async put<T, U>(endpoint: string, data: U): Promise<AxiosResponse<T>> {
    try {
      const bearer: string = await this.authStore.getBearer(this.login,this.pass)
      return await axios.put<T>(`${this.baseUrl}${endpoint}`, data, {headers:{Authorization: bearer}});
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    try {
      const bearer: string = await this.authStore.getBearer(this.login,this.pass)
      return await axios.delete<T>(`${this.baseUrl}${endpoint}`, {headers:{Authorization: bearer}});
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Handle errors
  private handleError(error: any): void {
    // Log or handle the error as needed
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export default FetchService;
