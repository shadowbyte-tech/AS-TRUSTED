'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarCheck, Phone, MessageCircle, MapPin, Clock, User, Mail, Loader2 } from 'lucide-react';

type SiteVisit = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  message?: string;
  status: string;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  Pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/site-visits');
      const data = await res.json();
      setVisits(data.success ? data.data : []);
    } catch (err) {
      console.error('Failed to load site visits', err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/site-visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVisits(v => v.map(x => x._id === id ? { ...x, status } : x));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const whatsappLink = (phone: string, name: string) =>
    `https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${name}, your site visit request has been received. We will confirm the details shortly. — AS Trusted Consultancy`)}`;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-primary" />
          Site Visit Bookings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and confirm site visit requests from potential investors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
          <Card key={status} className="border-0 shadow-md bg-gradient-to-br from-slate-800 to-slate-900/50">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${STATUS_COLORS[status].split(' ')[1]}`}>
                {visits.filter(v => v.status === status).length}
              </div>
              <p className="text-xs text-slate-400 mt-1">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900/50">
        <CardHeader>
          <CardTitle>All Bookings ({visits.length})</CardTitle>
          <CardDescription>Click status dropdown to update. WhatsApp button to contact client.</CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-700 rounded-lg">
              <CalendarCheck className="mx-auto h-12 w-12 text-slate-500 mb-3" />
              <p className="text-slate-400">No site visit bookings yet.</p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="grid gap-4 sm:hidden">
                {visits.map(visit => (
                  <Card key={visit._id} className="border border-slate-700 bg-slate-800/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" /> {visit.name}
                        </div>
                        <Badge className={`text-xs border ${STATUS_COLORS[visit.status] || ''}`}>{visit.status}</Badge>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {visit.phone}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {visit.location}</div>
                        <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {visit.preferredDate} · {visit.preferredTime}</div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Select value={visit.status} onValueChange={(s) => updateStatus(visit._id, s)}>
                          <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-xs" asChild>
                          <a href={whatsappLink(visit.phone, visit.name)} target="_blank" rel="noreferrer">
                            <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop table */}
              <Table className="hidden sm:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map(visit => (
                    <TableRow key={visit._id}>
                      <TableCell>
                        <div className="font-medium text-slate-200">{visit.name}</div>
                        {visit.email && <div className="text-xs text-slate-400">{visit.email}</div>}
                      </TableCell>
                      <TableCell className="text-slate-300">{visit.phone}</TableCell>
                      <TableCell className="hidden md:table-cell text-slate-300">{visit.location}</TableCell>
                      <TableCell className="hidden lg:table-cell text-slate-400 text-sm">
                        {visit.preferredDate}<br />{visit.preferredTime}
                      </TableCell>
                      <TableCell>
                        <Select value={visit.status} onValueChange={(s) => updateStatus(visit._id, s)} disabled={updatingId === visit._id}>
                          <SelectTrigger className="w-36 h-8 text-xs">
                            {updatingId === visit._id
                              ? <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>
                              : <SelectValue />}
                          </SelectTrigger>
                          <SelectContent>
                            {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs" asChild>
                          <a href={whatsappLink(visit.phone, visit.name)} target="_blank" rel="noreferrer">
                            <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
