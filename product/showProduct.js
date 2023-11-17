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
  const { sex, category } = req.body;

  if (!sex || !category) {
    return res
      .status(400)
      .json({ message: "Both sex and category must be provided" });
  }

  const search_query = "SELECT * FROM products WHERE sex = ? AND category = ?";

  conn.query(search_query, [sex, category], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({
          message: "No products found with the provided sex and category",
        });
    }

    return res.json({ products: results });
  });
};

module.exports = data;
