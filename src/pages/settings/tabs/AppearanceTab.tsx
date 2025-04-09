
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ThemeRadioGroup } from '@/components/shared/ThemeRadioGroup';
import { ThemeSelect } from '@/components/shared/ThemeSelect';
import { useToast } from '@/hooks/use-toast';

export const AppearanceTab = () => {
  const { toast } = useToast();
  
  // Appearance settings
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
    });
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
  );
};
