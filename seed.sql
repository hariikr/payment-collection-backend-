-- Create the database (optional if already done)
CREATE DATABASE IF NOT EXISTS payment_collection;
USE payment_collection;

-- Create the `customers` table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    issue_date DATE,
    interest_rate DECIMAL(5,2),
    tenure INT,
    emi_due DECIMAL(10,2)
);

-- Insert sample data
INSERT INTO customers (account_number, password_hash, issue_date, interest_rate, tenure, emi_due)
VALUES ('1234567890', '$2b$10$rSFNYnJDwrETGOo1tzLaNu76CGCMaH/4cx98cbTBfhpPQo7jvEyu.', '2024-06-01', 12.5, 24, 5000.00);
