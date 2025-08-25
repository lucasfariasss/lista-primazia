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
      [_ in never]: never
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
    Enums: {},
  },
} as const
