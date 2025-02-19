import FetchService from "@/service/fetchService";

class RequestDistributionRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getRequestDistributions(): Promise<RequestDistribution[]> {
    return await this.fetchService.get<RequestDistribution[]>(`request_distributions`)
  }

  public async getDistributionById(id: number): Promise<RequestDistribution> {
    return await this.fetchService.get<RequestDistribution>(`request_distributions/${id}`)
  }

  public async removeDistributionById(id: number): Promise<RequestDistribution> {
    return await this.fetchService.delete<RequestDistribution>(`request_distributions/${id}`)
  }

  public async updateDistribution(distribution: Partial<RequestDistribution>): Promise<RequestDistribution> {
    return await this.fetchService.put<RequestDistribution, Partial<RequestDistribution>>(`request_distributions/${distribution.id}`, distribution)
  }

  public async addDistribution(requestId: number, distribution: Partial<RequestDistribution>): Promise<RequestDistribution> {
    return await this.fetchService.post<RequestDistribution, Partial<RequestDistribution>>(`requests/${requestId}/request_distributions`, distribution)
  }
}

export default new RequestDistributionRepository();
