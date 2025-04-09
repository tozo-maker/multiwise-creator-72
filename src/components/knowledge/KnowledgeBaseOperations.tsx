
import { useAuth } from '@/contexts/AuthContext';
import { KnowledgeBaseService } from '@/services/KnowledgeBaseService';
import { KBFile } from './KnowledgeBaseFileList';

interface KnowledgeBaseOperationsProps {
  files: KBFile[];
  setFiles: React.Dispatch<React.SetStateAction<KBFile[]>>;
  updateCategories: (filesList: KBFile[]) => void;
  refreshFiles: () => void;
}

export const useKnowledgeBaseOperations = ({
  files,
  setFiles,
  updateCategories,
  refreshFiles
}: KnowledgeBaseOperationsProps) => {
  const { user } = useAuth();

  const handleDeleteFile = async (id: string) => {
    try {
      await KnowledgeBaseService.deleteFile(id);
      const updatedFiles = files.filter(file => file.id !== id);
      setFiles(updatedFiles);
      updateCategories(updatedFiles);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const handleFilesUploaded = async (newFiles: { file: File, description: string }[]) => {
    if (!user?.id) {
      console.error('No user ID available for file upload');
      return;
    }

    try {
      const uploadedFiles = await KnowledgeBaseService.uploadFiles(user.id, newFiles);
      refreshFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  return {
    handleDeleteFile,
    handleFilesUploaded
  };
};
