export interface Documento {
    id?: number;
    documentoBytes: File | null
    nombre: string;
    folios: number;
    asunto: string;
    ambitoId: number;
    remitenteId?: number;
    categoriaId: number;
    caserioId: number;
    centroPobladoId: number;
}