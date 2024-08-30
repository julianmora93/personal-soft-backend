export interface ProductInventoryMovementDTO {
    product_id: number;
    product_name: string;
    product_description: string;
    product_current_quantity: number;
    product_price: number;
    movement_id: number | null;
    movement_type: string | null;
    movement_quantity: number | null;
    movement_date: Date | null;
    user_id: number;
    user_name: string;
    user_role: string;
    user_status_id: number;
    user_status_name: string;
}