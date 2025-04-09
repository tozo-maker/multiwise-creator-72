import React, { useState, useEffect } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeInput } from '@/components/shared/ThemeInput';
import { ThemeSelect } from '@/components/shared/ThemeSelect';
import { ThemeRadioGroup } from '@/components/shared/ThemeRadioGroup';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SaveConfigurationButton } from '@/components/configuration/SaveConfigurationButton';
import { User, Bell, Shield, Palette, Moon, Sun, Globe } from 'lucide-react';

export const Settings = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'account';

  return (
    <ModernLayout contentWidth="wide">
      <SettingsContent defaultTab={defaultTab} />
    </ModernLayout>
  );
};

const SettingsContent = ({ defaultTab = 'account' }) => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Account settings
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  
  // Appearance settings
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  // Load user data when user or profile changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setName(profile.name || '');
      
      console.log("Profile loaded:", profile); // Debug log
    }
  }, [user, profile]);
  
  const handleSaveAccount = async () => {
    setIsLoading(true);
    try {
      console.log("Saving profile with:", { username, bio, name }); // Debug log
      await updateProfile({ username, bio, name });
      toast({
        title: "Profile updated",
        description: "Your account information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const handleSaveSecurity = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated.",
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
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
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your personal information and account details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ThemeInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  description="Your email address cannot be changed."
                />
                
                <ThemeInput
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  description="Your display name shown across the application."
                />
                
                <ThemeInput
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
                
                <ThemeInput
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  description="Briefly describe yourself in a few words."
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveAccount} 
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <ThemeRadioGroup
                    name="theme"
                    orientation="horizontal"
                    value={theme}
                    onChange={setTheme}
                    options={[
                      {
                        value: 'light',
                        label: 'Light',
                        description: 'Light mode theme'
                      },
                      {
                        value: 'dark',
                        label: 'Dark',
                        description: 'Dark mode theme'
                      },
                      {
                        value: 'system',
                        label: 'System',
                        description: 'Follow system preference'
                      }
                    ]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <ThemeSelect
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ]}
                    value={fontSize}
                    onChange={setFontSize}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations throughout the interface
                    </p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveAppearance}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
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
                <Button onClick={handleSaveNotifications}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeInput
                  label="Change Password"
                  type="password"
                  placeholder="Enter new password"
                />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <ThemeSelect
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' }
                    ]}
                    value={sessionTimeout}
                    onChange={setSessionTimeout}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Settings;
