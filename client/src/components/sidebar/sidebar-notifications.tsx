import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInput, useSidebar } from '@/components/ui/sidebar';

const DELAY = 300;

export function SidebarNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useSidebar();

  // Set a delay when the sidebar opens to show the notifications
  useEffect(() => {
    if (!open) {
      setIsOpen(false);
      return;
    }
    const timeout = setTimeout(() => setIsOpen(true), DELAY);
    return () => clearTimeout(timeout);
  }, [open]);

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="gap-2 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Subscribe to our newsletter</CardTitle>
        <CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <form>
          <div className="grid gap-2.5">
            <SidebarInput placeholder="Email" type="email" />
            <Button
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
              size="sm"
            >
              Subscribe
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
