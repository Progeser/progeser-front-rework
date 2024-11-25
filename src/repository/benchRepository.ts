import FetchService from "@/service/fetchService";

class BenchRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async getBenches(greenhouseId: number): Promise<Bench[]> {
    return await this.fetchService.get<Bench[]>(`greenhouses/${greenhouseId}/benches`)
  }

  public async addBench(greenhouseId: number, bench: Partial<Bench>): Promise<Bench> {
    return await this.fetchService.post<Bench, Partial<Bench>>(`greenhouses/${greenhouseId}/benches`, bench)
  }

  public async updateBench(bench: Bench): Promise<Bench> {
    return await this.fetchService.put<Bench, Bench>(`benches/${bench.id}`, bench)
  }

  public async deleteBench(benchId: number): Promise<void> {
    return await this.fetchService.delete<void>(`benches/${benchId}`)
  }
}

export default new BenchRepository();
