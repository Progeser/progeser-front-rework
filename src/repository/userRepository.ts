import FetchService from "@/service/fetchService";
import {UserModel} from "@/model/UserModel";

class UserRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getCurrentUser() : Promise<UserModel>{
    return await this.fetchService.get<UserModel>('me')
  }
}

export default UserRepository
