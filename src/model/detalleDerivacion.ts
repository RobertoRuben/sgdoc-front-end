export interface DetalleDerivacion{
    id?: number;
    estado: string;
    comentario?: string;
    fecha?: Date;
    recepcionada?: boolean;
    usuarioId?: number;
    nombreUsuario?: string;
    derivacionId?: number;
}