const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8050;

app.use(cors());
app.use(bodyParser.json());


const DB_NAME = "payment_mgmt_db";
const URL = process.env.MONGODB_URL;

mongoose.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME
})

const connection = mongoose.connection;


connection.once("open", ()=>{
    console.log("connected");

})

const paymentRouter = require("./routes/orderPayments.js")
app.use("/payment", paymentRouter)

const refundRouter = require("./routes/refunds.js");
app.use("/refund", refundRouter)

app.listen(PORT,() => {
    console.log(`up and running on ${PORT}`)
})
