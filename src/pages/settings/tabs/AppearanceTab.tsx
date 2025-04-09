
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeRadioGroup } from '@/components/shared/ThemeRadioGroup';
import { ThemeSelect } from '@/components/shared/ThemeSelect';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export const AppearanceTab = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useAuth();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  // Appearance settings
  const [theme, setThemeState] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Load settings from profile
  useEffect(() => {
    if (profile) {
      setThemeState(profile.theme || 'system');
      setFontSize(profile.font_size || 'medium');
      setReducedMotion(profile.reduced_motion || false);
    }
  }, [profile]);
  
  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        theme,
        font_size: fontSize,
        reduced_motion: reducedMotion
      });
      
      // Update the active theme
      setTheme(theme as 'light' | 'dark');
      
      toast({
        title: "Appearance settings saved",
        description: "Your appearance preferences have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem saving your appearance settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
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
            onChange={setThemeState}
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
        <Button 
          onClick={handleSaveAppearance}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
