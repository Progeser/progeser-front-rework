import { AccountRequest } from "@/model/AccountRequest";
import FetchService from "@/service/fetchService";
import {AccountRequestOutput} from "@/model/output/AccountRequestOutput";
import {GenericPagination} from "@/model/GenericPagination";

class AccountRequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getAccountRequest(pageNumber : number, pageSize : number = 10): Promise<GenericPagination<AccountRequest[]>> {
    return await this.fetchService.getWithPagination<AccountRequest[]>(`account_requests?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async postAccountRequest(data: AccountRequestOutput): Promise<AccountRequest> {
    return await this.fetchService.postWithoutBearer(`account_requests`, data);
  }
}

export default AccountRequestRepository;
