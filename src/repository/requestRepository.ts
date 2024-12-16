import FetchService from "@/service/fetchService";

import {GenericPagination} from "@/model/GenericPagination";
import {Request} from "@/model/Request";
import {RequestOutput} from "@/model/output/RequestOutput";

class RequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getRequests(pageNumber: number, pageSize: number = 10): Promise<GenericPagination<Request[]>> {
    return await this.fetchService.getWithPagination(`requests?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async acceptRequest(id: string): Promise<Request> {
    return await this.fetchService.post(`requests/${id}/accept`)
  }

  public async rejectRequest(id: string): Promise<Request> {
    return await this.fetchService.post(`requests/${id}/refuse`)
  }

  public async postRequest(data: RequestOutput): Promise<any> { //todo remove any
    return await this.fetchService.postWithoutBearer(`requests`, data);
  }

  public async getRequest(requestId: number): Promise<Request> {
    return await this.fetchService.get<Request>(`requests/${requestId}/`)
  }
}

export default new RequestRepository();
