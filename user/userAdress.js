const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const { error } = require("console");
var validator = require("validator");
const jwt = require("jsonwebtoken");

const HOST = process.env.HOST;
const U = process.env.U;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

const { verifyUserTokenWithEmailReturn } = require("../security/tokenVerify");

var conn = mysql.createConnection({
  host: HOST,
  user: U,
  password: PASSWORD,
  database: DATABASE,
});



const addAddressToUser = async (req, res) => {
  try {
    const email = await verifyUserTokenWithEmailReturn(req, res);

    const {
      firstName,
      lastName,
      addressStreet,
      addressCity,
      addressZip,
      houseNr,
      mobile,
    } = req.body;

    
    if (!email || !firstName || !lastName || !addressStreet || !addressCity || !addressZip || !houseNr || !mobile) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const sql_query =
      "INSERT INTO adress (email, firstName, lastName, addressStreet, addressCity, addressZip, houseNr, mobile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    conn.query(
      sql_query,
      [
        email,
        firstName,
        lastName,
        addressStreet,
        addressCity,
        addressZip,
        houseNr,
        mobile,
      ],
      (error) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.status(201).json({
          message: `Address of user: ${email} added successfully`,
          address: {
            firstName,
            lastName,
            addressStreet,
            addressCity,
            addressZip,
            houseNr,
            mobile,
          },
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



module.exports = addAddressToUser;