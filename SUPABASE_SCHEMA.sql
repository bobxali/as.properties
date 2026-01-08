-- Supabase schema for AS.Properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  title text,
  listing_type text,
  location text,
  locations text[],
  property_types text[],
  price numeric,
  currency text,
  rooms integer,
  baths integer,
  area numeric,
  status text,
  views integer default 0,
  specs jsonb,
  media jsonb,
  custom_fields jsonb,
  created_at timestamptz default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  message text,
  property_id uuid,
  preferred_contact text,
  status text default 'New',
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  status text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists analytics (
  id uuid primary key default gen_random_uuid(),
  property_id uuid,
  page text,
  source text,
  created_at timestamptz default now()
);

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  name text,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists custom_options (
  id uuid primary key default gen_random_uuid(),
  category text,
  value text,
  created_at timestamptz default now()
);

create table if not exists custom_fields (
  id uuid primary key default gen_random_uuid(),
  label text,
  value text,
  display boolean default true,
  created_at timestamptz default now()
);
