import { AccountRequest } from "@/model/AccountRequest";
import FetchService from "@/service/fetchService";
import {RequestOutput} from "@/model/output/RequestOutput";

class RequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async postAccountRequest(data: RequestOutput): Promise<AccountRequest> {
    return await this.fetchService.postWithoutBearer(`requests`, data);
  }
}

export default RequestRepository;
