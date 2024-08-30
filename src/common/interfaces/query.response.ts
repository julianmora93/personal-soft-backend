export interface QueryResponse<T> {
    status: boolean;
    code: string;
    data?: T | null;
    sql?: any;
}