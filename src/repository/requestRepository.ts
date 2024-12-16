import FetchService from "@/service/fetchService";

import {GenericPagination} from "@/model/GenericPagination";
import {RequestModel} from "@/model/RequestModel";
import {RequestOutput} from "@/model/output/RequestOutput";

export class RequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getRequests(pageNumber : number, pageSize : number = 10): Promise<GenericPagination<RequestModel[]>> {
    return await this.fetchService.getWithPagination(`requests?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async getRequest(id: number): Promise<RequestModel> {
    return await this.fetchService.get(`requests/${id}`)
  }

  public async acceptRequest(id: string): Promise<RequestModel> {
    return await this.fetchService.post(`requests/${id}/accept`)
  }

  public async rejectRequest(id: string): Promise<RequestModel> {
    return await this.fetchService.post(`requests/${id}/refuse`)
  }

  public async postRequest(data: RequestOutput): Promise<any> {
    return await this.fetchService.postWithoutBearer(`requests`, data);
  }

}
