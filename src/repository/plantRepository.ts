import FetchService from "@/service/fetchService";

class PlantRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getPlant(): Promise<Plant[]> {
    return await this.fetchService.get<Plant[]>(`plants`)
  }
}

export default new PlantRepository();
