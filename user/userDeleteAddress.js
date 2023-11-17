const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const { error } = require("console");


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


const deleteAddressOfUser = async (req, res) => {
    try {
      const email = await verifyUserTokenWithEmailReturn(req, res);
  
      const sql_query = "DELETE FROM adress WHERE email = ?";
  
      conn.query(sql_query, [email], (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: `No address found for user: ${email}` });
        }
  
        return res.json({ message: `Address of user: ${email} deleted successfully` });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

module.exports = deleteAddressOfUser;
