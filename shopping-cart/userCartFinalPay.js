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

const userCartFinalPay = async (req, res) => {
  try {
    const email = await verifyUserTokenWithEmailReturn(req, res);

    const [userAddressResult] = await conn
      .promise()
      .query("SELECT * FROM adress WHERE email = ?", [email]);

    if (!userAddressResult.length) {
      return res.status(404).json({ message: "User address not found" });
    }

    const userAddress = userAddressResult[0];

    const basketItemsQuery = `SELECT * FROM carts WHERE email = ?`;

    const [basketItemsResult] = await conn
      .promise()
      .query(basketItemsQuery, [email]);

    if (!basketItemsResult.length) {
      return res
        .status(404)
        .json({ message: "No items found in the user's cart" });
    }

    // Calculate the total amount to pay
    let totalAmount = 0;
    for (const item of basketItemsResult) {
      totalAmount += parseFloat(item.price); // Ensure item.price is converted to a number
    }

    return res.status(200).json({
      address: userAddress,
      totalAmount: totalAmount.toFixed(2),
      items: basketItemsResult.map((item) => ({ itemId: item.itemId })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



module.exports = userCartFinalPay;
