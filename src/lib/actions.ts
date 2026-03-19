
'use server';

import { z } from 'zod';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Plot, User, Inquiry, Contact, Registration, State } from './definitions';
import {
  readPlots,
  writePlots,
  readInquiries,
  writeInquiries,
  readRegistrations,
  writeRegistrations,
  readContacts,
  writeContacts,
  readUsers,
  writeUsers,
  createPlot as createPlotDB,
  updatePlot as updatePlotDB,
  deletePlot as deletePlotDB,
  createUser as createUserDB,
  deleteUser as deleteUserDB,
  createInquiry as createInquiryDB,
  createContact as createContactDB,
  updateContact as updateContactDB,
  deleteContact as deleteContactDB,
  createRegistration as createRegistrationDB,
  markRegistrationsAsRead as markRegistrationsAsReadDB
} from './mongodb-database';
import { 
  readProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getProperty
} from './property-database';
import { VALIDATION, API_MESSAGES } from './constants';
import { setPassword, getPassword } from './password-storage';
import bcrypt from 'bcryptjs';
import { logger } from './logger';

// DATA ACCESS FUNCTIONS
export const getPlots = unstable_cache(
  async () => {
    try {
      const plots = await readPlots();
      return [...plots].reverse();
    } catch (error) {
      logger.error('Error fetching plots:', error);
      return [];
    }
  },
  ['plots'],
  { revalidate: 3600, tags: ['plots'] }
);

// NEW: Get all properties (including Houses, Plots, and Land)
export const getProperties = unstable_cache(
  async () => {
    try {
      const properties = await readProperties();
      return [...properties].reverse();
    } catch (error) {
      logger.error('Error fetching properties:', error);
      return [];
    }
  },
  ['properties'],
  { revalidate: 3600, tags: ['properties'] }
);

export async function getPlotById(id: string) {
  try {
    const plots = await readPlots();
    return plots.find((plot) => plot.id === id);
  } catch (error) {
    logger.error('Error fetching plot:', error);
    return undefined;
  }
}

export async function getUsers() {
  try {
    const users = await readUsers();
    return users;
  } catch (error) {
    logger.error('Error fetching users:', error);
    return [];
  }
}

export async function getInquiries() {
  try {
    const inquiries = await readInquiries();
    return [...inquiries].reverse();
  } catch (error) {
    logger.error('Error fetching inquiries:', error);
    return [];
  }
}

export async function getContacts() {
  try {
    const contacts = await readContacts();
    return [...contacts].reverse();
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    return [];
  }
}

export async function getContactById(id: string) {
  try {
    const contacts = await readContacts();
    return contacts.find((contact) => contact.id === id);
  } catch (error) {
    logger.error('Error fetching contact:', error);
    return undefined;
  }
}

export async function getRegistrations() {
  try {
    const registrations = await readRegistrations();
    return [...registrations].reverse();
  } catch (error) {
    logger.error('Error fetching registrations:', error);
    return [];
  }
}

export async function getNewRegistrationCount() {
  try {
    const registrations = await readRegistrations();
    return registrations.filter(r => r.isNew).length;
  } catch (error) {
    logger.error('Error counting new registrations:', error);
    return 0;
  }
}


// SERVER ACTIONS

const PlotSchema = z.object({
  plotNumber: z.string({ invalid_type_error: 'Please enter a plot number.' })
    .min(1, { message: 'Plot number is required.' })
    .max(VALIDATION.PLOT_NUMBER_MAX_LENGTH, { message: `Plot number must be less than ${VALIDATION.PLOT_NUMBER_MAX_LENGTH} characters.` }),
  villageName: z.string()
    .min(1, { message: 'Village name is required.' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: `Village name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters.` }),
  areaName: z.string()
    .min(1, { message: 'Area name is required.' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: `Area name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters.` }),
  plotSize: z.string().min(1, { message: 'Plot size is required.' }),
  plotFacing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'], {
    invalid_type_error: 'Please select a plot facing direction.',
  }),
  description: z.string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH, { message: `Description must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters.` })
    .optional(),
  price: z.string().optional(),
  priceNegotiable: z.string().optional(),
  status: z.enum(['Available', 'Reserved', 'Sold', 'Under Negotiation']).optional(),
  category: z.enum(['Normal', 'Premium']).optional(),
});

const ImageSchema = z.instanceof(File, { message: API_MESSAGES.ERROR.IMAGE_REQUIRED })
  .refine((file) => file.size === 0 || file.type.startsWith("image/"), API_MESSAGES.ERROR.INVALID_IMAGE)
  .refine((file) => file.size < VALIDATION.IMAGE_MAX_SIZE, API_MESSAGES.ERROR.IMAGE_TOO_LARGE);

async function checkDuplicatePlot(plotNumber: string, villageName: string, currentId?: string) {
  const plots = await readPlots();
  const existingPlot = plots.find(p => p.plotNumber.toLowerCase() === plotNumber.toLowerCase() && p.villageName.toLowerCase() === villageName.toLowerCase());
  if (existingPlot && existingPlot.id !== currentId) {
    return true;
  }
  return false;
}

import { uploadImage } from './cloudinary';


export async function createPlot(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = PlotSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      logger.error('Validation failed for fields:', validatedFields.error.flatten().fieldErrors);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to create plot. Please check all text fields.',
        success: false,
      };
    }

    const imageFile = formData.get('imageUrl') as File;
    if (!imageFile || imageFile.size === 0) {
      console.error('Image file missing or empty');
      return {
        errors: { imageUrl: [API_MESSAGES.ERROR.IMAGE_REQUIRED] },
        message: API_MESSAGES.ERROR.IMAGE_REQUIRED,
        success: false,
      }
    }

    const validatedImage = ImageSchema.safeParse(imageFile);
    if (!validatedImage.success) {
      console.error('Image validation failed:', validatedImage.error.issues);
      const imageErrors = validatedImage.error.issues.map(issue => issue.message);
      return {
        errors: { imageUrl: imageErrors },
        message: 'Image validation failed. Please provide a valid image file.',
        success: false,
      };
    }

    const { plotNumber, villageName } = validatedFields.data;
    if (await checkDuplicatePlot(plotNumber, villageName)) {
      logger.warn('Duplicate plot detected:', { plotNumber, villageName });
      return {
        message: API_MESSAGES.ERROR.PLOT_EXISTS,
        success: false,
      }
    }

    logger.info('Fields and image validated. Uploading to Cloudinary...');
    const imageUrl = await uploadImage(validatedImage.data);

    // Process price and calculate price per sqft
    const price = validatedFields.data.price ? parseFloat(validatedFields.data.price) : undefined;
    const priceNegotiable = validatedFields.data.priceNegotiable === 'true';
    const status = validatedFields.data.status || 'Available';
    const category = validatedFields.data.category || 'Normal';

    // Calculate price per sqft if price and size are available
    let pricePerSqft: number | undefined;
    if (price && validatedFields.data.plotSize) {
      const sizeMatch = validatedFields.data.plotSize.match(/(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        pricePerSqft = Math.round(price / size);
      }
    }

    const plotData = {
      ...validatedFields.data,
      propertyType: 'Plot' as const,
      propertyNumber: validatedFields.data.plotNumber,
      imageUrl: imageUrl,
      imageHint: 'custom upload',
      price,
      pricePerSqft,
      priceNegotiable,
      status: status as any,
      category: category as any,
    };

    logger.info('Creating plot in database...');
    const newPlot = await createPlotDB(plotData);
    logger.info('Plot created successfully in DB:', newPlot.id);

    revalidatePath('/dashboard');
    revalidatePath('/plots');
    revalidateTag('plots');
    revalidateTag('properties');

    return {
      success: true,
      message: API_MESSAGES.SUCCESS.PLOT_CREATED,
      plotId: newPlot.id,
    };
  } catch (error) {
    logger.error('CRITICAL: Error creating plot:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}

export async function updatePlot(id: string, prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = PlotSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to update plot. Please check all text fields.',
        success: false,
      };
    }

    const { plotNumber, villageName } = validatedFields.data;
    if (await checkDuplicatePlot(plotNumber, villageName, id)) {
      return {
        message: 'Another plot with this number already exists in the same village.',
        success: false,
      }
    }

    const existingPlot = await getPlotById(id);
    if (!existingPlot) {
      return { message: API_MESSAGES.ERROR.PLOT_NOT_FOUND, success: false };
    }

    // Process price and calculate price per sqft
    const price = validatedFields.data.price ? parseFloat(validatedFields.data.price) : undefined;
    const priceNegotiable = validatedFields.data.priceNegotiable === 'true';
    const status = validatedFields.data.status || existingPlot.status || 'Available';
    const category = validatedFields.data.category || existingPlot.category || 'Normal';

    // Calculate price per sqft if price and size are available
    let pricePerSqft: number | undefined;
    if (price && validatedFields.data.plotSize) {
      const sizeMatch = validatedFields.data.plotSize.match(/(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        pricePerSqft = Math.round(price / size);
      }
    }

    const updateData: Partial<Plot> = {
      ...validatedFields.data,
      propertyType: 'Plot' as const,
      propertyNumber: validatedFields.data.plotNumber,
      price,
      pricePerSqft,
      priceNegotiable,
      status: status as any,
      category: category as any,
    };

    const imageFile = formData.get('imageUrl') as File;
    if (imageFile && imageFile.size > 0) {
      const validatedImage = ImageSchema.safeParse(imageFile);
      if (!validatedImage.success) {
        const imageErrors = validatedImage.error.issues.map(issue => issue.message);
        return {
          errors: { imageUrl: imageErrors },
          message: 'Image validation failed.',
          success: false,
        }
      }
      updateData.imageUrl = await uploadImage(validatedImage.data);
      updateData.imageHint = 'custom upload';
    }

    await updatePlotDB(id, updateData);

    revalidatePath('/dashboard');
    revalidatePath('/plots');
    revalidatePath(`/plots/${id}`);
    revalidatePath(`/plots/${id}/edit`);
    revalidateTag('plots');
    revalidateTag('properties');

    return {
      success: true,
      message: API_MESSAGES.SUCCESS.PLOT_UPDATED,
      plotId: id,
    };
  } catch (error) {
    logger.error('Error updating plot:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}

export async function deletePlot(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const deleted = await deleteProperty(id);

    if (!deleted) {
      return {
        success: false,
        message: API_MESSAGES.ERROR.PLOT_NOT_FOUND
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/plots');
    revalidatePath('/properties');
    revalidateTag('plots');
    revalidateTag('properties');

    return {
      success: true,
      message: API_MESSAGES.SUCCESS.PLOT_DELETED
    };
  } catch (error) {
    logger.error('Failed to delete plot:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR
    };
  }
}

// USER MANAGEMENT ACTIONS
const UserSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(VALIDATION.EMAIL_MAX_LENGTH, { message: `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters.` }),
  password: z.string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, { message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long.` })
    .max(VALIDATION.PASSWORD_MAX_LENGTH, { message: `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters.` })
});

export async function createUser(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = UserSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to create user.',
        success: false,
      };
    }

    const { email, password } = validatedFields.data;

    const users = await readUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return {
        message: API_MESSAGES.ERROR.USER_EXISTS,
        success: false,
      };
    }

    const userData = {
      email: email,
      role: 'User' as const,
    };

    // Hash and store password
    const hashedPassword = await bcrypt.hash(password, 10);
    await setPassword(email, hashedPassword);

    await createUserDB(userData);

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
  } catch (error) {
    logger.error('Error creating user:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}


export async function deleteUser(id: string) {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === id);

    if (user?.role === 'Owner') {
      logger.warn("Attempted to delete the owner account. Action prevented.");
      return;
    }

    await deleteUserDB(id);

    revalidatePath('/dashboard/users');
  } catch (error) {
    logger.error('Error deleting user:', error);
  }
}

export async function changeUserPassword(userId: string, newPassword: string) {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === userId);

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await setPassword(user.email, hashedPassword);
      return { success: true, message: API_MESSAGES.SUCCESS.PASSWORD_CHANGED };
    }

    return { success: false, message: API_MESSAGES.ERROR.USER_NOT_FOUND };
  } catch (error) {
    logger.error('Error changing password:', error);
    return { success: false, message: API_MESSAGES.ERROR.INTERNAL_ERROR };
  }
}

export async function verifyUserCredentials(email: string, password: string): Promise<{ success: boolean; message?: string; role?: User['role'] }> {
  try {
    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No user found with this email.' };
    }

    if (user.role === 'Owner') {
      return { success: false, message: 'Owners must use the Owner Sign In page.' };
    }

    // Securely verify the password against the stored hash
    const storedHash = await getPassword(email);
    if (!storedHash) {
      return { success: false, message: 'No password set for this account. Please contact the administrator.' };
    }

    const isValid = await bcrypt.compare(password, storedHash);
    if (!isValid) {
      return { success: false, message: 'Invalid email or password.' };
    }

    return { success: true, role: user.role };
  } catch (error) {
    logger.error('Error verifying credentials:', error);
    return { success: false, message: API_MESSAGES.ERROR.INTERNAL_ERROR };
  }
}

// INQUIRY ACTIONS
const InquirySchema = z.object({
  name: z.string()
    .min(1, 'Name is required.')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters.`),
  email: z.string()
    .email('A valid email is required.')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters.`),
  message: z.string()
    .min(VALIDATION.MESSAGE_MIN_LENGTH, `Message must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters.`)
    .max(VALIDATION.MESSAGE_MAX_LENGTH, `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters.`),
  plotNumber: z.string(),
});

export async function saveInquiry(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const validatedFields = InquirySchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      plotNumber: formData.get('plotNumber'),
    });

    if (!validatedFields.success) {
      logger.error('Inquiry validation failed:', validatedFields.error.flatten().fieldErrors);
      return { success: false, message: API_MESSAGES.ERROR.INVALID_INPUT };
    }

    const inquiryData = {
      receivedAt: new Date().toISOString(),
      ...validatedFields.data,
    };

    await createInquiryDB(inquiryData);

    revalidatePath('/dashboard/inquiries');

    return { success: true, message: API_MESSAGES.SUCCESS.INQUIRY_SUBMITTED };
  } catch (error) {
    logger.error('Error saving inquiry:', error);
    return { success: false, message: API_MESSAGES.ERROR.INTERNAL_ERROR };
  }
}

// CONTACT ACTIONS
const ContactSchema = z.object({
  name: z.string()
    .min(1, 'Name is required.')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters.`),
  phone: z.string()
    .min(1, 'Phone number is required.')
    .max(VALIDATION.PHONE_MAX_LENGTH, `Phone must be less than ${VALIDATION.PHONE_MAX_LENGTH} characters.`),
  email: z.string()
    .email('Please enter a valid email.')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters.`),
  type: z.enum(['Seller', 'Buyer', 'Investor', 'Agent', 'Other'], { invalid_type_error: 'Please select a contact type.' }),
  notes: z.string()
    .max(VALIDATION.NOTES_MAX_LENGTH, `Notes must be less than ${VALIDATION.NOTES_MAX_LENGTH} characters.`)
    .optional(),
});

export async function createContact(prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = ContactSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      type: formData.get('type'),
      notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to create contact.',
        success: false,
      };
    }

    const contacts = await readContacts();
    const existingContact = contacts.find(c => c.email.toLowerCase() === validatedFields.data.email.toLowerCase());
    if (existingContact) {
      return {
        message: API_MESSAGES.ERROR.CONTACT_EXISTS,
        success: false,
      }
    }

    await createContactDB(validatedFields.data);

    revalidatePath('/dashboard/contacts');
    
    return {
      success: true,
      message: 'Contact created successfully!',
      errors: {},
    };
  } catch (error) {
    logger.error('Error creating contact:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}

export async function updateContact(id: string, prevState: State, formData: FormData): Promise<State> {
  try {
    const validatedFields = ContactSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      type: formData.get('type'),
      notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to update contact.',
        success: false,
      };
    }

    const contacts = await readContacts();
    const existingContact = contacts.find(c => c.email.toLowerCase() === validatedFields.data.email.toLowerCase() && c.id !== id);
    if (existingContact) {
      return {
        message: 'Another contact with this email already exists.',
        success: false,
      }
    }

    const contact = await getContactById(id);
    if (!contact) {
      return { message: API_MESSAGES.ERROR.CONTACT_NOT_FOUND, success: false };
    }

    await updateContactDB(id, validatedFields.data);

    revalidatePath('/dashboard/contacts');
    
    return {
      success: true,
      message: 'Contact updated successfully!',
      errors: {},
    };
  } catch (error) {
    logger.error('Error updating contact:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}


export async function deleteContact(id: string) {
  try {
    await deleteContactDB(id);
    revalidatePath('/dashboard/contacts');
  } catch (error) {
    logger.error('Error deleting contact:', error);
  }
}

// REGISTRATION ACTIONS
const RegistrationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required.')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters.`),
  phone: z.string()
    .min(1, 'A valid phone number is required.')
    .max(VALIDATION.PHONE_MAX_LENGTH, `Phone must be less than ${VALIDATION.PHONE_MAX_LENGTH} characters.`),
  email: z.string()
    .email('A valid email is required.')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters.`),
  notes: z.string()
    .max(VALIDATION.NOTES_MAX_LENGTH, `Notes must be less than ${VALIDATION.NOTES_MAX_LENGTH} characters.`)
    .optional(),
});

export async function createRegistration(prevState: State, formData: FormData): Promise<State> {
  try {
    logger.info('Starting registration process...');
    
    const validatedFields = RegistrationSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
      logger.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Failed to submit registration. Please check the fields.',
        success: false,
      };
    }

    const { email, name, phone } = validatedFields.data;
    logger.info('Validated data for:', email);

    // Check for existing registration
    const currentRegistrations = await readRegistrations();
    const existingRegistration = currentRegistrations.find(r => r.email.toLowerCase() === email.toLowerCase());
    if (existingRegistration) {
      logger.info('Registration already exists for email:', email);
      return {
        success: false,
        message: API_MESSAGES.ERROR.REGISTRATION_EXISTS
      };
    }

    // Create registration data
    const registrationData = {
      createdAt: new Date().toISOString(),
      ...validatedFields.data,
      isNew: true,
    };

    logger.info('Creating registration in database...');
    const newRegistration = await createRegistrationDB(registrationData);
    logger.info('Registration created successfully:', newRegistration.id);

    // Also create user entry for login access
    const userData = {
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      role: 'User' as 'User' | 'Owner', // Default role for regular registrations
      phone: validatedFields.data.phone,
      createdAt: new Date().toISOString()
    };

    try {
      const newUser = await createUserDB(userData);
      logger.info('User created successfully for login:', newUser.id);
    } catch (userError) {
      logger.error('Failed to create user entry:', userError);
      // Don't fail registration if user creation fails
    }

    // Send WhatsApp notification to owner
    try {
      const ownerWhatsAppNumber = process.env.OWNER_WHATSAPP_NUMBER || '919866404090'; // Set OWNER_WHATSAPP_NUMBER in .env
      const message = `🏠 *New Registration Alert!*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Notes:* ${validatedFields.data.notes || 'No additional notes'}
*Date:* ${new Date().toLocaleDateString('en-IN')}

📞 Contact them immediately to provide login details and discuss investment opportunities!`;

      const whatsappUrl = `https://wa.me/${ownerWhatsAppNumber}?text=${encodeURIComponent(message)}`;
      logger.info('WhatsApp notification details handled.');
      
      // In a real application, you would use a WhatsApp API service
      // For now, we'll just log the message that would be sent
      logger.info('WhatsApp notification logged internally.');
      
    } catch (whatsappError) {
      logger.error('Failed to send WhatsApp notification:', whatsappError);
      // Don't fail the registration if WhatsApp fails
    }

    // Revalidate dashboard paths
    revalidatePath('/dashboard/registrations');
    revalidatePath('/dashboard', 'layout');

    logger.info('Registration process completed successfully');
    return {
      success: true,
      message: API_MESSAGES.SUCCESS.REGISTRATION_SUBMITTED,
      registration: newRegistration,
    };
  } catch (error) {
    console.error('Error creating registration:', error);
    return {
      success: false,
      message: API_MESSAGES.ERROR.INTERNAL_ERROR,
    };
  }
}

export async function markRegistrationsAsRead() {
  try {
    await markRegistrationsAsReadDB();
  } catch (error) {
    console.error('Error marking registrations as read:', error);
  }
}


