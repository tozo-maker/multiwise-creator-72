
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeRadioGroup } from '@/components/shared/ThemeRadioGroup';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/UnifiedAuthContext'; // Updated import

export const NotificationsTab = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  
  // Load settings from profile
  useEffect(() => {
    if (profile) {
      setEmailNotifications(profile.email_notifications !== null ? profile.email_notifications : true);
      setPushNotifications(profile.push_notifications !== null ? profile.push_notifications : true);
      setNotificationFrequency(profile.notification_frequency || 'daily');
    }
  }, [profile]);
  
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        notification_frequency: notificationFrequency
      });
      
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your notification settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you want to receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Notification Frequency</Label>
          <ThemeRadioGroup
            name="notification-frequency"
            value={notificationFrequency}
            onChange={setNotificationFrequency}
            options={[
              {
                value: 'immediate',
                label: 'Immediate',
                description: 'Receive notifications as they happen'
              },
              {
                value: 'daily',
                label: 'Daily Digest',
                description: 'Receive a daily summary'
              },
              {
                value: 'weekly',
                label: 'Weekly Digest',
                description: 'Receive a weekly summary'
              }
            ]}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveNotifications}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
