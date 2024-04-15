//export all packages to each variable
const express =require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

//to get port for run 
const PORT = process.env.PORT || 8070;

//(use is method)
app.use(cors());
app.use(bodyParser.json());

//to get database url to this
const URL = process.env.MONGODB_URL;

//database configration
mongoose.connect(URL,{
    //useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    //useFindAndModify:false
});

//connection to database
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongodb Connection Successfully!");
});

//to access supplier.js file in routes folder
const supplierRouter  = require("./routes/suppliers.js");
app.use("/supplier",supplierRouter);

//to access shipment.js file in routes folder

//to access inviter.js file in routes folder
const invitedsupplierRouter  = require("./routes/invitedsuppliers.js");
app.use("/inviter",invitedsupplierRouter);

//run in port number
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`)
});