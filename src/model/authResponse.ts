export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    rolName: string;
    userId: number;
    areaId: number;
}