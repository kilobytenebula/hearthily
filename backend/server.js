const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

//defining port numbers
const PORT = process.env.PORT || 8070;
app.use(cors());
app.use(bodyParser.json());

//connecting to the database
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    //useCreateIndex: true,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false
});


const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection success!");
});

//importing the routes
const driverRouter = require('./routes/drivers.js');
app.use('/driver', driverRouter);

const feedbackRouter = require('./routes/feedbacks.js');
app.use('/feedback', feedbackRouter);

const deliveryRouter = require('./routes/deliveries.js');
app.use('/delivery', deliveryRouter);

const paymentRouter = require("./routes/orderPayments.js")
app.use("/payment", paymentRouter)

const refundRouter = require("./routes/refunds.js");
app.use("/refund", refundRouter)

const orderRouter = require("./routes/orders.js");
app.use("/order",orderRouter);

const baseRouter = require("./routes/bases.js");
app.use("/base",baseRouter);

const portionRouter = require("./routes/portions.js");
app.use("/portion",portionRouter);

const loyaltyRouter = require("./routes/loyalty.js");
app.use("/points", loyaltyRouter)

const userRouteer = require("./routes/user.js");
app.use("/user", userRouteer);

//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
