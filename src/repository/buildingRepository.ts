import { Building } from "@/model/Building";
import FetchService from "@/service/fetchService";
import { GenericPagination } from "@/model/GenericPagination";

class BuildingRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getBuildingsPage(pageNumber: number, pageSize: number = 10): Promise<GenericPagination<Building[]>> {
    return await this.fetchService.getWithPagination<Building[]>(`buildings?page[number]=${pageNumber}&page[size]=${pageSize}`);
  }
}

export default BuildingRepository;
