
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConfigurationErrorAlertProps {
  message: string;
}

export const ConfigurationErrorAlert: React.FC<ConfigurationErrorAlertProps> = ({ message }) => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error saving configuration</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
