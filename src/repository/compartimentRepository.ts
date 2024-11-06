import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";

class CompartimentRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getCompartimentsPage(buildingid : number,pageNumber : number, pageSize : number = 1) : Promise<GenericPagination<Compartiment[]>>{
    return await this.fetchService.getWithPagination<Compartiment[]>(`buildings/${buildingid}/greenhouses?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }
}

export default CompartimentRepository;
