import { ProductInventoryMovementDTO } from "../dto/product.inventory.movement.dto";
import { ProductEntity } from "./products.entity";
import { UserEntity } from "./users.enttity";

export interface InventoryMovementEntity {
    id: number;
    product: ProductEntity;
    type: string;
    quantity: number;
    date: Date;
    user: UserEntity;
}

export const parseMovements = (data: ProductInventoryMovementDTO[]): InventoryMovementEntity[] | null => {
    if(data.length == 0) return null;

    const newData = data.map(item => {
        const newMovement: InventoryMovementEntity = {
            id: item.movement_id!,
            type: item.movement_type!,
            quantity: item.movement_quantity!,
            date: item.movement_date!,
            product: {
                id: item.product_id,
                name: item.product_name,
                price: item.product_price,
                quantity: item.product_current_quantity,
                description: item.product_description
            },
            user: {
                id: item.user_id,
                role: item.user_role,
                username: item.user_name,
                status: {
                    id: item.user_status_id,
                    statusName: item.user_status_name
                }
            }
        };
        return newMovement;
    });
    return newData;
}