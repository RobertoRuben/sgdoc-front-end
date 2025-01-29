export interface DocumentoReceivedDetails{
    id: number;               
    nombreDocumento: string;
    nombreAmbito: string; 
    nombreCategoria: string;
    nombreCaserio?: string;
    nombreCentroPoblado?: string;
    fechaEnvio: string;
    asunto: string;
    derivacionId: number;   
    areaOrigenId: number;
    nombreAreaOrigen: string;
    derivadoPor?: string;
}