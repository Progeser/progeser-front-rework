import FetchService from "@/service/fetchService";

class RequestDistributionRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getRequestDistributions(): Promise<RequestDistribution[]> {
    return await this.fetchService.get<RequestDistribution[]>(`request_distributions`)
  }

}

export default new RequestDistributionRepository();
