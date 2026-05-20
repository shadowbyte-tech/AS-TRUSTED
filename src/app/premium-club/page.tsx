import { redirect } from 'next/navigation';

// /premium-club → redirect to /user-login (premium investor login)
// This fixes the dead link from the homepage Elite Club card
export default function PremiumClubPage() {
  redirect('/user-login');
}
