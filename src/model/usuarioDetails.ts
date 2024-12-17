export interface UsuarioDetails{
    id: number;
    nombreUsuario: string;
    fechaCreacion: Date;
    fechaActualizacion?: Date;
    is_active: boolean;
    rol_nombre: string;
    trabajador_nombre: string;
}