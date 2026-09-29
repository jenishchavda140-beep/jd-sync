create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique not null,
  full_name varchar(255),
  created_at timestamp with time zone default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  name varchar(255) not null,
  email varchar(255) not null,
  company varchar(255),
  created_at timestamp with time zone default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  amount decimal(10,2) not null,
  status varchar(50) default 'Draft',
  due_date date not null,
  stripe_payment_link varchar(500),
  created_at timestamp with time zone default now()
);

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;

create policy "Users can view their own user record"
on public.users
for select
using (auth.uid() = id);

create policy "Users can insert their own user record"
on public.users
for insert
with check (auth.uid() = id);

create policy "Users can update their own user record"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can view their own clients"
on public.clients
for select
using (auth.uid() = user_id);

create policy "Users can create their own clients"
on public.clients
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own clients"
on public.clients
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own clients"
on public.clients
for delete
using (auth.uid() = user_id);

create policy "Users can view their own invoices"
on public.invoices
for select
using (auth.uid() = user_id);

create policy "Users can create their own invoices"
on public.invoices
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own invoices"
on public.invoices
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own invoices"
on public.invoices
for delete
using (auth.uid() = user_id);
