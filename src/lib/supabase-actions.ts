/**
 * @file src/lib/supabase-actions.ts
 * COMPATIBILITY SHIM — re-exports MongoDB implementations under the old Supabase function names.
 * All callers that previously imported from supabase-actions now transparently use MongoDB.
 * TODO: Gradually migrate callers to import directly from @/lib/models or dedicated service files.
 */
import { connectDB, User, Property, Inquiry, Lead, Contact, SiteVisit } from './models';

// ─── USERS ───────────────────────────────────────────────────────────────────
export async function getUsers() {
  await connectDB();
  return User.find({}).select('-refreshToken').sort({ createdAt: -1 }).lean();
}

export async function createUser(data: { email: string; role: string; name?: string; password?: string }) {
  await connectDB();
  const user = await User.create({ email: data.email.toLowerCase(), role: data.role, name: data.name });
  return user.toObject();
}

// ─── PLOTS (now backed by Property collection with type=Plot) ────────────────
export async function getPlots() {
  await connectDB();
  return Property.find({ propertyType: 'Plot' }).sort({ createdAt: -1 }).lean();
}

export async function createPlot(data: any) {
  await connectDB();
  const property = await Property.create({ ...data, propertyType: 'Plot' });
  return property.toObject();
}

// ─── PROPERTIES ──────────────────────────────────────────────────────────────
export async function getProperties() {
  await connectDB();
  return Property.find({}).sort({ createdAt: -1 }).lean();
}

export async function createPropertyRecord(data: any) {
  await connectDB();
  const property = await Property.create(data);
  return property.toObject();
}

// ─── INQUIRIES ───────────────────────────────────────────────────────────────
export async function getInquiries() {
  await connectDB();
  return Inquiry.find({}).sort({ createdAt: -1 }).lean();
}

export async function createInquiry(data: { plotNumber: string; name: string; email: string; message: string }) {
  await connectDB();
  const inquiry = await Inquiry.create({ ...data, email: data.email.toLowerCase() });
  return inquiry.toObject();
}

// ─── REGISTRATIONS (leads) ───────────────────────────────────────────────────
export async function getRegistrations() {
  await connectDB();
  return Lead.find({}).sort({ createdAt: -1 }).lean();
}

export async function createRegistration(data: { name: string; phone: string; email: string; notes?: string }) {
  await connectDB();
  const lead = await Lead.create({ ...data, email: data.email.toLowerCase(), isUnread: true });
  return lead.toObject();
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export async function getContacts() {
  await connectDB();
  return Contact.find({}).sort({ createdAt: -1 }).lean();
}

export async function createContact(data: { name: string; phone: string; email: string; type: string; notes?: string }) {
  await connectDB();
  const contact = await Contact.create({ ...data, email: data.email.toLowerCase() });
  return contact.toObject();
}

export async function updateContact(id: string, data: Partial<{ name: string; phone: string; email: string; type: string; notes: string }>) {
  await connectDB();
  const contact = await Contact.findByIdAndUpdate(id, data, { new: true }).lean();
  return contact;
}

export async function deleteContact(id: string) {
  await connectDB();
  await Contact.findByIdAndDelete(id);
  return true;
}
