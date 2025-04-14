
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface WorkflowAssignmentProps {
  contentId: string;
  steps: {
    id: string;
    name: string;
    status: 'pending' | 'completed' | 'rejected';
    assignee?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }[];
  onAssignmentsUpdated?: () => void;
}

export const WorkflowAssignment: React.FC<WorkflowAssignmentProps> = ({
  contentId,
  steps,
  onAssignmentsUpdated
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<{[key: string]: string}>({});
  const { toast } = useToast();
  
  // Load mock users for demo
  useEffect(() => {
    // In a real implementation, fetch from API
    setUsers([
      { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '' },
      { id: 'user2', name: 'Bob Smith', email: 'bob@example.com', avatar: '' },
      { id: 'user3', name: 'Carol Davis', email: 'carol@example.com', avatar: '' }
    ]);
    
    // Initialize assignments from props
    const initialAssignments: {[key: string]: string} = {};
    steps.forEach(step => {
      if (step.assignee) {
        initialAssignments[step.id] = step.assignee.id;
      }
    });
    setAssignments(initialAssignments);
  }, [steps]);
  
  const handleAssign = async (stepId: string, userId: string) => {
    try {
      // In a real implementation, update the database
      setAssignments(prev => ({
        ...prev,
        [stepId]: userId
      }));
      
      const user = users.find(u => u.id === userId);
      
      toast({
        title: 'User Assigned',
        description: `${user?.name || 'User'} has been assigned to this step.`
      });
      
      if (onAssignmentsUpdated) {
        onAssignmentsUpdated();
      }
    } catch (error) {
      console.error('Error assigning user:', error);
      toast({
        title: 'Assignment Failed',
        description: 'Failed to assign user to this step.',
        variant: 'destructive'
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Assign Reviewers</h3>
      
      {steps.map(step => (
        <div 
          key={step.id} 
          className="p-3 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {assignments[step.id] ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={users.find(u => u.id === assignments[step.id])?.avatar} />
                <AvatarFallback>
                  {getInitials(users.find(u => u.id === assignments[step.id])?.name || 'U')}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-slate-500" />
              </div>
            )}
            
            <div>
              <div className="font-medium">{step.name}</div>
              <div className="text-xs text-slate-500">
                {assignments[step.id] 
                  ? `Assigned to ${users.find(u => u.id === assignments[step.id])?.name}`
                  : 'Not assigned'
                }
              </div>
            </div>
          </div>
          
          <Select
            value={assignments[step.id] || ''}
            onValueChange={(value) => handleAssign(step.id, value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
