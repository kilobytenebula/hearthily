const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');

//defining port numbers
const PORT = process.env.PORT || 3500;
app.use(cors());
app.use(bodyParser.json());

//connecting to the database
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {});


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

//to access supplier.js file in routes folder
const supplierRouter  = require("./routes/suppliers.js");
app.use("/supplier",supplierRouter);

//to access shipment.js file in routes folder
const shipmentRouter  = require("./routes/shipments.js");
app.use("/shipment",shipmentRouter);

//to access inviter.js file in routes folder
const invitedsupplierRouter  = require("./routes/invitedsuppliers.js");
app.use("/inviter",invitedsupplierRouter);

const inventoryRouter = require("./routes/inventories.js");
app.use("/inventory",inventoryRouter);

const AuthRoute = require('./src/routes/AuthRoute');
app.use('/api/v1/auth', AuthRoute);

const EmpRoute = require('./src/routes/EmpRoute');
app.use('/api/v1/employee',EmpRoute);

app.use(cookieParser());

//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
