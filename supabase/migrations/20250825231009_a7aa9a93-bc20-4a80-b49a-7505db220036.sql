-- 1) Enums (prioridade, situação e motivo de saída)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridade_enum') THEN
    CREATE TYPE prioridade_enum AS ENUM ('ONC','BRE','SEM'); -- Oncológico, Com Brevidade, Sem Brevidade
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'situacao_enum') THEN
    CREATE TYPE situacao_enum AS ENUM ('CA','AE','DP','PP','CNR','T1F','T2F','T3F','CRS');
    -- CA=CONSULTA AGENDADA, AE=EXAMES PENDENTES, DP=DOC PENDENTE, PP=PRONTO P/ CIRURGIA,
    -- CNR=CONTATO NÃO REALIZADO, T1F/T2F/T3F=TENTATIVA N FALHOU, CRS=CONTATO REALIZADO COM SUCESSO
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'motivo_saida_enum') THEN
    CREATE TYPE motivo_saida_enum AS ENUM ('MORTE','OUTRO_LOCAL','AUTOEXCLUSAO');
  END IF;
END $$;

-- 2) Tabela principal da LEC
CREATE TABLE IF NOT EXISTS public.lista_espera_cirurgica (
  id                   BIGSERIAL PRIMARY KEY,
  prontuario           BIGINT       NOT NULL,           -- FK -> pacientes.PRONTUARIO_PAC
  cod_procedimento     BIGINT       NOT NULL,           -- FK -> procedimentos.COD_PROCEDIMENTO
  cod_especialidade    BIGINT       NOT NULL,           -- FK -> especialidades.COD_ESPECIALIDADE
  matricula_medico     BIGINT           NULL,           -- FK -> profissionais.MATRICULA (opcional)
  data_entrada         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  prioridade           prioridade_enum NOT NULL DEFAULT 'SEM',
  medida_judicial      BOOLEAN      NOT NULL DEFAULT FALSE,
  situacao             situacao_enum NOT NULL,
  observacoes          TEXT              NULL,
  data_novo_contato    DATE              NULL,
  ativo                BOOLEAN      NOT NULL DEFAULT TRUE,
  motivo_saida         motivo_saida_enum NULL,

  -- Consistência: se 'ativo' = true -> motivo_saida deve ser NULL;
  -- se 'ativo' = false -> motivo_saida deve estar preenchido.
  CONSTRAINT chk_ativo_motivo
    CHECK ( (ativo = TRUE  AND motivo_saida IS NULL)
         OR (ativo = FALSE AND motivo_saida IS NOT NULL) )
);

-- 3) Chaves estrangeiras
ALTER TABLE public.lista_espera_cirurgica
  ADD CONSTRAINT fk_lec_paciente
    FOREIGN KEY (prontuario)
    REFERENCES public.pacientes(PRONTUARIO_PAC)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.lista_espera_cirurgica
  ADD CONSTRAINT fk_lec_procedimento
    FOREIGN KEY (cod_procedimento)
    REFERENCES public.procedimentos(COD_PROCEDIMENTO)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.lista_espera_cirurgica
  ADD CONSTRAINT fk_lec_especialidade
    FOREIGN KEY (cod_especialidade)
    REFERENCES public.especialidades(COD_ESPECIALIDADE)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.lista_espera_cirurgica
  ADD CONSTRAINT fk_lec_medico
    FOREIGN KEY (matricula_medico)
    REFERENCES public.profissionais(MATRICULA)
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- 4) Índices práticos para filtros frequentes
CREATE INDEX IF NOT EXISTS idx_lec_prontuario        ON public.lista_espera_cirurgica (prontuario);
CREATE INDEX IF NOT EXISTS idx_lec_especialidade     ON public.lista_espera_cirurgica (cod_especialidade);
CREATE INDEX IF NOT EXISTS idx_lec_procedimento      ON public.lista_espera_cirurgica (cod_procedimento);
CREATE INDEX IF NOT EXISTS idx_lec_medico            ON public.lista_espera_cirurgica (matricula_medico);
CREATE INDEX IF NOT EXISTS idx_lec_flags             ON public.lista_espera_cirurgica (ativo, medida_judicial, prioridade, situacao);

-- 5) RLS (Row Level Security) básico
ALTER TABLE public.lista_espera_cirurgica ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuários autenticados
CREATE POLICY "lec_read_authenticated"
  ON public.lista_espera_cirurgica
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "lec_insert_authenticated"
  ON public.lista_espera_cirurgica
  FOR INSERT TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "lec_update_authenticated"
  ON public.lista_espera_cirurgica
  FOR UPDATE TO authenticated
  USING (TRUE) WITH CHECK (TRUE);