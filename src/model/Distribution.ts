interface Distribution {
  id: number;
  request_distribution_id: number;
  bench_id: number;
  positions_on_bench: number[];
  dimensions: number[];
  seed_quantity: number;
  created_at: Date;
  updated_at: Date;
}
