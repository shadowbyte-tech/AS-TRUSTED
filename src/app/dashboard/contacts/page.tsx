
import { connectDB, Contact as ContactModel } from '@/lib/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DeleteContactButton from '@/components/delete-contact-button';
import { Contact } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, MoreVertical, Pencil, Mail, Phone, User, ShoppingCart, Landmark, TrendingUp, UserCheck, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function ManageContactsPage() {
  await connectDB();
  const rawContacts = await ContactModel.find({}).sort({ createdAt: -1 }).lean();
  const contacts = rawContacts.map((c: any) => ({ ...c, id: String(c._id) }));

  const RoleIcon = ({ role }: { role: 'Seller' | 'Buyer' | 'Investor' | 'Agent' | 'Other' }) => {
    switch (role) {
      case 'Seller':
        return <Landmark className="mr-3 h-5 w-5 text-primary" />;
      case 'Investor':
        return <TrendingUp className="mr-3 h-5 w-5 text-primary" />;
      case 'Agent':
        return <UserCheck className="mr-3 h-5 w-5 text-primary" />;
      case 'Other':
        return <MoreHorizontal className="mr-3 h-5 w-5 text-primary" />;
      default:
        return <ShoppingCart className="mr-3 h-5 w-5 text-primary" />;
    }
  }

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Contacts</h1>
          <p className="text-muted-foreground">
            Keep track of your sellers and potential buyers.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Contacts</CardTitle>
              <CardDescription className="mt-1">
                  A list of all your business contacts.
              </CardDescription>
            </div>
            <Button asChild>
                <Link href="/dashboard/contacts/add">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {contacts.length > 0 ? (
                <>
                {/* Mobile View */}
                <div className="grid gap-4 sm:hidden">
                {contacts.map((contact: Contact) => (
                    <Card key={contact.id}>
                        <CardHeader className="flex flex-row items-start gap-4 p-4">
                            <RoleIcon role={contact.type} />
                            <div className="flex-1">
                                <CardTitle>{contact.name}</CardTitle>
                                <Badge variant={contact.type === 'Seller' ? 'secondary' : 'outline'} className="mt-1">
                                  {contact.type}
                                </Badge>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/contacts/${contact.id}/edit`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                         <div className="w-full">
                                            <DeleteContactButton contactId={contact.id} trigger="menuitem" />
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                             <div className="flex items-center text-sm">
                                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>{contact.email}</span>
                            </div>
                             <div className="flex items-center text-sm">
                                <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>{contact.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                </div>


                {/* Desktop View */}
                <Table className="hidden sm:table">
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts.map((contact: Contact) => (
                    <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>
                            <Badge variant={contact.type === 'Seller' ? 'secondary' : 'outline'}>{contact.type}</Badge>
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button asChild variant="outline" size="icon">
                                <Link href={`/dashboard/contacts/${contact.id}/edit`}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </Button>
                           <DeleteContactButton contactId={contact.id} />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Contacts Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first contact.</p>
                    <Button asChild className="mt-6">
                        <Link href="/dashboard/contacts/add">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Contact
                        </Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
