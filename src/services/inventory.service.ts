import { Connection } from "mysql";
import { QueryResponse } from "../common/interfaces/query.response";
import { createConnection, queryProcess } from "../common/utils/db.process";
import { InventoryMovementEntity, parseMovements } from "../common/entities/inventory.movements.entity";
import { ProductEntity } from "../common/entities/products.entity";
import { MovementRequestInterface } from "../common/interfaces/movement.request.interface";

export class InventoryService {

    private static validateEnvironmentVars(): boolean {
        const { 
            ENV_DB_HOST,
            ENV_DB_USER,
            ENV_DB_PASSWORD,
            ENV_DB_DATA_BASE
        } = process.env;
        if(!ENV_DB_HOST || !ENV_DB_USER || !ENV_DB_PASSWORD || !ENV_DB_DATA_BASE){
            return false;
        }
        return true;
    }

    static async getAllProducts(): Promise<QueryResponse<ProductEntity[]>> {

        let connection: Connection | null = null;

        try {

            if(!this.validateEnvironmentVars()){
                return {
                    code: '0x001',
                    status: false,
                    sql: 'Environment vars failed configuration'
                };
            }

            connection = createConnection();

            const queryText: string = `
                SELECT products.id,
                    products.name,
                    products.description,
                    products.quantity,
                    products.price
                FROM inventory.products;
            `;
            const results: any = await queryProcess(queryText, connection);

            if(results === null || results === undefined){
                return {
                    code: '0x002',
                    status: false,
                    sql: 'Error query'
                };
            }

            return {
                code: 'OK',
                data: results,
                status: true
            };
        } catch(ex) {
            return {
                code: '0x003',
                status: false,
                sql: ex
            };
        } finally {
            if(connection) connection.end();
        }
    }

    static async getAllMovements(): Promise<QueryResponse<InventoryMovementEntity[]>> {

        let connection: Connection | null = null;

        try {

            if(!this.validateEnvironmentVars()){
                return {
                    code: '0x001',
                    status: false,
                    sql: 'Environment vars failed configuration'
                };
            }

            connection = createConnection();

            const queryText: string = `
                SELECT
                    products.id AS product_id
                    ,products.name AS product_name
                    ,products.description AS product_description
                    ,products.quantity AS product_current_quantity
                    ,products.price AS product_price
                    ,inventory_movements.id AS movement_id
                    ,inventory_movements.type AS movement_type
                    ,inventory_movements.quantity AS movement_quantity
                    ,inventory_movements.date AS movement_date
                    ,users.id AS user_id
                    ,users.username AS user_name
                    ,users.role AS user_role
                    ,user_status.id AS user_status_id
                    ,user_status.status_name AS user_status_name
                FROM products
                LEFT JOIN inventory_movements ON products.id = inventory_movements.product_id
                INNER JOIN users ON users.id = inventory_movements.user_id
                INNER JOIN user_status ON user_status.id = users.status_id
                ORDER BY inventory_movements.date DESC;
            `;
            const results: any = await queryProcess(queryText, connection);

            if(results === null || results === undefined){
                return {
                    code: '0x002',
                    status: false,
                    sql: 'Error query'
                };
            }

            const resultParsed: InventoryMovementEntity[] | null = parseMovements(results);
            
            return {
                code: 'OK',
                data: resultParsed,
                status: true
            };
        } catch(ex) {
            return {
                code: '0x003',
                status: false,
                sql: ex
            };
        } finally {
            if(connection) connection.end();
        }

    }
    

    static async newMovement(data: MovementRequestInterface): Promise<QueryResponse<ProductEntity>> {

        let connection: Connection | null = null;

        try {

            if(!this.validateEnvironmentVars()){
                return {
                    code: '0x001',
                    status: false,
                    sql: 'Environment vars failed configuration'
                };
            }

            connection = createConnection();

            const queryText: string = `
                SELECT 
                    products.id,
                    products.name,
                    products.description,
                    products.quantity,
                    products.price
                FROM products
                WHERE products.id = ?;
            `;
            const product: any = await queryProcess(queryText, connection, [data.productId]);

            if(product === null || product === undefined || (product as any[]).length === 0){
                return {
                    code: '0x002',
                    status: false,
                    sql: 'Error query, the product does not exist.'
                };
            }

            const newMovementQueryTex = `INSERT INTO inventory_movements (product_id, type, quantity, date, user_id) VALUES (?, ?, ?, ?, ?);`;
            const updateProductQueryText = `UPDATE products SET quantity = ? WHERE (id = ?);`;

            let newMovementQuantity: number = Number(product[0].quantity);
            let newMovementType: string = '';

            if(data.inventoryInput){
                //-- Ingreso
                newMovementQuantity += data.quantity;
                newMovementType = 'entrada';
            }else{
                //-- Salida
                if(Number(product[0].quantity) < data.quantity){
                    return {
                        code: '0x003',
                        status: false,
                        sql: 'Error query, the quantity of products being output is greater than the existing one.'
                    };
                }
                newMovementQuantity -= data.quantity;
                newMovementType = 'salida';
            }

            product[0].quantity = newMovementQuantity;

            const newMovement: any = await queryProcess(
                newMovementQueryTex, 
                connection, 
                [
                    data.productId,
                    newMovementType,
                    data.quantity,
                    new Date(),
                    data.userId,
                    newMovementQuantity,
                    data.productId
                ]
            );

            const updateProduct: any = await queryProcess(
                updateProductQueryText, 
                connection, 
                [
                    newMovementQuantity,
                    data.productId
                ]
            );

            console.log('JMORA[newMovement] => ', newMovement);
            console.log('JMORA[updateProduct] => ', updateProduct);

            return {
                code: 'OK',
                data: product[0],
                status: true
            };

        } catch(ex) {
            return {
                code: '0x004',
                status: false,
                sql: ex
            };
        } finally {
            if(connection) connection.end();
        }
    }

}