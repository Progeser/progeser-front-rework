import { Container } from "@/model/Container";
import FetchService from "@/service/fetchService";
import { GenericPagination } from "@/model/GenericPagination";
import { ContainerOutput } from "@/model/output/ContainerOutput";

class ContainerRepository {
  private readonly fetchService: FetchService = new FetchService();

  public async getContainersPage(pageNumber: number, pageSize: number = 10): Promise<GenericPagination<Container[]>> {
    return await this.fetchService.getWithPagination<Container[]>(`pots?page[number]=${pageNumber}&page[size]=${pageSize}`);
  }

  public async getContainer(id: number): Promise<Container> {
    return await this.fetchService.get<Container>(`pots/${id}`);
  }

  public async putContainer(id: number, data: Container): Promise<Container> {
    return await this.fetchService.put(`pots/${id}`, this.makeContainerOutput(data));
  }

  public async postContainer(data: Container): Promise<Container> {
    return await this.fetchService.post(`pots`, this.makeContainerOutput(data));
  }

  public async deleteContainer(id: number): Promise<void> {
    return await this.fetchService.delete(`pots/${id}`);
  }

  private makeContainerOutput(data: Container): ContainerOutput {
    const containerOutput: ContainerOutput = new ContainerOutput();

    containerOutput.name = data.name;
    containerOutput.area = data.area ? data.area.toString() : undefined;
    containerOutput.dimensions = data.dimensions || undefined;
    containerOutput.shape = data.shape.name;

    return containerOutput;
  }

}

export default ContainerRepository;
