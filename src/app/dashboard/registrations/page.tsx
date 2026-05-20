
import { connectDB, Lead } from '@/lib/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Registration } from '@/lib/definitions';
import { User, Mail, Phone, Calendar, StickyNote, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function formatDateTime(isoString: string) {
    return format(new Date(isoString), "PPP 'at' p");
}

export default async function RegistrationsPage() {
  await connectDB();
  const registrations = await Lead.find({}).sort({ createdAt: -1 }).lean();

  // Normalize: add isNew/createdAt fields for template compatibility
  const normalizedRegs = registrations.map((r: any) => ({
    ...r,
    id: String(r._id),
    isNew: r.isUnread ?? false,
    createdAt: r.createdAt?.toISOString?.() || new Date().toISOString(),
  }));

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">User Registrations</h1>
          <p className="text-muted-foreground">
            A list of users who have registered their interest.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Received Registrations</CardTitle>
            <CardDescription className="mt-1">
                Contact these leads to discuss potential opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {normalizedRegs.length > 0 ? (
                <>
                {/* Mobile View */}
                <div className="grid gap-4 sm:hidden">
                {normalizedRegs.map((reg: any) => (
                    <Card key={reg.id} className={cn(reg.isNew && "border-primary border-2")}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <User className="mr-3 h-5 w-5 text-primary" />
                                {reg.name}
                            </CardTitle>
                             <p className="text-xs text-muted-foreground flex items-center pt-2">
                                <Calendar className="mr-2 h-3 w-3" />
                                {formatDateTime(reg.createdAt)}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center">
                                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${reg.email}`} className="font-medium hover:underline">{reg.email}</a>
                           </div>
                           <div className="flex items-center">
                                <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                                <a href={`tel:${reg.phone}`} className="font-medium hover:underline">{reg.phone}</a>
                           </div>
                        </CardContent>
                        {reg.notes && (
                            <CardFooter className="bg-muted/50 p-4">
                                <p className="text-sm text-foreground/80 flex items-start">
                                    <StickyNote className="h-4 w-4 mr-3 mt-1 shrink-0" />
                                    <span>{reg.notes}</span>
                                </p>
                            </CardFooter>
                        )}
                    </Card>
                ))}
                </div>


                {/* Desktop View */}
                <Table className="hidden sm:table">
                <TableHeader>
                    <TableRow>
                    <TableHead>Registered On</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {normalizedRegs.map((reg: any) => (
                    <TableRow key={reg.id} className={cn(reg.isNew && "bg-primary/10 hover:bg-primary/20 data-[state=selected]:bg-primary/20")}>
                        <TableCell className="w-[200px] text-muted-foreground text-xs">
                             {formatDateTime(reg.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell>
                             <a href={`mailto:${reg.email}`} className="text-muted-foreground hover:text-primary hover:underline text-xs">{reg.email}</a>
                        </TableCell>
                        <TableCell>
                            <a href={`tel:${reg.phone}`} className="text-muted-foreground hover:text-primary hover:underline text-xs">{reg.phone}</a>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                            {reg.notes}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Registrations Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">When users register their interest, they will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
