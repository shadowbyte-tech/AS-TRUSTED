import { redirect } from 'next/navigation';

// /create-user was an empty route causing a blank page.
// Redirects to the dashboard users page where users can be created.
export default function CreateUserPage() {
  redirect('/dashboard/users');
}
