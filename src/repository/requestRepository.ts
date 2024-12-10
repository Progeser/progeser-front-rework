import FetchService from "@/service/fetchService";
import {RequestOutput} from "@/model/output/RequestOutput";

class RequestRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async postRequest(data: RequestOutput): Promise<any> { //todo remove any
    return await this.fetchService.postWithoutBearer(`requests`, data);
  }
}

export default RequestRepository;
