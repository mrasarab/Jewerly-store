const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const multer = require("multer");



const cookieParser = require("cookie-parser");
const SignUp = require("./db/signUp");
const login = require("./db/login");
const adminLogin = require("./db/adminLogin");
const addProduct = require("./db/addProduct");
const { error } = require("console");
const addAdressToUser = require("./db/userAdress");
const updateAddressOfUser = require("./db/userModifyAddress");
const addProductToUserBasket = require("./db/userAddToBasket");
const { verifyAdminToken } = require("./db/tokenVerify");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

///////////////////////////////////////

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

//////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////

app.post("/addAdressToUser", (req, res) => {
    addAdressToUser(req, res);
      });

app.post("/updateAddressOfUser", (req, res) => {
  updateAddressOfUser(req, res);
      });
 

/////////////////////////////////////////

const data = require("./db/showProduct");
app.post("/showproducts", (req, res) => {
  data(req, res);
});

app.post("/addProductToUserBasket", (req,res) => {
  addProductToUserBasket(req,res);
});


const product = require("./db/product");
app.post("/product/:id", (req, res) => {
  product(req, res);
});

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.post("/register", (req, res) => {
  SignUp(req, res);
});

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/adminLogin", (req, res) => {
  adminLogin(req, res);
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
