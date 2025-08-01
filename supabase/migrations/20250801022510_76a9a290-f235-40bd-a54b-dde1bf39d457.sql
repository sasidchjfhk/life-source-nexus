-- Enable RLS on tables that don't have it yet
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for donors table
CREATE POLICY "Enable read access for all users on donors" 
ON public.donors 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users on donors" 
ON public.donors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users on donors" 
ON public.donors 
FOR UPDATE 
USING (true);

-- Create policies for recipients table
CREATE POLICY "Enable read access for all users on recipients" 
ON public.recipients 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users on recipients" 
ON public.recipients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users on recipients" 
ON public.recipients 
FOR UPDATE 
USING (true);

-- Create policies for matches table
CREATE POLICY "Enable read access for all users on matches" 
ON public.matches 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users on matches" 
ON public.matches 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users on matches" 
ON public.matches 
FOR UPDATE 
USING (true);

-- Fix the search path for the existing function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;