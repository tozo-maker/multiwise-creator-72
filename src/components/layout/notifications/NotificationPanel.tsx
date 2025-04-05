
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const NotificationPanel = () => {
  const { toast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Content generation complete',
      description: 'Your Spanish vocabulary list has been generated.',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'New feature available',
      description: 'Try our improved knowledge base organization tools.',
      time: '2 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'Project shared with you',
      description: 'Maria shared "French Curriculum" with you.',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Stay updated with project changes and announcements
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length > 0 ? (
            <>
              <div className="flex justify-between items-center py-2 px-1">
                <span className="text-sm font-medium text-slate-700">
                  {unreadCount} unread notification{unreadCount !== 1 && 's'}
                </span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="space-y-2 mt-2">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-md transition-colors ${notification.read ? 'bg-white' : 'bg-brand-50'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {notification.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No notifications</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
