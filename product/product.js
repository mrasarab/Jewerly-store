const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
dotenv.config();
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const itemidUpdate = require("../additemnum");
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

const product = (req, res) => {
  const id = req.params["id"];
  const query = "select * from products where itemId = ?";
  try {
    conn.query(query, [id], (err, result) => {
        if (result.length === 0) return res.status(404).json({ message: "Product not found" });
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json({ result: result });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = product;
