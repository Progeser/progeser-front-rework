export class RequestOutput {
  constructor(
    public requester_email: string = '',
    public requester_first_name: string = '',
    public requester_last_name: string = '',
    public laboratory: string = '',
    public name: string = '',
    public comment: string = '',
    public plant_stage_id : string = '',
    public quantity: number = 0,
    public temperature : number = 0,
    public photoperiod : number = 0,
  ) {
  }
}
