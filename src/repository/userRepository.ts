import FetchService from "@/service/fetchService";
import {UserModel} from "@/model/UserModel";
import {UserOutput} from "@/model/output/UserOutput";
import {GenericPagination} from "@/model/GenericPagination";
import {MeOutput} from "@/model/output/MeOutput";

class UserRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getCurrentUser() : Promise<UserModel>{
    return await this.fetchService.get<UserModel>('me')
  }

  public async updateUser(me: MeOutput) : Promise<UserModel>{
    return await this.fetchService.put<UserModel, MeOutput>('me', me)
  }

  public async destroyCurrentUser() : Promise<void>{
    return await this.fetchService.delete('me')
  }

  public async createUser(user: UserOutput) : Promise<UserModel>{
    return await this.fetchService.post<UserModel, UserOutput>('users', user)
  }

  public async deleteUser(id: number): Promise<void> {
    return await this.fetchService.delete(`users/${id}`)
  }

  public async getUser(id: number): Promise<UserModel> {
    return await this.fetchService.get(`users/${id}`)
  }

  public async getUsers(pageNumber: number, pageSize: number = 10): Promise<GenericPagination<UserModel[]>>{
    return await this.fetchService.getWithPagination<UserModel[]>(`users?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

}

export default UserRepository
