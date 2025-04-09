
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Palette } from 'lucide-react';
import { AccountTab } from '../tabs/AccountTab';
import { AppearanceTab } from '../tabs/AppearanceTab';
import { NotificationsTab } from '../tabs/NotificationsTab';
import { SecurityTab } from '../tabs/SecurityTab';

interface SettingsTabsProps {
  defaultTab?: string;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ defaultTab = 'account' }) => {
  return (
    <Tabs defaultValue={defaultTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Account</span>
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>Appearance</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Security</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <AccountTab />
      </TabsContent>

      <TabsContent value="appearance">
        <AppearanceTab />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  );
};
