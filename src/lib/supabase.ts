import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  users: {
    Row: {
      id: string
      email: string
      role: string
      name: string
      phone?: string
      location?: string
      created_at: string
    }
  }
  plots: {
    Row: {
      id: string
      plotNumber: string
      title: string
      description: string
      price: number
      area: string
      location: string
      facing: string
      type: string
      status: string
      images: string[]
      documents: string[]
      created_at: string
      updated_at: string
    }
  }
  inquiries: {
    Row: {
      id: string
      name: string
      email: string
      phone: string
      message: string
      created_at: string
    }
  }
  registrations: {
    Row: {
      id: string
      name: string
      email: string
      phone: string
      plotNumber: string
      investmentAmount: number
      message: string
      status: string
      created_at: string
    }
  }
  contacts: {
    Row: {
      id: string
      name: string
      email: string
      phone: string
      message: string
      created_at: string
    }
  }
}
