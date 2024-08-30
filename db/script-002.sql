-- Insert example statuses
INSERT INTO user_status (status_name) VALUES ('active'), ('disabled'), ('locked');

-- Insert example users
INSERT INTO users (username, role, status_id) VALUES 
('admin_user', 'Administrador', 1),
('employee_user', 'Empleado', 1),
('locked_user', 'Empleado', 3);

-- Insert example products
INSERT INTO products (name, description, quantity, price) VALUES 
('Laptop Azus', 'Lapop Gamer', 10, 4500000),
('Mouse Logitech', 'Wireless Mouse Logitech', 50, 575000),
('Keyboard Logitech', 'Mechanical keyboard Logitech', 30, 745000);

-- Insert example inventory movements
INSERT INTO inventory_movements (product_id, type, quantity, user_id) VALUES 
(1, 'entrada', 5, 1),
(2, 'salida', 10, 2),
(3, 'entrada', 15, 1),
(1, 'salida', 2, 2),
(2, 'entrada', 20, 1);