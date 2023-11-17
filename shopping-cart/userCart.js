const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
var validator = require("validator");

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

const showCartOfUser = async (req, res) => {
  try {
    const email = await verifyUserTokenWithEmailReturn(req, res);
    const checkBasketQuery =
      "SELECT itemId, quantity FROM carts WHERE email = ?";

    const [basketResults] = await conn
      .promise()
      .query(checkBasketQuery, [email]);

    if (basketResults.length === 0) {
      return res.status(200).json({ message: "No product is in the basket." });
    }

    const formattedResults = basketResults.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
    }));

    return res.status(200).json({ basketItems: formattedResults });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = showCartOfUser;
