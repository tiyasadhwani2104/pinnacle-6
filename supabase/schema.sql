create extension if not exists pgcrypto;

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  handle text not null,
  created_at timestamptz not null default now(),
  constraint accounts_platform_handle_unique unique (platform, handle)
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  source_platform text not null,
  content text not null,
  narrative_label text,
  created_at timestamptz not null default now()
);

create table if not exists hashtags (
  id uuid primary key default gen_random_uuid(),
  tag text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists post_hashtags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  hashtag_id uuid not null references hashtags(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint post_hashtags_unique unique (post_id, hashtag_id)
);

create table if not exists urls (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists post_urls (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  url_id uuid not null references urls(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint post_urls_unique unique (post_id, url_id)
);

create table if not exists analysis_results (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references posts(id) on delete cascade,
  groq_summary text,
  groq_risk_score numeric(5,2) check (groq_risk_score is null or (groq_risk_score >= 0 and groq_risk_score <= 100)),
  hf_label text,
  hf_score numeric(6,4) check (hf_score is null or (hf_score >= 0 and hf_score <= 1)),
  coordination_score numeric(5,2) not null default 0 check (coordination_score >= 0 and coordination_score <= 100),
  final_risk_score numeric(5,2) check (final_risk_score is null or (final_risk_score >= 0 and final_risk_score <= 100)),
  explanation text,
  created_at timestamptz not null default now()
);

create table if not exists campaign_clusters (
  id uuid primary key default gen_random_uuid(),
  cluster_name text not null unique,
  narrative_label text,
  repeated_url text,
  repeated_hashtag text,
  coordination_score numeric(5,2) not null default 0 check (coordination_score >= 0 and coordination_score <= 100),
  created_at timestamptz not null default now()
);

create table if not exists audit_chain (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload_hash text not null,
  previous_hash text,
  current_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_account_id on posts(account_id);
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_post_hashtags_post_id on post_hashtags(post_id);
create index if not exists idx_post_urls_post_id on post_urls(post_id);
create index if not exists idx_analysis_results_final_risk on analysis_results(final_risk_score desc);
create index if not exists idx_audit_chain_created_at on audit_chain(created_at desc);
