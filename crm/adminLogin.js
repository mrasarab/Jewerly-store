const jwt = require("jsonwebtoken");
const validator = require("validator");
const checkBlackLetter = require("../security/checkStrings");
const dotenv = require("dotenv");

dotenv.config();

const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;

const ADMIN_UNIQUE_USERNAME = process.env.ADMIN_UNIQUE_USERNAME;
const ADMIN_UNIQUE_PASSWORD = process.env.ADMIN_UNIQUE_PASSWORD;

const CheckAdmin = (req, res) => {
  const { username, password } = req.body;
  if (checkBlackLetter(username)) return res.status(400).json({ message: "You cannot use these letters in username : " +  checkBlackLetter(username)});
  if (checkBlackLetter(password)) return res.status(400).json({ message: "You cannot use these letters in password : " +  checkBlackLetter(password)});

  // check the inputs
  if (validator.isEmpty(username) || validator.isEmpty(password)) {
    res.status(400).json({ message: "fields are empty" });
  }

  if (
    username === ADMIN_UNIQUE_USERNAME &&
    password === ADMIN_UNIQUE_PASSWORD
  ) {
    const payload = { username: username };
    const adminAccessToken = jwt.sign(payload, ADMIN_ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    const adminRefreshToken = jwt.sign(payload, ADMIN_REFRESH_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    res.cookie("adminAccessToken", adminAccessToken);
    res.cookie("adminRefreshToken", adminRefreshToken);
    res.status(200).json({ message: "Admin Welcome" });
  } else {
    res.status(400).json({ message: "Username or Password is incorrect" });
  }
};

module.exports = CheckAdmin;
