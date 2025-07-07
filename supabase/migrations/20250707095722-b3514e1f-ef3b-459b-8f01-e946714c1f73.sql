-- Enable Row Level Security on all tables
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for now, can be refined later)
CREATE POLICY "Enable read access for all users" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.recipients FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.matches FOR SELECT USING (true);

-- Create policies for insert access (for now, can be refined later)
CREATE POLICY "Enable insert for all users" ON public.donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.recipients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.matches FOR INSERT WITH CHECK (true);

-- Create policies for update access (for now, can be refined later)
CREATE POLICY "Enable update for all users" ON public.donors FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON public.recipients FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON public.matches FOR UPDATE USING (true);