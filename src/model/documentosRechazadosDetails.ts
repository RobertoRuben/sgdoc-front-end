export interface DocumentoRechazadosDetails {
    id: number; 
    nombreDocumento: string; 
    nombreAmbito: string; 
    nombreCategoria: string; 
    nombreCaserio?: string;
    nombreCentroPoblado?: string;
    fechaEnvio: string; 
    fechaRechazo: string; 
    asunto: string; 
    derivacionId: number; 
    areaOrigenId: number; 
    nombreAreaOrigen: string; 
    derivadoPor: string; 
}
