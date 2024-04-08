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

// payment Db connection
const DB_NAME = "hearthily_db";
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

const ordereRouter = require("./routes/orders.js");
app.use("/order",ordereRouter);

const baseRouter = require("./routes/bases.js");
app.use("/base",baseRouter);

const portionRouter = require("./routes/portions.js");
app.use("/portion",portionRouter);

const loyaltyRouter = require("./routes/loyalty.js");
app.use("/points", loyaltyRouter)

const userRouteer = require("./routes/user.js");
app.use("/user", userRouteer);

app.listen(PORT,() => {
    console.log(`up and running on ${PORT}`)
})
