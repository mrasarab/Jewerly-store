const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config();
const checkBlackLetter = require("../security/checkStrings");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.U,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const CheckUser = (req, res) => {
  const { email, password } = req.body;
  const allLetters = email + password;
  // check the inputs
  if (checkBlackLetter(allLetters)) return res.status(400).json({ message: "You cannot use these letters in username and password : " +  checkBlackLetter(allLetters)});
  if (validator.isEmpty(email) || validator.isEmpty(password)) {
    res.status(400).json({ message: "fields are empty" });
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Email is not valid" });
  }
  if (!validator.isAlphanumeric(password)) {
    res
      .status(400)
      .json({ message: "some of the inputs characters not allowed" });
  }

  // check the email in database
  const emailCheckQuery = "SELECT * FROM users WHERE email=?";
  conn.query(emailCheckQuery, [email], (error, emailCheckResult) => {
    if (error) {
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
    if (emailCheckResult.length === 0 || emailCheckResult.length > 1) {
      console.log(emailCheckResult);
      res.status(400).json({ message: "email is not valid" });
    }
    else {

      function createHash(password) {
        return crypto.createHash("sha256").update(password).digest("hex");
      }

      const hashed_password = createHash(password);
      if (emailCheckResult[0].password === hashed_password) {
        const payload = { email: email };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
          expiresIn: "1m",
        });
        const refreshToken = jwt.sign(payload,REFRESH_TOKEN_SECRET,{
          expiresIn: "2h",
        },);
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        res.status(200).json({ message: "you are loged in." });
      } else {
        res.status(400).json({ message: "password is incorrect!" });
      }
    }


  });
};

module.exports = CheckUser;
