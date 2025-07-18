# Payment Collection App – Backend

This is the backend API for the Payment Collection App, built with Node.js, Express, and MySQL.  
It provides REST endpoints for customer loan details and EMI payments.

---

## **Table of Contents**
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment on AWS EC2](#deployment-on-aws-ec2)
- [Contact](#contact)

---

## **Features**
- REST API for customer and payment management
- Secure authentication (JWT)
- Input validation and error handling
- MySQL database integration
- CI/CD with GitHub Actions

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/payment-collection-backend.git
cd payment-collection-backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory:
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=payment_collection
JWT_SECRET=your_jwt_secret
```

---

## **Running Locally**

```bash
npm start
```
- The server will run on [http://localhost:5000](http://localhost:5000)

---

## **Environment Variables**

| Variable      | Description                        |
|---------------|------------------------------------|
| DB_HOST       | MySQL host (usually `localhost`)   |
| DB_USER       | MySQL username                     |
| DB_PASSWORD   | MySQL password                     |
| DB_NAME       | MySQL database name                |
| JWT_SECRET    | Secret for JWT token signing       |

---

## **Database Setup**

1. **Create the database and tables in MySQL:**
   ```sql
   CREATE DATABASE payment_collection;
   USE payment_collection;

   CREATE TABLE customers (
     id INT AUTO_INCREMENT PRIMARY KEY,
     account_number VARCHAR(20) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     issue_date DATE NOT NULL,
     interest_rate DECIMAL(5,2) NOT NULL,
     tenure INT NOT NULL,
     emi_due DECIMAL(10,2) NOT NULL
   );

   CREATE TABLE payments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     customer_id INT NOT NULL,
     payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
     payment_amount DECIMAL(10,2) NOT NULL,
     status VARCHAR(20) NOT NULL,
     FOREIGN KEY (customer_id) REFERENCES customers(id)
   );
   ```

2. **Seed with a test user (optional):**
   - Generate a password hash using Node.js:
     ```js
     const bcrypt = require('bcryptjs');
     bcrypt.hash('testpassword', 10).then(console.log);
     ```
   - Insert into customers:
     ```sql
     INSERT INTO customers (account_number, password_hash, issue_date, interest_rate, tenure, emi_due)
     VALUES ('1234567890', '<HASHED_PASSWORD>', '2024-07-18', 12.5, 24, 5000.00);
     ```

---

## **API Endpoints**

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | /customers                    | Get all customer loan details      |
| POST   | /payments                     | Make a payment                     |
| GET    | /payments/:account_number     | Get payment history for an account |

---

## **CI/CD Pipeline**

- **GitHub Actions** workflow is set up in `.github/workflows/backend.yml`.
- On every push or pull request to `main`/`master`, the following steps run:
  - Checkout code
  - Install dependencies
  - (Optional: run build and tests)

---

## **Deployment on AWS EC2**

1. **SSH into your EC2 instance:**
   ```bash
   ssh -i /path/to/key.pem ubuntu@your-ec2-public-dns
   ```
2. **Install Node.js, npm, git:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm git -y
   ```
3. **Clone the repo and install dependencies:**
   ```bash
   git clone https://github.com/yourusername/payment-collection-backend.git
   cd payment-collection-backend
   npm install
   ```
4. **Set up your `.env` file and start the server:**
   ```bash
   nano .env
   npm start
   ```
   Or use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start app.js --name backend
   pm2 save
   pm2 startup
   ```

---

## **Contact**
For any questions, contact:  
**Harikrishnan Aneesh**  
Email: harikrishnananish0@gmail.com.com

