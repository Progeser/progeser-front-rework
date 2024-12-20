export interface RequestModel {
  id: number;
  comment: string | null;
  due_date: string;
  handler_id: number | null;
  laboratory: string;
  name: string;
  photoperiod: number | null;
  plant_id: number | null;
  plant_name: string | null;
  plant_stage_id: number;
  plant_stage_name: string | null;
  quantity: number;
  requester_email: string;
  requester_first_name: string;
  requester_last_name: string;
  status: string;
  temperature: string | null;
  updated_at: string;
}
