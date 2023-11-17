const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.U,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});





const data = (req, res) => {
    const { sex, category } = req.body();
    if (!sex || !category) {
        res.status(400).json({ message: "sex and category must enter" });
    }
    const search_query = "SELECT * FROM products WHERE (sex, category) VALUES (?, ?)";
    conn.query(search_query, [sex, category], (err, results) => {
        if (err) {
            res
              .status(500)
              .json({ message: err.message });
        }
        if (!results) {
            res.status(400).json({ message: "there is no product with these sex and category" });
        }
        res.json({ products: results });
    })
}

module.exports = data;