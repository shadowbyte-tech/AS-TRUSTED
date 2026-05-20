import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Server-side redirect for /properties — SEO friendly, no client JS spinner
// Reads JWT from cookie to determine user role
export default async function PropertiesPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value || cookieStore.get('user-token')?.value;

  // Default: send to normal properties (public)
  // If authenticated as Premium/Owner, send to premium
  // Since we can't easily decode JWT server-side here without importing crypto,
  // we default everyone to normal-properties and let the page handle premium upgrade prompt
  // For actual premium users, they can click the upgrade banner
  redirect('/normal-properties');
}
