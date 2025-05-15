# Food Delivery Application - Interactive DBMS with MySQL

## Project Overview

This project is a **Food Delivery Application** that primarily focuses on an **Interactive Database Management System (DBMS)** using **MySQL**. The application is designed to streamline the process of ordering food, managing menus, tracking orders, and handling deliveries efficiently.

## Key Features

* User Registration and Login
* Menu Management
* Order Placement and Tracking
* Delivery Status Updates
* Real-time Sales Reporting
* Database Integration with MySQL

## Tech Stack

* **Frontend:** React, Next.js, Radix UI, Recharts
* **Backend:** Node.js
* **Database:** MySQL
* **Libraries:** mysql2/promise, uuid

## ER Diagram

The project follows a structured relational database design with the following key relationships:

* **User - Orders:** One-to-Many
* **Orders - OrderItems:** One-to-Many
* **Menu - OrderItems:** One-to-Many
* **Orders - Delivery:** One-to-One

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/username/FoodBase.git
   cd FoodBase
   cd app
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure the database:

   * Update the database configuration in `config/db.js`.
4. Run the application:

   ```bash
   npm run dev
   ```

## Database Setup

1. Start MySQL Server.
2. Import the initial database schema:

   ```sql
   source db/init.sql;
   ```
3. Verify the tables:

   ```sql
   SHOW TABLES;
   ```

## Usage

* Access the application at `http://localhost:3000`.
* Register as a user and log in.
* Browse the menu, place orders, and track deliveries.
* Admins can add, update, or remove menu items.

## Future Enhancements

* Integrate payment gateways for seamless transactions.
* Add mobile application support.
* Implement advanced reporting for detailed analytics.

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

This project is licensed under the MIT License.
