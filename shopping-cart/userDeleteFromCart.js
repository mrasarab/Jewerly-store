const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
var validator = require("validator");
const checkBlackLetter = require("../security/checkStrings");
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

const deleteProductFromCart = async (req, res) => {
  const email = await verifyUserTokenWithEmailReturn(req, res);
  const stringItemId = req.params["id"];
  
  if (checkBlackLetter(stringItemId)) return res.status(400).json({ message: "You cannot use these letters in ItemId : " +  checkBlackLetter(stringItemId)});
  if (validator.isEmpty(stringItemId)) {
    return res.status(400).json({ message: "itemId is null." });
  }

  if (!validator.isNumeric(stringItemId)) {
    return res.status(400).json({ message: "itemId is incorrect" });
  }

  const itemId = parseInt(stringItemId);

  try {
    const checkBasketQuery =
      "SELECT * FROM carts WHERE email = ? AND itemId = ?";

    const [basketResults] = await conn
      .promise()
      .query(checkBasketQuery, [email, itemId]);

    if (basketResults.length === 0) {
      return res
        .status(200)
        .json({ message: "This product is not in the basket." });
    }

    const currentQuantity = basketResults[0].quantity;
    const newQuantity = Math.max(0, currentQuantity - 1);

    const updateQuery =
      newQuantity === 0
        ? "DELETE FROM carts WHERE email = ? AND itemId = ?"
        : "UPDATE carts SET quantity = ? WHERE email = ? AND itemId = ?";

    await conn
      .promise()
      .query(
        updateQuery,
        newQuantity === 0 ? [email, itemId] : [newQuantity, email, itemId]
      );

    return res
      .status(200)
      .json({ message: `Quantity of the product is now: ${newQuantity}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteProductFromCart;
