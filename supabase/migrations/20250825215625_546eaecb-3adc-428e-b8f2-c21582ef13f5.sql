-- Enable Row Level Security (RLS) for read-only public access to catalog tables
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

-- Create SELECT policies allowing public (anon) read access
CREATE POLICY "Public read - especialidades"
ON public.especialidades
FOR SELECT
USING (true);

CREATE POLICY "Public read - pacientes"
ON public.pacientes
FOR SELECT
USING (true);

CREATE POLICY "Public read - procedimentos"
ON public.procedimentos
FOR SELECT
USING (true);

CREATE POLICY "Public read - profissionais"
ON public.profissionais
FOR SELECT
USING (true);