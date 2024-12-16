import FetchService from "@/service/fetchService";

class DistributionRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getGreenhouses(building_id: number): Promise<Greenhouse[]> {
    return await this.fetchService.get<Greenhouse[]>(`buildings/${building_id}/greenhouses`)
  }
}

export default new DistributionRepository();
