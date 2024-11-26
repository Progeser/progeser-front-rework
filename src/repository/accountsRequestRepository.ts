import { AccountRequest } from "@/model/AccountRequest";
import FetchService from "@/service/fetchService";
import {AccountRequestOutput} from "@/model/output/AccountRequestOutput";

class AccountRequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async postAccountRequest(data: AccountRequestOutput): Promise<AccountRequest> {
    return await this.fetchService.post(`account_requests`, data);
  }

}

export default AccountRequestRepository;
