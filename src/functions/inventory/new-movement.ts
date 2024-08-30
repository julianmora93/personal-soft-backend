import { APIGatewayProxyEvent } from 'aws-lambda';
import { DefaultResponse } from '../../common/utils/default.response';
import { ProductEntity } from '../../common/entities/products.entity';
import { InventoryService } from '../../services/inventory.service';
import { MovementRequestInterface } from '../../common/interfaces/movement.request.interface';

export const handler = async (event: APIGatewayProxyEvent): Promise<DefaultResponse<ProductEntity>> => {
    
    const dataReturn = new DefaultResponse<ProductEntity>();

    try {
        const request: MovementRequestInterface = JSON.parse(event.body ?? '{}');

        const result = await InventoryService.newMovement(request);

        if(result.status){
            dataReturn.setData({
                message: 'La consulta se ejecutó correctamente.',
                status: true,
                data: result.data,
                statusCode: 'OK'
            }, 200);
        }else{
            dataReturn.setData({
                message: 'Ocurrió un error al ejecutar la consulta',
                status: false,
                data: result.sql,
                statusCode: result.code
            }, 500);
        }
    } catch(ex: any) {
        dataReturn.setData({
            message: 'Ocurrió un error al ejecutar el proceso',
            status: false,
            data: ex,
            statusCode: '1x001'
        }, 500);
    }

    return dataReturn;
};