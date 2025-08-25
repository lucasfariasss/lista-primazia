export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      especialidades: {
        Row: {
          COD_ESPECIALIDADE: number
          NOME_ESPECIALIDADE: string | null
        }
        Insert: {
          COD_ESPECIALIDADE: number
          NOME_ESPECIALIDADE?: string | null
        }
        Update: {
          COD_ESPECIALIDADE?: number
          NOME_ESPECIALIDADE?: string | null
        }
        Relationships: []
      }
      lista_espera_cirurgica: {
        Row: {
          ativo: boolean
          cod_especialidade: number
          cod_procedimento: number
          data_entrada: string
          data_novo_contato: string | null
          id: number
          matricula_medico: number | null
          medida_judicial: boolean
          motivo_saida: Database["public"]["Enums"]["motivo_saida_enum"] | null
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_enum"]
          prontuario: number
          situacao: Database["public"]["Enums"]["situacao_enum"]
        }
        Insert: {
          ativo?: boolean
          cod_especialidade: number
          cod_procedimento: number
          data_entrada?: string
          data_novo_contato?: string | null
          id?: number
          matricula_medico?: number | null
          medida_judicial?: boolean
          motivo_saida?: Database["public"]["Enums"]["motivo_saida_enum"] | null
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_enum"]
          prontuario: number
          situacao: Database["public"]["Enums"]["situacao_enum"]
        }
        Update: {
          ativo?: boolean
          cod_especialidade?: number
          cod_procedimento?: number
          data_entrada?: string
          data_novo_contato?: string | null
          id?: number
          matricula_medico?: number | null
          medida_judicial?: boolean
          motivo_saida?: Database["public"]["Enums"]["motivo_saida_enum"] | null
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_enum"]
          prontuario?: number
          situacao?: Database["public"]["Enums"]["situacao_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_lec_especialidade"
            columns: ["cod_especialidade"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["COD_ESPECIALIDADE"]
          },
          {
            foreignKeyName: "fk_lec_medico"
            columns: ["matricula_medico"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["MATRICULA"]
          },
          {
            foreignKeyName: "fk_lec_paciente"
            columns: ["prontuario"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["PRONTUARIO_PAC"]
          },
          {
            foreignKeyName: "fk_lec_procedimento"
            columns: ["cod_procedimento"]
            isOneToOne: false
            referencedRelation: "procedimentos"
            referencedColumns: ["COD_PROCEDIMENTO"]
          },
        ]
      }
      pacientes: {
        Row: {
          DDD_FONE_RECADO: string | null
          DDD_FONE_RESIDENCIAL: string | null
          FONE_RECADO: string | null
          FONE_RESIDENCIAL: string | null
          NOME_PACIENTE: string | null
          PRONTUARIO_PAC: number
        }
        Insert: {
          DDD_FONE_RECADO?: string | null
          DDD_FONE_RESIDENCIAL?: string | null
          FONE_RECADO?: string | null
          FONE_RESIDENCIAL?: string | null
          NOME_PACIENTE?: string | null
          PRONTUARIO_PAC: number
        }
        Update: {
          DDD_FONE_RECADO?: string | null
          DDD_FONE_RESIDENCIAL?: string | null
          FONE_RECADO?: string | null
          FONE_RESIDENCIAL?: string | null
          NOME_PACIENTE?: string | null
          PRONTUARIO_PAC?: number
        }
        Relationships: []
      }
      procedimentos: {
        Row: {
          COD_ESPECIALIDADE_FK: number | null
          COD_PROCEDIMENTO: number
          PROCEDIMENTO: string | null
        }
        Insert: {
          COD_ESPECIALIDADE_FK?: number | null
          COD_PROCEDIMENTO: number
          PROCEDIMENTO?: string | null
        }
        Update: {
          COD_ESPECIALIDADE_FK?: number | null
          COD_PROCEDIMENTO?: number
          PROCEDIMENTO?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procedimentos_COD_ESPECIALIDADE_FK_fkey"
            columns: ["COD_ESPECIALIDADE_FK"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["COD_ESPECIALIDADE"]
          },
        ]
      }
      profissionais: {
        Row: {
          MATRICULA: number
          NOME_PROFISSIONAL: string | null
          PROF_RESPONSAVEL: number | null
        }
        Insert: {
          MATRICULA: number
          NOME_PROFISSIONAL?: string | null
          PROF_RESPONSAVEL?: number | null
        }
        Update: {
          MATRICULA?: number
          NOME_PROFISSIONAL?: string | null
          PROF_RESPONSAVEL?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      motivo_saida_enum: "MORTE" | "OUTRO_LOCAL" | "AUTOEXCLUSAO"
      prioridade_enum: "ONC" | "BRE" | "SEM"
      situacao_enum:
        | "CA"
        | "AE"
        | "DP"
        | "PP"
        | "CNR"
        | "T1F"
        | "T2F"
        | "T3F"
        | "CRS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      motivo_saida_enum: ["MORTE", "OUTRO_LOCAL", "AUTOEXCLUSAO"],
      prioridade_enum: ["ONC", "BRE", "SEM"],
      situacao_enum: [
        "CA",
        "AE",
        "DP",
        "PP",
        "CNR",
        "T1F",
        "T2F",
        "T3F",
        "CRS",
      ],
    },
  },
} as const
