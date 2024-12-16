interface RequestDistribution {
  id: number;
  request_id: number;
  bench_id: number;
  positions_on_bench: number[];
  dimensions: number[];
  pot_id: number;
  pot_quantity: number;
  plant_stage_id: number,
  created_at: Date;
  updated_at: Date;
}
