export interface UsuarioDetails{
    id: number;
    nombreUsuario: string;
    fechaCreacion: string;
    fechaActualizacion?: string;
    isActive: boolean;
    rolNombre: string;
    trabajadorNombre: string;
}