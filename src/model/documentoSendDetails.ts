export interface DocumentoSentDetails{
    id: number;               
    nombreDocumento: string;
    nombreAmbito: string; 
    nombreCategoria: string;
    nombreCaserio?: string;
    nombreCentroPoblado?: string;
    fechaEnvio: string;
    asunto: string;
    derivacionId: number;   
    areaDestinoId: number;
    nombreAreaDestino: string;
    derivadoPor?: string;
}