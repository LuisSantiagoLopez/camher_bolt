// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      parts: {
        Row: {
          id: string
          status: number
          reqDate: string
          unitID: string
          providerID: string | null
          partApprovalImg: string | null
          invoiceImg: string | null
          counterRecieptImg: string | null
          createdAt: string
          updatedAt: string
          failureReport: {
            problemLocation: string | null
            operator: string | null
            description: string | null
          } | null
          workOrder: {
            jobToBeDone: string | null
            personInCharge: string | null
            sparePart: string | null
            observation: string | null
          } | null
          partReq: {
            partDescription: string[] | null
            price: number | null
            unitaryPrice: number[] | null
            quantity: number[] | null
            isCash: boolean
            isImportant: boolean
          } | null
          invoiceInfo: {
            number: string | null
            date: string | null
            subTotal: number | null
          } | null
        }
        Insert: Omit<Tables['parts']['Row'], 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Tables['parts']['Row']>
      }
      units: {
        Row: {
          id: string
          name: string
          createdAt: string
        }
        Insert: Omit<Tables['units']['Row'], 'id' | 'createdAt'>
        Update: Partial<Tables['units']['Row']>
      }
      providers: {
        Row: {
          id: string
          name: string
          emails: string[]
          createdAt: string
        }
        Insert: Omit<Tables['providers']['Row'], 'id' | 'createdAt'>
        Update: Partial<Tables['providers']['Row']>
      }
      tables: {
        Row: {
          id: string
          status: number
          type: 'CURRENT' | 'HISTORY'
          from: string
          to: string
          customFile: string | null
          createdAt: string
        }
        Insert: Omit<Tables['tables']['Row'], 'id' | 'createdAt'>
        Update: Partial<Tables['tables']['Row']>
      }
    }
  }
}

// Type aliases for easier usage
export type Part = Database['public']['Tables']['parts']['Row']
export type Unit = Database['public']['Tables']['units']['Row']
export type Provider = Database['public']['Tables']['providers']['Row']
export type Table = Database['public']['Tables']['tables']['Row']

// Insert types
export type PartInsert = Database['public']['Tables']['parts']['Insert']
export type UnitInsert = Database['public']['Tables']['units']['Insert']
export type ProviderInsert = Database['public']['Tables']['providers']['Insert']
export type TableInsert = Database['public']['Tables']['tables']['Insert']

// Update types
export type PartUpdate = Database['public']['Tables']['parts']['Update']
export type UnitUpdate = Database['public']['Tables']['units']['Update']
export type ProviderUpdate = Database['public']['Tables']['providers']['Update']
export type TableUpdate = Database['public']['Tables']['tables']['Update']