import FetchService from "@/service/fetchService";

class PotRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getPots(): Promise<Pot[]> {
    return await this.fetchService.get<Pot[]>(`pots`)
  }
}

export default new PotRepository();
