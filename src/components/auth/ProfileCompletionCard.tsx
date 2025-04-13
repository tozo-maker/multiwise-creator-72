
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '@/contexts/AuthProfileContext';
import { User, UserCog, Upload, Settings } from 'lucide-react';

export const ProfileCompletionCard: React.FC = () => {
  const navigate = useNavigate();
  const { profileCompletion } = useAuthProfile();
  const { hasUsername, hasAvatar, hasPreferences, completionPercentage } = profileCompletion;
  
  const steps = [
    {
      title: 'Set Username',
      description: 'Choose a username for your profile',
      completed: hasUsername,
      icon: User,
      action: () => navigate('/profile')
    },
    {
      title: 'Upload Avatar',
      description: 'Add a profile picture',
      completed: hasAvatar,
      icon: Upload,
      action: () => navigate('/profile')
    },
    {
      title: 'Set Preferences',
      description: 'Configure your interface preferences',
      completed: hasPreferences,
      icon: Settings,
      action: () => navigate('/settings')
    }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <CardDescription>Enhance your workspace experience</CardDescription>
          </div>
          <UserCog className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Progress value={completionPercentage} className="flex-1" />
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`p-1.5 rounded-full ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${step.completed ? 'text-green-600' : ''}`}>{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {!step.completed && (
                <Button variant="outline" size="sm" onClick={step.action}>
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
