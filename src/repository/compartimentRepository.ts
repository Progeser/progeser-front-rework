import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";
import {Compartiment} from "@/model/Compartiment";

class CompartimentRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getCompartimentsPage(buildingid : number,pageNumber : number, pageSize : number = 10) : Promise<GenericPagination<Compartiment[]>>{
    return await this.fetchService.getWithPagination<Compartiment[]>(`buildings/${buildingid}/greenhouses?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async getAllCompartiments(buildingid : number) : Promise<Compartiment[]>{
    return await this.fetchService.get<Compartiment[]>(`buildings/${buildingid}/greenhouses`)
  }

  public async getCompartiment(buildingid : number) : Promise<Compartiment> {
    return await this.fetchService.get(`greenhouses/${buildingid}`)
  }

  public async putCompartiment(buildingid : number, data : Compartiment): Promise<Compartiment> {
    return await this.fetchService.put(`greenhouses/${buildingid}`, data)
  }

  public async postCompartiment(buildingid : number,data : Compartiment): Promise<Compartiment> {
    return await this.fetchService.post(`buildings/${buildingid}/greenhouses`,data)
  }

  public async deleteCompartiment(buildingid : number) : Promise<void> {
    return await this.fetchService.delete(`greenhouses/${buildingid}`)
  }
}

export default CompartimentRepository;
