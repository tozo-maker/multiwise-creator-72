
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeInput } from '@/components/shared/ThemeInput';
import { ThemeSelect } from '@/components/shared/ThemeSelect';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const SecurityTab = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Load settings from profile
  useEffect(() => {
    if (profile) {
      setTwoFactorEnabled(profile.two_factor_enabled !== null ? profile.two_factor_enabled : false);
      setSessionTimeout(profile.session_timeout || '30');
    }
  }, [profile]);
  
  const handlePasswordChange = async () => {
    if (!newPassword) {
      setPasswordError('Password is required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating password",
        description: error.message || "There was a problem updating your password.",
      });
      
      setPasswordError(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        two_factor_enabled: twoFactorEnabled,
        session_timeout: sessionTimeout
      });
      
      toast({
        title: "Security settings saved",
        description: "Your security settings have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your security settings.",
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="space-y-2">
          <Label htmlFor="new-password">Change Password</Label>
          <ThemeInput
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={passwordError}
          />
          <ThemeInput
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            size="sm"
            className="mt-2"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
        
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
        <Button 
          onClick={handleSaveSecurity}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
