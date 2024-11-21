import FetchService from "@/service/fetchService";

class BenchRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getBenches(buildingId: number, greenhouseId: number): Promise<Bench[]> {
    return await this.fetchService.get<Bench[]>(`buildings/${buildingId}/greenhouses/${greenhouseId}/benches`)
  }

  public async addBench(buildingId: number, greenhouseId: number, bench: Partial<Bench>): Promise<Bench> {
    return await this.fetchService.post<Bench, Partial<Bench>>(`buildings/${buildingId}/greenhouses/${greenhouseId}/benches`, bench)
  }

  public async updateBench(buildingId: number, greenhouseId: number, bench: Bench): Promise<Bench> {
    return await this.fetchService.put<Bench, Bench>(`buildings/${buildingId}/greenhouses/${greenhouseId}/benches/${bench.id}`, bench)
  }

  public async deleteBench(buildingId: number, greenhouseId: number, benchId: number): Promise<void> {
    return await this.fetchService.delete<void>(`buildings/${buildingId}/greenhouses/${greenhouseId}/benches/${benchId}`)
  }
}

export default new BenchRepository();
