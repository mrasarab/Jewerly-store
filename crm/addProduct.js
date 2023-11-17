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

const addProduct = (req, res) => {
  const {
    sex,
    category,
    brand,
    name,
    price,
    availability,
    deliveryTime,
    tags,
  } = req.body;

  var { readItemId, updateItemId } = require("../additemnum");
  var itemId = readItemId();

  const sql_query =
    "INSERT INTO products (sex, category,itemId, brand, name, price, availability, deliveryTime, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  conn.query(
    sql_query,
    [
      sex,
      category,
      itemId,
      brand,
      name,
      price,
      availability,
      deliveryTime,
      tags,
    ],
    (error) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "An error occurred. Please try again later." });
      }

      // images upload

      const uploadedFile = req.file;
      if (!uploadedFile) {
        return res.status(400).json({ message: "there is no images." });
      }
      itemId += 1;
      updateItemId(itemId);
      res.json({ message: "Product added successfully" });
    }
  );
};

module.exports = addProduct;
