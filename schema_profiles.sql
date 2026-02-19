-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text default 'patient',
  caretaker_email text,
  notification_preferences jsonb default '{"email": true, "missed_alerts": true, "alert_threshold": "2 hours", "daily_reminder": "20:00"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
