
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const MobileUserProfile: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-brand-100 text-brand-700">JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">John Doe</p>
          <p className="text-xs text-slate-500">john.doe@example.com</p>
        </div>
      </div>
    </div>
  );
};
