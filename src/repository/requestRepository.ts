import FetchService from "@/service/fetchService";

import {GenericPagination} from "@/model/GenericPagination";
import {RequestModel} from "@/model/RequestModel";
import {RequestOutput} from "@/model/output/RequestOutput";

class RequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getRequests(pageNumber: number, pageSize: number = 10, status: string, sortBy: { key: "plant_name", order: "asc" }[]): Promise<GenericPagination<RequestModel[]>> {
    return await this.fetchService.getWithPagination(`requests?page[number]=${pageNumber}&page[size]=${pageSize}&filter[status]=${status}&sort=${this.getSortString(sortBy)}`);
  }

  public async getRequest(id: number): Promise<RequestModel> {
    return await this.fetchService.get(`requests/${id}`)
  }

  public async acceptRequest(id: number): Promise<RequestModel> {
    return await this.fetchService.post(`requests/${id}/accept`)
  }

  public async rejectRequest(id: string): Promise<RequestModel> {
    return await this.fetchService.post(`requests/${id}/refuse`)
  }

  public async postRequest(data: RequestOutput): Promise<RequestModel> {
    return await this.fetchService.postWithoutBearer(`requests`, data);
  }

  public async finishRequest(id: string): Promise<RequestModel> {
    return await this.fetchService.post(`requests/${id}/complete`)
  }

  private getSortString(sortBy: { key: string; order: "asc" | "desc" }[]): string {
    if (!sortBy || sortBy.length === 0) return '';

    return sortBy.map(sortOption =>
      sortOption.order === "asc" ? sortOption.key : `-${sortOption.key}`
    ).join(',');
  }
}

export default new RequestRepository();
