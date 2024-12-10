export class Request {
  constructor(
    public id: number,
    public comment: string | null,
    public due_date: string,
    public handler_id: number | null,
    public laboratory: string,
    public name: string,
    public photoperiod: number | null,
    public plant_id: number | null,
    public plant_name: string | null,
    public plant_stage_id: number | null,
    public plant_stage_name: string | null,
    public quantity: number,
    public requester_email: string,
    public requester_first_name: string,
    public requester_last_name: string,
    public status: string,
    public temperature: number | null,
    public updated_at: string
  ) {}
}
