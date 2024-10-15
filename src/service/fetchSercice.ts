import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

class ApiService {
  private readonly baseUrl: string = `${import.meta.env.VITE_API_URL}`;

  // GET request
  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.get<T>(`${this.baseUrl}${endpoint}`, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  public async post<T, U>(endpoint: string, data: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.post<T>(`${this.baseUrl}${endpoint}`, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  public async put<T, U>(endpoint: string, data: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.put<T>(`${this.baseUrl}${endpoint}`, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  public async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.delete<T>(`${this.baseUrl}${endpoint}`, config);
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

export default ApiService;
