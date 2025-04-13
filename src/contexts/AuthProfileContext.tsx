
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ProfileCompletion = {
  hasUsername: boolean;
  hasAvatar: boolean;
  hasPreferences: boolean;
  completionPercentage: number;
};

interface AuthProfileContextType {
  isProfileComplete: boolean;
  profileCompletion: ProfileCompletion;
  updateProfileField: (field: string, value: any) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  isUpdating: boolean;
}

const AuthProfileContext = createContext<AuthProfileContextType | undefined>(undefined);

export const AuthProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion>({
    hasUsername: false,
    hasAvatar: false,
    hasPreferences: false,
    completionPercentage: 0
  });

  useEffect(() => {
    if (profile) {
      const hasUsername = !!profile.username;
      const hasAvatar = !!profile.avatar_url;
      const hasPreferences = !!(profile.theme && profile.notification_frequency);
      
      const completedFields = [hasUsername, hasAvatar, hasPreferences].filter(Boolean).length;
      const completionPercentage = Math.round((completedFields / 3) * 100);
      
      setProfileCompletion({
        hasUsername,
        hasAvatar,
        hasPreferences,
        completionPercentage
      });
    }
  }, [profile]);

  const updateProfileField = async (field: string, value: any) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: `Your ${field} has been updated successfully.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    setIsUpdating(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      const publicUrl = data.publicUrl;
      
      await updateProfileField('avatar_url', publicUrl);
      
      return publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Avatar upload failed",
        description: error.message || "Failed to upload avatar."
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const isProfileComplete = profileCompletion.completionPercentage >= 70;

  return (
    <AuthProfileContext.Provider 
      value={{ 
        isProfileComplete, 
        profileCompletion, 
        updateProfileField, 
        uploadAvatar, 
        isUpdating 
      }}
    >
      {children}
    </AuthProfileContext.Provider>
  );
};

export const useAuthProfile = () => {
  const context = useContext(AuthProfileContext);
  if (context === undefined) {
    throw new Error('useAuthProfile must be used within an AuthProfileProvider');
  }
  return context;
};
