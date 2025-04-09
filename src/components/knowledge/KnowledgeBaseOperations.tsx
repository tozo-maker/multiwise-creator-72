
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';

interface UseKnowledgeBaseOperationsProps {
  files: KBFile[];
  setFiles: React.Dispatch<React.SetStateAction<KBFile[]>>;
  updateCategories: (files: KBFile[]) => void;
  refreshFiles: () => Promise<void>;
}

export const useKnowledgeBaseOperations = ({
  files,
  setFiles,
  updateCategories,
  refreshFiles
}: UseKnowledgeBaseOperationsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteFile = async (fileId: string) => {
    try {
      setIsLoading(true);
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // Delete the file record from the database
      const { error } = await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
      
      // Also attempt to delete the actual file from storage if URL exists
      if (file.url) {
        const path = file.url.split('/').pop();
        if (path) {
          await supabase.storage.from('knowledge_base').remove([path]);
        }
      }
      
      // Update the local state
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
      
      toast({
        title: "File deleted",
        description: `Successfully deleted "${file.name}"`,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesUploaded = async (uploadedFiles: { file: File, description: string }[]) => {
    try {
      setIsLoading(true);
      
      const newFiles: KBFile[] = [];
      
      for (const { file, description } of uploadedFiles) {
        // Upload the file to Supabase storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('knowledge_base')
          .upload(fileName, file);
        
        if (storageError) throw storageError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('knowledge_base')
          .getPublicUrl(fileName);
        
        const fileUrl = publicUrlData.publicUrl;
        
        // Insert the file record into the database
        const { data: fileData, error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            name: file.name,
            description,
            file_type: file.name.split('.').pop() || 'unknown',
            size: formatFileSize(file.size),
            url: fileUrl,
            category: 'Uploaded Files' // Default category
          })
          .select();
        
        if (dbError) throw dbError;
        
        if (fileData && fileData.length > 0) {
          // Transform the inserted record to match KBFile interface
          const newFile: KBFile = {
            id: fileData[0].id,
            name: fileData[0].name,
            description: fileData[0].description || '',
            fileType: fileData[0].file_type,
            size: fileData[0].size,
            uploadDate: new Date(fileData[0].created_at).toLocaleDateString(),
            category: fileData[0].category || 'Other',
            url: fileData[0].url
          };
          
          newFiles.push(newFile);
        }
      }
      
      // Update the local state
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
      
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return {
    handleDeleteFile,
    handleFilesUploaded,
    isLoading
  };
};
