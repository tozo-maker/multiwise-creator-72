
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeBaseFileList } from './KnowledgeBaseFileList';
import { KnowledgeBaseUpload } from './KnowledgeBaseUpload';
import { KnowledgeBaseCategories } from './KnowledgeBaseCategories';
import { KnowledgeBaseAnalytics } from './KnowledgeBaseAnalytics';
import { Button } from '@/components/ui/button';
import { Plus, SearchIcon, TagIcon, FolderIcon } from 'lucide-react';

export const KnowledgeBaseMain = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage your educational resources and materials.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>
                  Your most recently added knowledge resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <KnowledgeBaseFileList />
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseCategories />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <KnowledgeBaseUpload />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <KnowledgeBaseAnalytics />
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <KnowledgeBaseFileList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Image resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Video resources will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
