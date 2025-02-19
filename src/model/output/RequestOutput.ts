export class RequestOutput {
  constructor(
    public requester_email: string = '',
    public requester_first_name: string = '',
    public requester_last_name: string = '',
    public laboratory: string = '',
    public name: string = '',
    public comment: string = '',
    public plant_stage_id : number | null = null,
    public plant_name: string | null = null,
    public plant_stage_name: string | null = null,
    public due_date : string | null = null,
    public quantity: number | null = null,
    public temperature : string | null = null,
    public photoperiod : number | null = null
  ) {}
}
