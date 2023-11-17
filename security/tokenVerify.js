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

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;
const ADMIN_UNIQUE_USERNAME = process.env.ADMIN_UNIQUE_USERNAME;

var conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.U,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

////////////////////////////////////////////////
const verifyUserToken = (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken && !refreshToken)
    return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decodedAccessToken) => {
    if (!decodedAccessToken) {
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        (err, decodedRefreshToken) => {
          if (!decodedRefreshToken)
            return res.status(401).json({ message: "Unauthorized" });
          const email = decodedRefreshToken.email;

          if (err)
            return res.status(403).json({ message: "you must first login" });
          const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
          conn.query(emailCheckQuery, [email], (error, emailCheckResult) => {
            if (error) {
              return res.status(500).json({ message: error.message });
            }

            if (emailCheckResult.length === 0 || emailCheckResult.length > 1) {
              return res.status(400).json({ message: "email is not valid" });
            }

            const payload = { email: email };
            const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
              expiresIn: "10m",
            });

            const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
              expiresIn: "2h",
            });
            res.cookie("accessToken", accessToken);
            res.cookie("refreshToken", refreshToken);
            next();
          });
        }
      );
    } else {
      const email = decodedAccessToken.email;

      if (err) return res.status(403).json({ message: "you must first login" });
      const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
      conn.query(emailCheckQuery, [email], (error, emailCheckResult) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        if (emailCheckResult.length === 0 || emailCheckResult.length > 1) {
          return res.status(400).json({ message: "email is not valid" });
        }
        next();
      });
    }
  });
};
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////

const verifyAdminToken = (req, res, next) => {
  const adminAccessToken = req.cookies.adminAccessToken;
  const adminRefreshToken = req.cookies.adminRefreshToken;
  if (!adminAccessToken && !adminRefreshToken)
    return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(
    adminAccessToken,
    ADMIN_ACCESS_TOKEN_SECRET,
    (err, accessDecodedAdminUsername) => {
      
      if (!accessDecodedAdminUsername) {
        jwt.verify(
          adminRefreshToken,
          ADMIN_REFRESH_TOKEN_SECRET,
          (err, refreshDecodedAdminUsername) => {
            if (!refreshDecodedAdminUsername)
              return res.status(401).json({ message: "Unauthorized" });
            if (err) return res.status(403).json({ message: "Forbidden" });
            
            if (
              refreshDecodedAdminUsername.username === ADMIN_UNIQUE_USERNAME
            ) {
              const payload = {
                refreshDecodedAdminUsername: refreshDecodedAdminUsername,
              };
              const adminAccessToken = jwt.sign(
                payload,
                ADMIN_ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "10m",
                }
              );
              const adminRefreshToken = jwt.sign(
                payload,
                ADMIN_REFRESH_TOKEN_SECRET,
                {
                  expiresIn: "2h",
                }
              );
              res.cookie("adminAccessToken", adminAccessToken);
              res.cookie("adminRefreshToken", adminRefreshToken);
              next();
            }
          }
        );
      } else {
        if (err) return res.status(403).json({ message: "Forbidden" });
        if (accessDecodedAdminUsername.username === ADMIN_UNIQUE_USERNAME) {
          next();
        }
      }
    }
  );
};
/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////
const verifyUserTokenWithEmailReturn = (req, res) => {
  return new Promise((resolve, reject) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      reject({ message: "Unauthorized" });
      return;
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decodedAccessToken) => {
      if (!decodedAccessToken) {
        jwt.verify(
          refreshToken,
          REFRESH_TOKEN_SECRET,
          (err, decodedRefreshToken) => {
            if (!decodedRefreshToken) {
              reject({ message: "Unauthorized" });
              return;
            }

            const email = decodedRefreshToken.email;

            if (err) {
              reject({ message: "you must first login" });
              return;
            }

            const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
            conn.query(emailCheckQuery, [email], (error, emailCheckResult) => {
              if (error) {
                reject({ message: error.message });
                return;
              }

              if (emailCheckResult.length === 0 || emailCheckResult.length > 1) {
                reject({ message: "email is not valid" });
                return;
              }

              resolve(email);
            });
          }
        );
      } else {
        const email = decodedAccessToken.email;

        if (err) {
          reject({ message: "you must first login" });
          return;
        }

        const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
        conn.query(emailCheckQuery, [email], (error, emailCheckResult) => {
          if (error) {
            reject({ message: error.message });
            return;
          }

          if (emailCheckResult.length === 0 || emailCheckResult.length > 1) {
            reject({ message: "email is not valid" });
            return;
          }

          resolve(email);
        });
      }
    });
  });
};
/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

module.exports = {
  verifyUserToken,
  verifyAdminToken,verifyUserTokenWithEmailReturn
};
