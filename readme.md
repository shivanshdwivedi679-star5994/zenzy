# Clothing Shopper POS - Frontend Handoff

## For the MySQL Database Team
Please create the following tables to match the frontend state:
1. `products` (id, name, price, sku, category)
2. `orders` (order_id, cashier_id, subtotal, tax, total_amount, timestamp)
3. `order_items` (order_id, product_id, quantity, price_at_time_of_sale)

## For the Java Backend Team
The frontend is expecting two REST API endpoints running on `localhost:8080`:
* **GET `/api/products`**: Must return a JSON array of product objects to populate the grid.
* **POST `/api/checkout`**: Must accept a JSON object containing the `cart` array and `financials` object, and return a success status.
*