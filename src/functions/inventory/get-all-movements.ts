import { APIGatewayProxyEvent } from 'aws-lambda';
import { DefaultResponse } from '../../common/utils/default.response';
import { InventoryService } from '../../services/inventory.service';
import { InventoryMovementEntity } from '../../common/entities/inventory.movements.entity';

export const handler = async (_event: APIGatewayProxyEvent): Promise<DefaultResponse<InventoryMovementEntity[]>> => {

    const dataReturn = new DefaultResponse<InventoryMovementEntity[]>();

    try {
        const result = await InventoryService.getAllMovements();
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
            message: 'Ocurrió un error al ejecutar la consulta',
            status: false,
            data: ex,
            statusCode: '1x001'
        }, 500);
    }

    return dataReturn;
};