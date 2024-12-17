import FetchService from "@/service/fetchService";
import {PasswordUpdateOutput} from "@/model/output/PasswordUpdateOutput";

class PasswordRepository {

  private readonly fetchService: FetchService = new FetchService();

  public async resetPassword(passwordUpdate: PasswordUpdateOutput): Promise<void> {
    return await this.fetchService.put<void, PasswordUpdateOutput>('passwords', passwordUpdate);
  }
}

export default PasswordRepository;
