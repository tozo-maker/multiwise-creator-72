
import React from 'react';
import { Calendar, Clock, Download, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export interface Snapshot {
  id: string;
  name: string;
  createdAt: Date;
  description: string;
  thumbnail?: string;
}

interface ProjectSnapshotProps {
  snapshot: Snapshot;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export const ProjectSnapshot: React.FC<ProjectSnapshotProps> = ({
  snapshot,
  onRestore,
  onDelete,
  onDownload
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 rounded-t-lg bg-slate-100 flex items-center justify-center overflow-hidden h-36">
        {snapshot.thumbnail ? (
          <img 
            src={snapshot.thumbnail} 
            alt={snapshot.name}
            className="object-cover w-full h-full rounded"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Calendar className="h-12 w-12 text-slate-300" />
            <span className="text-xs text-slate-400 mt-2">No preview</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-slate-900 mb-1">{snapshot.name}</h3>
        <div className="flex items-center text-xs text-slate-500 mb-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDistanceToNow(snapshot.createdAt, { addSuffix: true })}</span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-3">{snapshot.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => onDelete(snapshot.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => onDownload(snapshot.id)}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onRestore(snapshot.id)}
            >
              <Play className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only">Restore</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
