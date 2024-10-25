import {Species} from "@/model/Species";
import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";

class SpeciesRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getSpeciesPage(pageNumber : number, pageSize : number = 10) : Promise<GenericPagination<Species[]>>{
    return await this.fetchService.getWithPagination<Species[]>(`plants?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async getSpecies(id: number) : Promise<Species> {
    return await this.fetchService.get<Species>(`plants/${id}`)
  }
}

export default SpeciesRepository
