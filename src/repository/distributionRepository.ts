import FetchService from "@/service/fetchService";

class DistributionRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getDistributions(greenhouseId: number): Promise<Distribution[]> {
    return await this.fetchService.get<Distribution[]>(`greenhouses/${greenhouseId}/distributions`)
  }

  public async updateDistribution(distribution: Distribution): Promise<Distribution> {
    return await this.fetchService.put<Distribution, Distribution>(`distributions/${distribution.id}`, distribution)
  }

  public async addDistribution(distribution: Partial<Distribution>): Promise<Distribution> {
    return await this.fetchService.post<Distribution, Partial<Distribution>>(`distributions`, distribution)
  }
}

export default new DistributionRepository();
