export interface DocumentosByCurrentDateResponse{
  totalDocuments: number;
}

export interface TotalDerivedDocumentsToday{
  totalPendingDocumentsToday: number
}

export interface TotalPendingDerivedDocumentsToday{
  totalPendingDerivedDocumentsToday: number
}

export interface TotalDocumentsByCaserioToday{
  nombreCaserio: string;
  totalDocuments: number;
}