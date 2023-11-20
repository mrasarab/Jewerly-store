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

const addProductToUserCart = async (req, res) => {
  try {
    const email = await verifyUserTokenWithEmailReturn(req, res);

    const stringItemId = req.params["id"];
    const stringQuantity = req.params["quantity"];
    
    if (checkBlackLetter(stringItemId)) return res.status(400).json({ message: "You cannot use these letters in ItemId : " +  checkBlackLetter(stringItemId)});
    if (checkBlackLetter(stringQuantity)) return res.status(400).json({ message: "You cannot use these letters in Quantity : " +  checkBlackLetter(stringQuantity)});

    if (validator.isEmpty(stringItemId) || validator.isEmpty(stringQuantity)) {
      return res.status(400).json({ message: "itemId or quantity is null." });
    }

    if (
      !validator.isNumeric(stringItemId) ||
      !validator.isNumeric(stringQuantity)
    ) {
      return res.status(400).json({ message: "Invalid itemId or quantity" });
    }

    const itemId = parseInt(stringItemId);
    const quantity = parseInt(stringQuantity);

    if (isNaN(itemId) || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid itemId or quantity" });
    }

    const [productResult] = await conn
      .promise()
      .query("SELECT * FROM products WHERE itemId = ?", [itemId]);

    if (!productResult.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const priceOfOne = parseFloat(productResult[0].price).toFixed(2);
    const priceOfAll = quantity * priceOfOne;

    const [basketResult] = await conn
      .promise()
      .query("SELECT * FROM carts WHERE email = ? AND itemId = ?", [
        email,
        itemId,
      ]);

    if (!basketResult.length) {
      await conn
        .promise()
        .query(
          "INSERT INTO carts (email, itemId, quantity, price) VALUES (?, ?, ?, ?)",
          [email, itemId, quantity, priceOfAll]
        );
      return res.status(200).json({
        message: `Product with itemId: ${itemId} and quantity ${quantity} added to user's cart`,
      });
    }
    const oldQuantity = basketResult[0].quantity;
    const newQuantity = oldQuantity + quantity;
    await conn
      .promise()
      .query(
        "UPDATE carts SET quantity = ?, price = ? WHERE email = ? AND itemId = ?",
        [newQuantity, priceOfAll, email, itemId]
      );
    return res.status(200).json({
      message: `Product with itemId: ${itemId} updated to quantity ${newQuantity} in user's cart`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = addProductToUserCart;
