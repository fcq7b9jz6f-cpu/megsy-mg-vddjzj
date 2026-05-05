-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text, display_name text, avatar_url text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "self read" on public.profiles for select using (auth.uid() = id);
create policy "self update" on public.profiles for update using (auth.uid() = id);

-- roles
do $$ begin create type public.app_role as enum ('admin','user'); exception when duplicate_object then null; end $$;
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  role public.app_role not null, unique(user_id, role)
);
alter table public.user_roles enable row level security;
create policy "self read roles" on public.user_roles for select using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id,email,display_name) values (new.id, new.email, split_part(new.email,'@',1));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
