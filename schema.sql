-- Create medications table
create table medications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  dosage text,
  frequency text,
  scheduled_time time,
  caretaker_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create medication_logs table
create table medication_logs (
  id uuid default gen_random_uuid() primary key,
  medication_id uuid references medications not null,
  taken_at timestamp with time zone,
  status text check (status in ('taken', 'skipped', 'missed')),
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table medications enable row level security;
alter table medication_logs enable row level security;

-- Policies for medications
create policy "Users can view their own medications"
  on medications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own medications"
  on medications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own medications"
  on medications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own medications"
  on medications for delete
  using (auth.uid() = user_id);

-- Policies for medication_logs
-- Implicitly, logs belong to a medication which belongs to a user.
-- But for simplicity, we can just join or rely on the fact that if you can see the medication, you can see the log.
-- To make it simpler for RLS, usually we add user_id to logs too, or use a sophisticated policy.
-- Adding user_id to logs for easier RLS.

alter table medication_logs add column user_id uuid references auth.users not null;

create policy "Users can view their own logs"
  on medication_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own logs"
  on medication_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own logs"
  on medication_logs for update
  using (auth.uid() = user_id);
