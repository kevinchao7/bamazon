-- Create a MySQL Database called bamazon.
-- Then create a Table inside of that database called products.
-- The products table should have each of the following columns:
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)
-- Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(32) NOT NULL,
    department_name VARCHAR(32)NOT NULL,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Samsung Galaxy S8", "Electronics", 720,100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Iphone 7", "Electronics", 650,100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Nintendo Switch", "Electronics", 300,25);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("1More Triple Driver Earbuds", "Electronics", 100,10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Fender Stratocaster", "Instruments", 400,5);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Musicman Bass", "Instruments", 1600,8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Gibson Les Paul", "Instruments", 1000,7);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Basketball", "Sports", 25,100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("DLX Luxe OLED Ice paintball marker", "Sports", 1700,10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Planet Eclipse Geo 3.5 paintball marker", "Sports", 1400,10);

CREATE TABLE departments(
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(32)NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,over_head_costs)
VALUE ("Electronics", 5000);
INSERT INTO departments (department_name,over_head_costs)
VALUE ("Sports", 5000);
INSERT INTO departments (department_name,over_head_costs)
VALUE ("Instruments", 1000);
