'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DeletePlotButton({ plotId, trigger }: { plotId: string; trigger?: 'button' | 'menuitem' }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/property/${plotId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success!',
          description: result.message || 'Property deleted successfully.',
        });
        window.location.reload();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: result.error || 'Failed to delete property.',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to delete property.',
      });
    }
  };

  const triggerElement = trigger === 'menuitem' ? (
    <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive focus:bg-destructive/10 focus:text-destructive">Delete</button>
  ) : (
    <Button variant="destructive" size="icon">
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {triggerElement}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the plot
            from the listings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
