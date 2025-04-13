
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';

export const MobileUserProfile: React.FC = () => {
  let user = null;
  let profile = null;
  
  try {
    const auth = useAuth();
    user = auth.user;
    profile = auth.profile;
  } catch (error) {
    console.error('Error accessing auth context:', error);
  }
  
  if (!user) {
    return (
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-brand-100 text-brand-700">GU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">Guest User</p>
            <p className="text-xs text-slate-500">Not signed in</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get display name prioritizing the user's full name from profile
  const displayName = profile?.name || profile?.username || user.email?.split('@')[0] || 'User';
  
  // Get initials for avatar
  const initials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : displayName.substring(0, 2).toUpperCase();

  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-brand-100 text-brand-700">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium text-sm">{displayName}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
