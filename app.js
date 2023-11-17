const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const multer = require("multer");
const cookieParser = require("cookie-parser");
const { error } = require("console");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());



////////////// for Cart Manage
const addProductToUserCart = require("./shopping-cart/userAddToCart");
app.post("/addProductToUserCart/:id/:quantity", (req, res) => {
  addProductToUserCart(req, res);
});

const addSameProductToCart = require("./shopping-cart/userAddSameProductToCart");
app.post("/addSameProductToCart/:id", (req, res) => {
  addSameProductToCart(req, res);
});

const showCartOfUser = require("./shopping-cart/userCart");
app.get("/showCartOfUser", (req, res) => {
  showCartOfUser(req, res);
});

const userCartFinalPay = require("./shopping-cart/userCartFinalPay");
app.get("/userCartFinalPay", (req, res) => {
  userCartFinalPay(req, res);
});

const deleteProductFromCart = require("./shopping-cart/userDeleteFromCart");
app.post("/deleteProductFromCart/:id", (req, res) => {
  deleteProductFromCart(req, res);
});
 


////////// for show products
const product = require("./product/product");
app.get("/product/:id", (req, res) => {
  product(req, res);
});

const data = require("./product/showProduct");
app.get("/showproducts", (req, res) => {
  data(req, res);
});



/////// for user

const SignUp = require("./user/signUp");
app.post("/register", (req, res) => {
  SignUp(req, res);
});

const login = require("./user/login");
app.post("/login", (req, res) => {
  login(req, res);
});

const addAddressToUser = require("./user/userAdress");
app.post("/addAddressToUser", (req, res) => {
  addAddressToUser(req, res);
});

const updateAddressOfUser = require("./user/userModifyAddress");
app.post("/updateAddressOfUser", (req, res) => {
  updateAddressOfUser(req, res);
});

const deleteAddressOfUser = require("./user/userDeleteAddress");
app.post("/deleteAddressOfUser", (req, res) => {
  deleteAddressOfUser(req, res);
});

const showUserAddress = require("./user/showUserAddress");
app.get("/showUserAddress", (req, res) => {
  showUserAddress(req, res);
});


///////// for admin CRM
const CheckAdmin = require("./crm/adminLogin");
app.post("/adminLogin", (req, res) => {
  CheckAdmin(req, res);
});

//
const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    var { readItemId, updateItemId } = require("./additemnum");
    cb(null, `${readItemId()}--${Date.now()}--${file.originalname}`);
  },
});
const upload = multer({
  storage: storageEngine,
});
const { verifyAdminToken } = require("./security/tokenVerify");
const addProduct = require("./crm/addProduct");
app.post("/addproduct", (req, res, next) => {
  verifyAdminToken(req, res, () => {
    upload.single("images")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image" });
      }
      addProduct(req, res);
    });
  });
});
//



app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
