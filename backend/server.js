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

//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



