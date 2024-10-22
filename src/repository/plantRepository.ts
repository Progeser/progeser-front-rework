import {Plant} from "@/model/Plant";
import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";

class PlantRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getPlantsPage(pageNumber : number, pageSize : number = 10) : Promise<GenericPagination<Plant[]>>{
    return await this.fetchService.getWithPagination<Plant[]>(`plants?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }
}

export default PlantRepository
