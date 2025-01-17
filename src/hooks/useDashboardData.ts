import { useState, useEffect } from 'react';
import {
  getTotalDocumentsToday,
  getTotalDerivedDocumentsToday,
  getTotalPendingDerivedDocumentsToday,
  getTotalDocumentsByCaserioToday
} from '@/service/dashboardMesaPartesService';

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalDocuments: 0,
    totalDerivedDocuments: 0,
    totalPendingDerivedDocuments: 0,
    documentsByCaserio: [] as { name: string; documentos: number; }[]
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [
        documentsToday,
        derivedDocuments,
        pendingDerivedDocuments,
        documentsByCaserio
      ] = await Promise.all([
        getTotalDocumentsToday(),
        getTotalDerivedDocumentsToday(),
        getTotalPendingDerivedDocumentsToday(),
        getTotalDocumentsByCaserioToday()
      ]);

      setDashboardData({
        totalDocuments: documentsToday.totalDocuments,
        totalDerivedDocuments: derivedDocuments.totalPendingDocumentsToday,
        totalPendingDerivedDocuments: pendingDerivedDocuments.totalPendingDerivedDocumentsToday,
        documentsByCaserio: documentsByCaserio.map(item => ({
          name: item.nombreCaserio,
          documentos: item.totalDocuments
        }))
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { dashboardData, isLoading, error, refetch: fetchData };
};