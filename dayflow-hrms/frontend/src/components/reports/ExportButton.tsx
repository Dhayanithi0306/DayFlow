import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Download } from 'lucide-react';

export interface ExportButtonProps {
  onExport: () => Promise<Blob>;
  filename?: string;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  filename = 'Report.csv',
  label = 'Export CSV',
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await onExport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('Report exported successfully.', 'success');
    } catch (err: any) {
      showToast('Failed to export report.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      loading={loading}
      icon={<Download size={16} />}
    >
      {label}
    </Button>
  );
};
