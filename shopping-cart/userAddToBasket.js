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

const addProductToUserBasket = async (req, res) => {
  const email = await verifyUserTokenWithEmailReturn(req, res);

  const stringItemId = req.params["id"];
  const stringQuantity = req.params["quantity"];

  if (validator.isEmpty(itemId) || validator.isEmpty(quantity)) {
    return res.status(400).json({ message: "itemId or quantity is null." });
  }

  if (!validator.isNumeric(itemId) || !validator.isNumeric(quantity)) {
    return res.status(400).json({ message: "email is incorrect" });
  }

  const itemId = parseInt(itemId);
  const quantity = parseInt(quantity);

  const findProductQuery = "select * from products where itemId = ?";
  try {
    conn.query(findProductQuery, [itemId], (err, result) => {
      if (result.length === 0)
        return res.status(404).json({ message: "Product not found" });
      if (err) return res.status(500).json({ message: err.message });

      const priceOfOne = parseFloat(result[0].price).toFixed(2);
      const priceOfAll = quantity * priceOfOne;

      // check that the product maybe be in the basket
      const checkBasketForTheProduct =
        "SELECT * FROM baskets WHERE email = ? AND itemId = ?";
      conn.query(checkBasketForTheProduct, [email, itemId], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        // if its first time
        if (!result) {
          const addProductToBasketQuery =
            "INSERT INTO baskets (email, itemId, quantity, price) VALUES (?, ?, ?, ?)";
          conn.query(
            addProductToBasketQuery,
            [email, itemId, quantity, priceOfAll],
            (err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.status(200).json({
                message: `product with itemId: ${itemId} with ${quantity} quantity added to user:${email} basket `,
              });
            }
          );
          // update the quantity and price 
        } else {
          const updateQuantityOfProduct =
            "UPDATE baskets SET quantity = ?, price = ? WHERE email = ? AND itemId = ?";
          conn.query(
            updateQuantityOfProduct,
            [quantity, price, email, itemId],
            (err) => {
              if (err) return res.status(500).json({ message: err.message });
              return res.status(200).json({
                message: `product with itemId: ${itemId} with ${quantity} quantity updated for user:${email} basket `,
              });
            }
          );
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
