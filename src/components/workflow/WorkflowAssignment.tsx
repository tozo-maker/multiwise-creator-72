
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import { WorkflowService } from '@/services/WorkflowService';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface WorkflowAssignmentProps {
  contentId: string;
  steps: {
    id: string;
    name: string;
    status: 'pending' | 'completed' | 'rejected';
  }[];
  onAssignmentsUpdated?: () => void;
}

export const WorkflowAssignment: React.FC<WorkflowAssignmentProps> = ({
  contentId,
  steps,
  onAssignmentsUpdated
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  // Mock users data - in a real application, this would be fetched from your backend
  const users = [
    { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
  ];

  const handleAssign = async (stepId: string, userId: string) => {
    try {
      setIsAssigning(true);
      
      // In a real implementation, this would call an API to assign the user
      console.log(`Assigning step ${stepId} to user ${userId}`);
      
      toast({
        title: 'User Assigned',
        description: `Assigned to ${users.find(u => u.id === userId)?.name || userId}`,
      });
      
      if (onAssignmentsUpdated) {
        onAssignmentsUpdated();
      }
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign user',
        variant: 'destructive'
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Manage Assignments</h3>
      
      {steps.map(step => (
        <div 
          key={step.id} 
          className="p-3 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-slate-500" />
              <div className="font-medium">{step.name}</div>
            </div>
            
            <Select onValueChange={(value) => handleAssign(step.id, value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
      
      {steps.length === 0 && (
        <div className="text-center py-4 text-sm text-slate-500">
          No workflow steps available for assignment.
        </div>
      )}
    </div>
  );
};
