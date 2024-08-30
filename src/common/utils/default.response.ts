import { DefaultResponseHeaderInterface, DefaultResponseInterface } from "../interfaces/default.response.interface";

export class DefaultResponse<T> {
    public headers: DefaultResponseHeaderInterface;
    public statusCode: number;
    public body: string;

    constructor(data?: DefaultResponseInterface<T>, httpCode?: number){
        this.headers = {
            'Access-Control-Allow-Origin': '*',
        };
        this.statusCode = httpCode ?? 200;
        this.body = data ? JSON.stringify(data) : '';
    }
    
    // constructor(){
    //     this.headers = {
    //         'Access-Control-Allow-Origin': '*',
    //     };
    //     this.statusCode = 200;
    //     this.body = '';
    // }

    public setData(data: DefaultResponseInterface<T>, httpCode?: number): void{
        this.headers = {
            'Access-Control-Allow-Origin': '*',
        };
        this.statusCode = httpCode ?? 200;
        this.body = JSON.stringify(data);
    }
}