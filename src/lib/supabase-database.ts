import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { logger } from './logger';
import type { 
  Property as PropertyType, 
  User as UserType, 
  Registration as RegistrationType, 
  Inquiry as InquiryType, 
  Contact as ContactType 
} from './definitions';

/**
 * Get a Supabase client for server-side operations
 */
async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

// ─── HELPER: MAP SUPABASE TO APP TYPES ─────────────────────────────

function mapUser(dbUser: any): UserType {
  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    name: dbUser.name || '',
    phone: dbUser.phone || '',
    location: dbUser.location || '',
    createdAt: dbUser.created_at,
    lastLogin: dbUser.last_login_at,
  };
}

function mapProperty(dbProp: any): PropertyType {
  const base = {
    id: dbProp.id,
    propertyNumber: dbProp.property_number,
    propertyType: dbProp.property_type as any,
    villageName: dbProp.village_name,
    areaName: dbProp.area_name,
    imageUrl: dbProp.image_url || '',
    imageHint: dbProp.image_hint || '',
    description: dbProp.description || '',
    price: dbProp.price || 0,
    priceNegotiable: dbProp.price_negotiable || false,
    status: dbProp.status || 'Available',
    category: dbProp.category || 'Normal',
    images: dbProp.images || [],
    createdAt: dbProp.created_at,
    updatedAt: dbProp.updated_at,
  };

  if (dbProp.property_type === 'Plot') {
    return {
      ...base,
      propertyType: 'Plot',
      plotNumber: dbProp.property_number,
      plotSize: dbProp.plot_size || '',
      plotFacing: dbProp.plot_facing || 'North',
      pricePerSqft: Number(dbProp.price_per_sqft) || 0,
    } as any;
  } else if (dbProp.property_type === 'House') {
    return {
      ...base,
      propertyType: 'House',
      houseSize: dbProp.house_size || '',
      bedrooms: dbProp.bedrooms || 0,
      bathrooms: dbProp.bathrooms || 0,
      floors: dbProp.floors || 1,
      houseType: dbProp.house_type || 'Independent',
      furnished: dbProp.furnished || false,
      parking: dbProp.parking || false,
      amenities: dbProp.amenities || [],
      yearBuilt: dbProp.year_built,
    } as any;
  } else {
    return {
      ...base,
      propertyType: 'Land',
      landSize: dbProp.land_size || '',
      landType: dbProp.land_type || 'Residential',
      zoning: dbProp.zoning || '',
      roadAccess: dbProp.road_access || false,
      waterConnection: dbProp.water_connection || false,
      electricityConnection: dbProp.electricity_connection || false,
      soilType: dbProp.soil_type,
      topography: dbProp.topography,
    } as any;
  }
}

// ─── USER OPERATIONS ──────────────────────────────────────────────

export async function readUsers(): Promise<UserType[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return (data || []).map(mapUser);
  } catch (error) {
    logger.error('Supabase: readUsers failed:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<UserType | null> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? mapUser(data) : null;
  } catch (error) {
    logger.error(`Supabase: getUserByEmail failed for ${email}:`, error);
    return null;
  }
}

export async function saveUser(userData: Partial<UserType>): Promise<UserType> {
  try {
    const supabase = await getSupabase();
    const id = userData.id || `user_${Date.now()}`;
    const dbUser = {
      id,
      email: userData.email?.toLowerCase(),
      role: userData.role,
      name: userData.name,
      phone: userData.phone,
      location: userData.location,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('users').upsert(dbUser).select().single();
    if (error) throw error;
    return mapUser(data);
  } catch (error) {
    logger.error('Supabase: saveUser failed:', error);
    throw error;
  }
}

// ─── PROPERTY OPERATIONS ──────────────────────────────────────────

export async function readProperties(): Promise<PropertyType[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProperty);
  } catch (error) {
    logger.error('Supabase: readProperties failed:', error);
    return [];
  }
}

export async function getProperty(id: string): Promise<PropertyType | null> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? mapProperty(data) : null;
  } catch (error) {
    logger.error(`Supabase: getProperty failed for ${id}:`, error);
    return null;
  }
}

export async function createProperty(prop: any): Promise<PropertyType> {
  try {
    const supabase = await getSupabase();
    const id = prop.id || `prop_${Date.now()}`;
    
    // Map camcelCase to snake_case for DB
    const dbProp = {
      id,
      property_number: prop.propertyNumber,
      property_type: prop.propertyType,
      village_name: prop.villageName,
      area_name: prop.areaName,
      image_url: prop.imageUrl,
      image_hint: prop.imageHint,
      description: prop.description,
      price: prop.price,
      price_negotiable: prop.priceNegotiable,
      status: prop.status,
      category: prop.category,
      images: prop.images,
      
      plot_number: prop.plotNumber,
      plot_size: prop.plotSize,
      plot_facing: prop.plotFacing,
      price_per_sqft: prop.pricePerSqft,
      
      house_size: prop.houseSize,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      floors: prop.floors,
      house_type: prop.houseType,
      furnished: prop.furnished,
      parking: prop.parking,
      amenities: prop.amenities,
      year_built: prop.yearBuilt,
      
      land_size: prop.landSize,
      land_type: prop.landType,
      zoning: prop.zoning,
      road_access: prop.roadAccess,
      water_connection: prop.waterConnection,
      electricity_connection: prop.electricityConnection,
      soil_type: prop.soilType,
      topography: prop.topography,
    };

    const { data, error } = await supabase.from('properties').insert(dbProp).select().single();
    if (error) throw error;
    return mapProperty(data);
  } catch (error) {
    logger.error('Supabase: createProperty failed:', error);
    throw error;
  }
}

export async function updateProperty(id: string, update: any): Promise<PropertyType | null> {
  try {
    const supabase = await getSupabase();
    
    // Map common fields
    const dbUpdate: any = {};
    if (update.status) dbUpdate.status = update.status;
    if (update.price) dbUpdate.price = update.price;
    if (update.description) dbUpdate.description = update.description;
    if (update.imageUrl) dbUpdate.image_url = update.imageUrl;
    // ... add more as needed
    
    const { data, error } = await supabase.from('properties').update(dbUpdate).eq('id', id).select().single();
    if (error) throw error;
    return mapProperty(data);
  } catch (error) {
    logger.error(`Supabase: updateProperty failed for ${id}:`, error);
    return null;
  }
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Supabase: deleteProperty failed for ${id}:`, error);
    return false;
  }
}

// ─── AUTH / PASSWORD OPERATIONS ─────────────────────────────────────

export async function getStoredPassword(email: string): Promise<string | null> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('passwords')
      .select('hashed_password')
      .eq('email', email.toLowerCase())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.hashed_password || null;
  } catch (error) {
    logger.error(`Supabase: getStoredPassword failed for ${email}:`, error);
    return null;
  }
}

export async function setStoredPassword(email: string, hashedPassword: string): Promise<void> {
  try {
    const supabase = await getSupabase();
    // Use upsert with onConflict: 'email' so it updates the existing record regardless of ID
    const { error } = await supabase.from('passwords').upsert({
      email: email.toLowerCase(),
      hashed_password: hashedPassword,
      updated_at: new Date().toISOString()
    }, { onConflict: 'email' });
    if (error) throw error;
  } catch (error) {
    logger.error(`Supabase: setStoredPassword failed for ${email}:`, error);
    throw error;
  }
}

// ─── LEAD / INQUIRY / CONTACT OPERATIONS ───────────────────────────

export async function saveLead(
  lead: Omit<RegistrationType, 'id'> & { id?: string }
): Promise<RegistrationType> {
  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('leads')
      .insert({
        id: lead.id ?? `lead_${Date.now()}`,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        notes: lead.notes ?? '',
        is_unread: lead.isNew ?? true,
        created_at: lead.createdAt ?? new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supabase: saveLead returned empty data');

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      notes: data.notes ?? undefined,
      isNew: data.is_unread,
      createdAt: data.created_at,
    };
  } catch (error) {
    logger.error('Supabase: saveLead failed:', error);
    throw error;
  }
}

export async function readRegistrations(): Promise<RegistrationType[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(l => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email,
      notes: l.notes || '',
      isNew: l.is_unread,
      createdAt: l.created_at
    }));
  } catch (error) {
    logger.error('Supabase: readRegistrations failed:', error);
    return [];
  }
}

export async function markRegistrationsAsRead(): Promise<void> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('leads')
      .update({ is_unread: false })
      .eq('is_unread', true);

    if (error) throw error;
  } catch (error) {
    logger.error('Supabase: markRegistrationsAsRead failed:', error);
    throw error;
  }
}

export async function saveInquiry(
  inq: Omit<InquiryType, 'id'> & { id?: string }
): Promise<InquiryType> {
  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        id: inq.id ?? `inq_${Date.now()}`,
        plot_number: inq.plotNumber,
        name: inq.name,
        email: inq.email,
        message: inq.message,
        received_at: inq.receivedAt ?? new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supabase: saveInquiry returned empty data');

    return {
      id: data.id,
      plotNumber: data.plot_number,
      name: data.name,
      email: data.email,
      message: data.message,
      receivedAt: data.received_at,
    };
  } catch (error) {
    logger.error('Supabase: saveInquiry failed:', error);
    throw error;
  }
}

export async function readInquiries(): Promise<InquiryType[]> {
  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.from('inquiries').select('*').order('received_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(i => ({
      id: i.id,
      plotNumber: i.plot_number,
      name: i.name,
      email: i.email,
      message: i.message,
      receivedAt: i.received_at
    }));
  } catch (error) {
    logger.error('Supabase: readInquiries failed:', error);
    return [];
  }
}

// ─── AUDIT OPERATIONS ─────────────────────────────────────────────

export async function saveAuditLog(log: any): Promise<void> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from('audit_logs').insert({
      id: log.id || `audit_${Date.now()}`,
      action: log.action,
      category: log.category,
      user_id: log.userId,
      user_email: log.userEmail,
      ip: log.ip,
      user_agent: log.userAgent,
      resource_id: log.resourceId,
      details: log.details,
      status: log.status,
      created_at: new Date().toISOString()
    });
    if (error) throw error;
  } catch (error) {
    logger.error('Supabase: saveAuditLog failed:', error);
  }
}
