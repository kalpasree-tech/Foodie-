const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shari@8296",
    database: "foodie"
});

db.connect((error) => {

    if (error) {
        console.log("MySQL connection failed!");
        console.log(error.message);
        return;
    }

    console.log("MySQL connected successfully!");
});


app.get("/", (req, res) => {
    res.send("Foodie Backend is Working!");
});
app.post("/orders", (req, res) => {

    const {
        name,
        phone,
        address,
        city,
        pincode,
        paymentMethod,
        subtotal,
        deliveryCharge,
        discount,
        total
    } = req.body;

    const sql = `
        INSERT INTO orders
        (customer_name, phone, address, city, pincode,
         payment_method, subtotal, delivery_charge, discount, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            phone,
            address,
            city,
            pincode,
            paymentMethod,
            subtotal,
            deliveryCharge,
            discount,
            total
        ],
        (error, result) => {

            if (error) {
                console.log(error);
                res.status(500).json({
                    message: "Failed to save order"
                });
                return;
            }

            res.json({
                message: "Order saved successfully!",
                orderId: result.insertId
            });
        }
    );
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});