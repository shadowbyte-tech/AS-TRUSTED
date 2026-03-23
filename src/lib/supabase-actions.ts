import { supabase, Database } from './supabase'
import type { User, Plot, Inquiry, Contact, Registration } from './definitions'

// Users
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createUser(user: Omit<Database['users']['Row'], 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Plots
export async function getPlots() {
  const { data, error } = await supabase
    .from('plots')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createPlot(plot: Omit<Database['plots']['Row'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('plots')
    .insert([plot])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Inquiries
export async function getInquiries() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createInquiry(inquiry: Omit<Database['inquiries']['Row'], 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Registrations
export async function getRegistrations() {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createRegistration(registration: Omit<Database['registrations']['Row'], 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('registrations')
    .insert([registration])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// Contacts
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createContact(contact: Omit<Database['contacts']['Row'], 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
