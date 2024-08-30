export interface DefaultResponseInterface<T> {
    status: boolean;
    statusCode: string;
    data?: T | null;
    message: string;
}

export interface DefaultResponseHeaderInterface {
    'Access-Control-Allow-Origin': string;
};