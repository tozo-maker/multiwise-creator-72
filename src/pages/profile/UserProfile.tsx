
import React, { useState, useEffect } from 'react';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { User, Camera } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { isDark } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile({ 
        username,
        avatar_url: avatarUrl
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('project_files')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('project_files').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: 'Avatar uploaded',
        description: 'Your avatar has been uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload error',
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile' }
  ];

  return (
    <ModernLayout contentWidth="narrow">
      <div className="space-y-6">
        <PageBreadcrumbs items={breadcrumbItems} />
        
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Your Profile
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage your account settings and profile information.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and how others see you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="User avatar" 
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className={`h-12 w-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand-500 text-white cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-slate-100 dark:bg-slate-800"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="submit" 
                  disabled={isLoading || uploading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
};

export default UserProfile;
