const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL,{
    //useCreateIndex: true,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: true
});

const connection = mongoose.connection;
connection.once("open",() =>{
    console.log("Mongodb connection success!");
})

const baseRouter = require("./routes/bases.js");
app.use("/base",baseRouter);

const portionRouter = require("./routes/portions.js");
app.use("/portion",portionRouter);

const ordereRouter = require("./routes/orders.js");
app.use("/order",ordereRouter);

const feedbackRouter = require('./routes/feedbacks.js');
app.use('/feedback', feedbackRouter);

app.listen(PORT, () =>{
    console.log(`Server is up and running on port number: ${PORT}`)
})