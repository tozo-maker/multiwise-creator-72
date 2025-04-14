
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';

export const ReadyToCreateCard: React.FC = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-6 flex items-center gap-3">
        <CheckCircleIcon className="h-6 w-6 text-green-600" />
        <div>
          <h4 className="font-medium text-green-800">Ready to Create</h4>
          <p className="text-sm text-green-700">
            Your project configuration is complete. Click "Create Project" to continue.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
