
import { getInquiries } from '@/lib/supabase-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Inquiry } from '@/lib/definitions';
import { MessageSquare, Calendar, User, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

function formatDateTime(isoString: string) {
    return format(new Date(isoString), "PPP 'at' p");
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Inquiries</h1>
          <p className="text-muted-foreground">
            View and manage all inquiries submitted by potential buyers.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Received Inquiries</CardTitle>
            <CardDescription className="mt-1">
                A list of all messages from interested users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inquiries.length > 0 ? (
                <>
                {/* Mobile View */}
                <div className="grid gap-4 sm:hidden">
                {inquiries.map((inquiry: Inquiry) => (
                    <Card key={inquiry.id}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <FileText className="mr-3 h-5 w-5 text-primary" />
                                Plot No. {inquiry.plotNumber}
                            </CardTitle>
                             <p className="text-xs text-muted-foreground flex items-center pt-2">
                                <Calendar className="mr-2 h-3 w-3" />
                                {formatDateTime(inquiry.receivedAt)}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center">
                                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Name</p>
                                    <p className="font-medium">{inquiry.name}</p>
                                </div>
                           </div>
                           <div className="flex items-center">
                                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium">{inquiry.email}</p>
                                </div>
                           </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4">
                            <p className="text-sm text-foreground/80">{inquiry.message}</p>
                        </CardFooter>
                    </Card>
                ))}
                </div>


                {/* Desktop View */}
                <Table className="hidden sm:table">
                <TableHeader>
                    <TableRow>
                    <TableHead>Received</TableHead>
                    <TableHead>Plot No.</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Message</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inquiries.map((inquiry: Inquiry) => (
                    <TableRow key={inquiry.id}>
                        <TableCell className="w-[200px] text-muted-foreground text-xs">
                             {formatDateTime(inquiry.receivedAt)}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{inquiry.plotNumber}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{inquiry.name}</div>
                            <div className="text-muted-foreground text-xs">{inquiry.email}</div>
                        </TableCell>
                        <TableCell className="max-w-[400px] truncate">
                            {inquiry.message}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Inquiries Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">When users send messages, they will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
