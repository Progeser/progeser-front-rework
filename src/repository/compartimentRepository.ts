import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";

class CompartimentRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getCompartimentsPage(pageNumber : number, pageSize : number = 10) : Promise<GenericPagination<Compartiment[]>>{
    return await this.fetchService.getWithPagination<Compartiment[]>(`/api/v1/greenhouses?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }
}

export default CompartimentRepository;
