
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModernLayout } from '@/components/layout/ModernLayout';
import { ProjectWorkspaceHeader } from '@/components/project/ProjectWorkspaceHeader';
import { ProjectWorkspaceTabs } from '@/components/project/ProjectWorkspaceTabs';
import { ProjectSnapshot, Snapshot } from '@/components/project/ProjectSnapshot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Camera, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { PageBreadcrumbs } from '@/components/navigation/PageBreadcrumbs';

export const SnapshotsWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  // Mock project data
  const project = {
    id: projectId || '1',
    name: 'Spanish Language Textbook',
    type: 'Textbook',
    targetLanguage: 'Spanish',
    lastModified: '2 hours ago',
    progress: 65
  };
  
  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${projectId}` },
    { label: 'Snapshots' }
  ];
  
  // State management
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [snapshotToDelete, setSnapshotToDelete] = useState<string | null>(null);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [newSnapshotDescription, setNewSnapshotDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([
    {
      id: '1',
      name: 'Initial Draft',
      createdAt: new Date(2023, 5, 15),
      description: 'First complete draft of the textbook with basic structure and content.'
    },
    {
      id: '2',
      name: 'Post-Review Revision',
      createdAt: new Date(2023, 6, 2),
      description: 'Major revisions after the first content review. Improved exercises and cultural context.'
    },
    {
      id: '3',
      name: 'Enhanced Formatting',
      createdAt: new Date(2023, 6, 18),
      description: 'Applied consistent formatting and improved visuals throughout all chapters.'
    }
  ]);
  
  // Filtered snapshots based on search
  const filteredSnapshots = snapshots.filter(snapshot => 
    snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snapshot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handlers
  const handleCreateSnapshot = () => {
    if (!newSnapshotName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your snapshot.",
        variant: "destructive"
      });
      return;
    }
    
    const newSnapshot: Snapshot = {
      id: `snapshot-${Date.now()}`,
      name: newSnapshotName.trim(),
      createdAt: new Date(),
      description: newSnapshotDescription.trim() || "No description provided"
    };
    
    setSnapshots([newSnapshot, ...snapshots]);
    setCreateDialogOpen(false);
    setNewSnapshotName('');
    setNewSnapshotDescription('');
    
    toast({
      title: "Snapshot created",
      description: "Your project snapshot has been saved."
    });
  };
  
  const handleRestoreSnapshot = (id: string) => {
    // In a real app, this would restore the snapshot
    const snapshot = snapshots.find(s => s.id === id);
    
    if (snapshot) {
      toast({
        title: "Snapshot restored",
        description: `Project restored to "${snapshot.name}" state.`
      });
    }
  };
  
  const handleDeleteSnapshot = (id: string) => {
    setSnapshotToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };
  
  const confirmDeleteSnapshot = () => {
    if (snapshotToDelete) {
      setSnapshots(snapshots.filter(s => s.id !== snapshotToDelete));
      setConfirmDeleteDialogOpen(false);
      setSnapshotToDelete(null);
      
      toast({
        title: "Snapshot deleted",
        description: "The snapshot has been permanently removed."
      });
    }
  };
  
  const handleDownloadSnapshot = (id: string) => {
    // In a real app, this would download the snapshot
    const snapshot = snapshots.find(s => s.id === id);
    
    if (snapshot) {
      toast({
        title: "Download started",
        description: `Exporting "${snapshot.name}" as ZIP archive.`
      });
    }
  };
  
  return (
    <ModernLayout contentWidth="wide">
      <div className="space-y-6">
        <div className="pt-4">
          <PageBreadcrumbs items={breadcrumbItems} />
        </div>
      
        <ProjectWorkspaceHeader 
          projectName={project.name}
          projectType={project.type}
          targetLanguage={project.targetLanguage}
        />
        
        <ProjectWorkspaceTabs projectId={project.id} activeTab="snapshots" />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">Project Snapshots</h2>
          <p className="text-slate-400">
            Save and restore project states at important milestones
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search snapshots" 
              className="pl-8 bg-slate-800 border-slate-700 text-slate-300 placeholder-slate-500" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Snapshot
          </Button>
        </div>
        
        {filteredSnapshots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnapshots.map((snapshot) => (
              <ProjectSnapshot
                key={snapshot.id}
                snapshot={snapshot}
                onRestore={handleRestoreSnapshot}
                onDelete={handleDeleteSnapshot}
                onDownload={handleDownloadSnapshot}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              {searchQuery ? (
                <>
                  <p className="text-slate-400 mb-4">No snapshots match your search criteria</p>
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700">
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-100">No Snapshots Yet</h3>
                  <p className="text-slate-400 mb-4 max-w-md">
                    Snapshots let you save the current state of your project 
                    at important milestones so you can easily revert back if needed.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Create Your First Snapshot
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Create Snapshot Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Create Project Snapshot</DialogTitle>
              <DialogDescription className="text-slate-400">
                Save the current state of your project that you can restore later
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="snapshotName" className="text-slate-300">Snapshot Name*</Label>
                <Input 
                  id="snapshotName"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  placeholder="e.g., Pre-Review Draft"
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="snapshotDescription" className="text-slate-300">Description (Optional)</Label>
                <Textarea 
                  id="snapshotDescription"
                  value={newSnapshotDescription}
                  onChange={(e) => setNewSnapshotDescription(e.target.value)}
                  placeholder="Briefly describe what's important about this project state..."
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500"
                />
              </div>
              
              <div className="bg-slate-900 p-3 rounded-md text-sm text-slate-400">
                <p>Current project state as of {format(new Date(), 'PPP p')} will be saved.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setCreateDialogOpen(false)}
                className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSnapshot}
                disabled={!newSnapshotName.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Create Snapshot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to delete this snapshot? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteDialogOpen(false)}
                className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeleteSnapshot}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Snapshot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ModernLayout>
  );
};

export default SnapshotsWorkspace;
