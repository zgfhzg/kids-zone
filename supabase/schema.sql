create table if not exists public.saved_zones (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  zone_key text not null,
  zone_data jsonb not null,
  created_at timestamptz not null default now(),
  unique (device_id, zone_key)
);

create index if not exists saved_zones_device_id_created_at_idx
  on public.saved_zones (device_id, created_at desc);
