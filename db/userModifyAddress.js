const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const { error } = require("console");


const HOST = process.env.HOST;
const U = process.env.U;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

const { verifyUserTokenWithEmailReturn } = require("./tokenVerify");

var conn = mysql.createConnection({
  host: HOST,
  user: U,
  password: PASSWORD,
  database: DATABASE,
});

const updateAddressOfUser = async (req, res) => {
  try {
    const email = await verifyUserTokenWithEmailReturn(req, res);

    const updates = req.body; // Object containing fields to update and their new values

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "addressStreet",
      "addressCity",
      "addressZip",
      "houseNr",
      "mobile"
    ];

    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({
          message: `Invalid field(s) to update: ${invalidFields.join(", ")}`,
        });
    }

    let sql_query = "UPDATE adress SET ";
    const params = [];
    const fields = Object.keys(updates);

    fields.forEach((field, index) => {
      sql_query += `${field}=?`;
      params.push(updates[field]);
      if (index !== fields.length - 1) {
        sql_query += ", ";
      }
    });

    sql_query += " WHERE email=?";
    params.push(email);

    conn.query(sql_query, params, (error) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: `Address of user: ${email} updated successfully` });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = updateAddressOfUser;
