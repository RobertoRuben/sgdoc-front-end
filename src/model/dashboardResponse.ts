export interface IngresosPorAmbitoResponse{
    ambito: string;
    total?: number;
}

export interface IngresosPorCaserioResponse{
    caserio: string;
    totalDocumentos?: number;
}

export interface TotalIngresosResponse{
    totalDocumentos?: number;
}

export interface PromedioIngresosResponse{
    promedioIngresos?: number;
}

export interface TopIngresosResponse{
    caserio: string;
    totalDocumentos?: number;
}

export interface IngresosCentroPobladoResponse {
    mes: string;
    centros?: Array<{
      centroPoblado: string;     
      totalDocumentos: number;
    }>;
  }