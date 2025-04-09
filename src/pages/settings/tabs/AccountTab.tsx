
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeInput } from '@/components/shared/ThemeInput';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const AccountTab = () => {
  const { toast } = useToast();
  const { user, profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Account settings
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  
  // Load user data when user or profile changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setName(profile.name || '');
    }
  }, [user, profile]);
  
  const handleSaveAccount = async () => {
    setIsLoading(true);
    try {
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
  
  return (
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
  );
};
