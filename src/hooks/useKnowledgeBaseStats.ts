
import { KBFile } from '@/components/knowledge/KnowledgeBaseFileList';

export const useKnowledgeBaseStats = (files: KBFile[]) => {
  const calculateTotalSize = () => {
    const totalBytes = files.reduce((sum, file) => {
      const sizeStr = file.size;
      if (sizeStr.includes('KB')) {
        return sum + parseFloat(sizeStr) * 1024;
      } else if (sizeStr.includes('MB')) {
        return sum + parseFloat(sizeStr) * 1024 * 1024;
      } else if (sizeStr.includes('GB')) {
        return sum + parseFloat(sizeStr) * 1024 * 1024 * 1024;
      }
      return sum;
    }, 0);
    
    if (totalBytes < 1024) {
      return `${totalBytes} B`;
    } else if (totalBytes < 1024 * 1024) {
      return `${(totalBytes / 1024).toFixed(2)} KB`;
    } else if (totalBytes < 1024 * 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const calculateFileTypes = () => {
    const fileTypes: Record<string, number> = {};
    files.forEach(file => {
      const type = file.fileType.toLowerCase();
      fileTypes[type] = (fileTypes[type] || 0) + 1;
    });
    return fileTypes;
  };

  return {
    totalSize: calculateTotalSize(),
    fileTypes: calculateFileTypes()
  };
};
