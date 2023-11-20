const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const { error } = require("console");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const checkBlackLetter = require("../security/checkStrings");

const HOST = process.env.HOST;
const U = process.env.U;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
function createHash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

var conn = mysql.createConnection({
  host: HOST,
  user: U,
  password: PASSWORD,
  database: DATABASE,
});

const NewUser = (req, res) => {
  const { email, username, password } = req.body;
  if (checkBlackLetter(req.body)) return res.status(400).json({ message: "You cannot use these letters in email and username and password : " +  checkBlackLetter(req.body)});
  if (
    validator.isEmpty(email) ||
    validator.isEmpty(username) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).json({ message: "some of inputs are empty" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "email is incorrect" });
  }

  if (
    !validator.isAlphanumeric(username) ||
    !validator.isAlphanumeric(password)
  ) {
    return res
      .status(400)
      .json({ message: "some of the inputs characters not allowed" });
  }

  const email_check = "SELECT * FROM users WHERE email = ?";
  conn.query(email_check, [email], (error, emailCheckResult) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
    if (emailCheckResult.length > 0) {
      return res.status(400).json({
        message:
          "This email is already in use. Please choose a different email!",
      });
    } else {
      const hashed_password = createHash(password);
      const insert =
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
      conn.query(insert, [email, username, hashed_password], (error) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ message: "An error occurred. Please try again later." });
        }
        const payload = { email: email };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
          expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload,REFRESH_TOKEN_SECRET,{
          expiresIn: "2h",
        });
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        return res.status(200).json({
          message: "New user created.",
        });
      });
    }
  });
};

module.exports = NewUser;
