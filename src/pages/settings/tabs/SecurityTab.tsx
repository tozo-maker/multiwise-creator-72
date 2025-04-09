
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeInput } from '@/components/shared/ThemeInput';
import { ThemeSelect } from '@/components/shared/ThemeSelect';
import { useToast } from '@/hooks/use-toast';

export const SecurityTab = () => {
  const { toast } = useToast();
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  const handleSaveSecurity = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated.",
    });
  };
  
  return (
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
  );
};
