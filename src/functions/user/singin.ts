import { APIGatewayProxyEvent } from 'aws-lambda';
import { DefaultResponse } from '../../common/utils/default.response';
import { UserService } from '../../services/user.service';
import { SigninResponseInterface } from '../../common/interfaces/signin.response.interface';

export const handler = async (event: APIGatewayProxyEvent): Promise<DefaultResponse<SigninResponseInterface>> => {

    const dataReturn = new DefaultResponse<SigninResponseInterface>();

    try {
        const { user, password } = JSON.parse(event.body ?? '{}');

        if(!user || !password){
            dataReturn.setData({
                message: 'La petición no contiene la información completa.',
                status: false,
                statusCode: '1x001'
            }, 500);
            return dataReturn;
        }

        const result: SigninResponseInterface = await UserService.singin(user, password);

        dataReturn.setData({
            data: result,
            message: 'Sesión autorizada.',
            status: true,
            statusCode: 'OK'
        });

    } catch(ex: any) {

        let statusCode: string = '1x002';
        let httpCode: number = 500;

        if(ex.hasOwnProperty('error') && ex.error && ex.error.hasOwnProperty('nextStep')){
            statusCode = ex.code;
            if(ex.error.nextStep === 'FAILURE'){
                httpCode = 401;
            }
        }

        dataReturn.setData({
            data: ex,
            message: 'Sesión rechazada.',
            status: false,
            statusCode: statusCode
        }, httpCode);

    };

    return dataReturn;
    
};