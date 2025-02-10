export interface Usuario {
    id?: number;
    nombreUsuario: string;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
    isActive?: boolean;
    contrasena?: string;
    rolId?: number;
    rolNombre?: string;
    trabajadorId?: number;
    trabajadorNombre?: string;
}