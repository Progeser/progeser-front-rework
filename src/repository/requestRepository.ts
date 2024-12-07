import FetchService from "@/service/fetchService";

class RequestRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getDistributions(): Promise<Request[]> {
    return await this.fetchService.get<Request[]>(`requests`)
  }
}

export default new RequestRepository();
