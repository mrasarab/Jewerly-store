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


const showBasketOfUser = async (req,res) => {
    const email = await verifyUserTokenWithEmailReturn(req, res);

    const checkBasketQuery = "SELECT * FROM baskets WHERE email = ?";

    conn.query(checkBasketQuery,[email],(err,result) => {
        if (err) return res.status(401).json({Message : err.message});

        if(result.length===0) return res.status(200).json({message: "no product is in basket"});
        return res.status(200).json({result:result});
        
    })

}

