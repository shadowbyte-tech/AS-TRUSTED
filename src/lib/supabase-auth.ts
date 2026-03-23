import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from './supabase'

export async function getSupabaseClient(): Promise<any> {
  const supabase = createClient<Database>({
    cookies
  })
  
  return supabase
}

export async function signUp(email: string, password: string, name: string, role: string = 'User') {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  })
  
  if (error) throw new Error(error.message)
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw new Error(error.message)
  return data
}

export async function signOut() {
  const supabase = await getSupabaseClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) throw new Error(error.message)
  return true
}

export async function getUser() {
  const supabase = await getSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  return user
}
