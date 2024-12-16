import { Building } from "@/model/Building";
import FetchService from "@/service/fetchService";
import { GenericPagination } from "@/model/GenericPagination";
import {BuildingOutput} from "@/model/output/BuildingOutput";

class BuildingRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getBuildingsPage(pageNumber: number, pageSize: number = 10): Promise<GenericPagination<Building[]>> {
    return await this.fetchService.getWithPagination<Building[]>(`buildings?page[number]=${pageNumber}&page[size]=${pageSize}`);
  }

  public async getAllBuildings(): Promise<Building[]> {
    return await this.fetchService.get<Building[]>(`buildings`);
  }

  public async getBuilding(id: number): Promise<Building> {
    return await this.fetchService.get<Building>(`buildings/${id}`);
  }

  public async putBuilding(id: number, data: Building): Promise<Building> {
    return await this.fetchService.put(`buildings/${id}`, this.makeBuildingOutput(data));
  }

  public async postBuilding(data: Building): Promise<Building> {
    return await this.fetchService.post(`buildings`, this.makeBuildingOutput(data));
  }

  public async deleteBuilding(id: number): Promise<void> {
    return await this.fetchService.delete(`buildings/${id}`);
  }

  private makeBuildingOutput(data: Building): BuildingOutput {
    const buildingOutput: BuildingOutput = new BuildingOutput();
    buildingOutput.name = data.name;
    buildingOutput.description = data.description;
    return buildingOutput;
  }
}

export default BuildingRepository;
