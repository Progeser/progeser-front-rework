import {Species} from "@/model/Species";
import {SpeciesOutput} from "@/model/output/SpeciesOutput";
import FetchService from "@/service/fetchService";
import {GenericPagination} from "@/model/GenericPagination";
import {SpeciesStageAttributes} from "@/model/output/SpeciesStageAttributes";

class SpeciesRepository {

  private readonly fetchService : FetchService = new FetchService();

  public async getSpeciesPage(pageNumber : number, pageSize : number = 10) : Promise<GenericPagination<Species[]>>{
    return await this.fetchService.getWithPagination<Species[]>(`plants?page[number]=${pageNumber}&page[size]=${pageSize}`)
  }

  public async getAllSpecies() : Promise<GenericPagination<Species[]>>{
    return await this.fetchService.getWithPagination<Species[]>(`plants`)
  }

  public async getSpecies(id: number) : Promise<Species> {
    return await this.fetchService.get<Species>(`plants/${id}`)
  }

  public async putSpecies(id: number,data: Species) : Promise<Species> {
    return await this.fetchService.put(`plants/${id}`, this.makeSpeciesOutput(data))
  }

  public async postSpecies(data: Species) : Promise<Species> {
    return await this.fetchService.post(`plants`, this.makeSpeciesOutput(data))
  }

  public async deleteSpecies(id: number): Promise<void> {
    return await this.fetchService.delete(`plants/${id}`)
  }

  private makeSpeciesOutput(data: Species) : SpeciesOutput {
    const speciesOutput: SpeciesOutput = new SpeciesOutput()
    speciesOutput.name = data.name;
    data.plant_stages.forEach((stage) => {
      if(stage.id === null){
        const speciesStage : SpeciesStageAttributes = new SpeciesStageAttributes()
        speciesStage.name = stage.name;
        speciesStage.duration = stage.duration
        speciesStage.position = stage.position
        speciesOutput.plant_stages_attributes.push(speciesStage)
      }
    })
    return speciesOutput
  }


}

export default SpeciesRepository
