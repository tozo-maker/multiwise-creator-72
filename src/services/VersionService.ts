
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ContentVersion {
  id: string;
  content_id: string;
  version: number;
  content: string;
  title: string;
  type: string;
  metadata: any;
  created_at: string;
  created_by?: string;
  changes?: string;
}

export const VersionService = {
  async getVersionHistory(contentId: string): Promise<ContentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('version', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching version history:', error);
      return [];
    }
  },
  
  async createVersion(contentId: string, content: string, title: string, type: string, metadata: any, changes?: string): Promise<ContentVersion | null> {
    try {
      // First, get the current latest version
      const { data: latestVersion, error: versionError } = await supabase
        .from('content_versions')
        .select('version')
        .eq('content_id', contentId)
        .order('version', { ascending: false })
        .limit(1)
        .single();
      
      const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;
      
      // Create new version
      const { data, error } = await supabase
        .from('content_versions')
        .insert({
          content_id: contentId,
          version: newVersionNumber,
          content,
          title,
          type,
          metadata,
          changes
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error creating content version:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content version',
        variant: 'destructive',
      });
      return null;
    }
  },
  
  async restoreVersion(versionId: string): Promise<boolean> {
    try {
      // First get the version to restore
      const { data: versionData, error: versionError } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId)
        .single();
        
      if (versionError || !versionData) {
        throw new Error('Version not found');
      }
      
      // Update the content item with the version data
      const { error: updateError } = await supabase
        .from('content_items')
        .update({
          content: versionData.content,
          title: versionData.title,
          content_type: versionData.type,
          metadata: versionData.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', versionData.content_id);
        
      if (updateError) throw updateError;
      
      // Create a new version marking this as a restoration
      await this.createVersion(
        versionData.content_id,
        versionData.content,
        versionData.title,
        versionData.type,
        versionData.metadata,
        `Restored from version ${versionData.version}`
      );
      
      return true;
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore content version',
        variant: 'destructive',
      });
      return false;
    }
  },
  
  async compareVersions(versionId1: string, versionId2: string): Promise<{v1: ContentVersion, v2: ContentVersion} | null> {
    try {
      const { data: v1, error: error1 } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId1)
        .single();
        
      const { data: v2, error: error2 } = await supabase
        .from('content_versions')
        .select('*')
        .eq('id', versionId2)
        .single();
        
      if (error1 || error2 || !v1 || !v2) {
        throw new Error('One or both versions not found');
      }
      
      return { v1, v2 };
    } catch (error) {
      console.error('Error comparing versions:', error);
      return null;
    }
  }
};
