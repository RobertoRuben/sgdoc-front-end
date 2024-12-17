export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}


export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
