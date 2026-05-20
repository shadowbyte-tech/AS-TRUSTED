'use server';

/**
 * @file src/lib/actions.ts
 * Server actions — MongoDB-backed. All Supabase references removed.
 * This file re-exports the server-side actions needed by client components.
 */

import { connectDB, Property, User, Password, Inquiry } from './models';
import { changePassword } from './auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { logger } from './logger';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface State {
  message: string | null;
  errors: Record<string, string[] | undefined>;
  success: boolean;
  plotId?: string | null;
}

// ─── PROPERTY ACTIONS ─────────────────────────────────────────────────────────

export async function getProperties() {
  try {
    await connectDB();
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    return properties.map((p: any) => ({
      id: String(p._id),
      propertyNumber: p.propertyNumber,
      propertyType: p.propertyType,
      villageName: p.villageName,
      areaName: p.areaName,
      imageUrl: p.imageUrl || '',
      imageHint: p.imageHint || '',
      description: p.description || '',
      price: p.price || 0,
      priceNegotiable: p.priceNegotiable || false,
      status: p.status || 'Available',
      category: p.category || 'Normal',
      images: p.images || [],
      plotNumber: p.plotNumber,
      plotSize: p.plotSize,
      plotFacing: p.plotFacing,
      pricePerSqft: p.pricePerSqft,
      isDtcpApproved: p.isDtcpApproved,
      isReadyToConstruct: p.isReadyToConstruct,
      hasHighwayAccess: p.hasHighwayAccess,
      houseSize: p.houseSize,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      landSize: p.landSize,
      landType: p.landType,
    }));
  } catch (err) {
    logger.error('getProperties failed', err);
    return [];
  }
}

export async function createPlot(_state: State, formData: FormData): Promise<State> {
  try {
    const propertyNumber = formData.get('plotNumber') as string;
    const propertyType   = (formData.get('propertyType') as string) || 'Plot';
    const villageName    = formData.get('villageName') as string;
    const areaName       = formData.get('areaName') as string;
    const plotSize       = formData.get('plotSize') as string;
    const plotFacing     = formData.get('plotFacing') as string;
    const price          = Number(formData.get('price') || 0);
    const status         = (formData.get('status') as string) || 'Available';
    const category       = (formData.get('category') as string) || 'Normal';
    const description    = (formData.get('description') as string) || '';
    const priceNegotiable = formData.get('priceNegotiable') === 'true';

    if (!propertyNumber || !villageName || !areaName) {
      return { message: 'Property number, village, and area are required.', errors: {}, success: false };
    }

    await connectDB();

    const existing = await Property.findOne({ propertyNumber, villageName });
    if (existing) {
      return { message: 'A property with this number already exists in this village.', errors: {}, success: false };
    }

    const property = await Property.create({
      propertyNumber, propertyType, villageName, areaName, plotSize, plotFacing,
      price, status, category, description, priceNegotiable,
    });

    revalidatePath('/dashboard');
    revalidatePath('/properties');

    logger.info(`✅ Property created: ${propertyNumber}`);
    return { message: 'Property created successfully!', errors: {}, success: true, plotId: String(property._id) };
  } catch (err: any) {
    logger.error('createPlot failed', err);
    return { message: err?.message || 'Failed to create property.', errors: {}, success: false };
  }
}

export async function updatePlot(id: string, _state: State, formData: FormData): Promise<State> {
  try {
    const plotSize    = formData.get('plotSize') as string;
    const plotFacing  = formData.get('plotFacing') as string;
    const villageName = formData.get('villageName') as string;
    const areaName    = formData.get('areaName') as string;
    const price       = Number(formData.get('price') || 0);
    const status      = (formData.get('status') as string) || 'Available';
    const category    = (formData.get('category') as string) || 'Normal';
    const description = (formData.get('description') as string) || '';
    const priceNegotiable = formData.get('priceNegotiable') === 'true';

    await connectDB();

    await Property.findByIdAndUpdate(id, {
      plotSize, plotFacing, villageName, areaName,
      price, status, category, description, priceNegotiable,
    });

    revalidatePath('/dashboard');
    revalidatePath('/properties');

    logger.info(`✅ Property updated: ${id}`);
    return { message: 'Property updated successfully!', errors: {}, success: true, plotId: id };
  } catch (err: any) {
    logger.error('updatePlot failed', err);
    return { message: err?.message || 'Failed to update property.', errors: {}, success: false };
  }
}

export async function deletePlot(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    await Property.findByIdAndDelete(id);
    revalidatePath('/dashboard');
    revalidatePath('/properties');
    return { success: true, message: 'Property deleted successfully.' };
  } catch (err: any) {
    logger.error('deletePlot failed', err);
    return { success: false, message: err?.message || 'Failed to delete property.' };
  }
}

// ─── USER ACTIONS ─────────────────────────────────────────────────────────────

export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    const user = await User.findById(id).lean();
    if (!user) return { success: false, message: 'User not found.' };
    if (user.role === 'Owner') return { success: false, message: 'Cannot delete owner account.' };

    await User.findByIdAndDelete(id);
    await Password.findOneAndDelete({ email: user.email });

    revalidatePath('/admin');
    return { success: true, message: 'User deleted.' };
  } catch (err: any) {
    logger.error('deleteUser failed', err);
    return { success: false, message: err?.message || 'Failed to delete user.' };
  }
}

export async function changeUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();
    const user = await User.findById(userId).lean();
    if (!user) return { success: false, message: 'User not found.' };

    const hashed = await bcrypt.hash(newPassword, 12);
    await Password.findOneAndUpdate(
      { email: user.email },
      { hashedPassword: hashed },
      { upsert: true }
    );

    logger.info(`✅ Password changed for: ${user.email}`);
    return { success: true, message: 'Password changed successfully.' };
  } catch (err: any) {
    logger.error('changeUserPassword failed', err);
    return { success: false, message: err?.message || 'Failed to change password.' };
  }
}

// ─── INQUIRY ACTIONS ──────────────────────────────────────────────────────────

export async function saveInquiry(formData: FormData): Promise<State> {
  try {
    const plotNumber = formData.get('plotNumber') as string;
    const name       = formData.get('name') as string;
    const email      = formData.get('email') as string;
    const message    = formData.get('message') as string;

    if (!plotNumber || !name || !email || !message) {
      return { message: 'All fields are required.', errors: {}, success: false };
    }

    await connectDB();
    await Inquiry.create({ plotNumber, name, email, message });

    revalidatePath('/admin');
    return { message: 'Inquiry saved successfully.', errors: {}, success: true };
  } catch (err: any) {
    logger.error('saveInquiry failed', err);
    return { message: err?.message || 'Failed to save inquiry.', errors: {}, success: false };
  }
}
