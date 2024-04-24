const router = require("express").Router();
const moment = require('moment-timezone');
let payment = require("../models/orderPayments"); 

router.route("/add").post(async(req,res)=>{
    const { orderId,customerId,amount,paymentMethod,address,phoneNumber,paymentSlip,isSuccess} = req.body;
    const currentDate = moment().utc();
    const  newPayment = new payment({
        orderId,
        customerId,
        amount,
        date :currentDate,
        paymentMethod,
        address,
        phoneNumber,
       paymentSlip,
        isSuccess
    })
    newPayment.save().then(()=>{
        res.json("payment added")
    }).catch((err)=>{
        console.log(err)
    })


})

router.route("/").get((req, res) => {
    payment.find()
        .then((payments) => {
            res.json(payments);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

router.route("/:customerId").get((req, res) => {
    const loggedCustomerId = req.params.customerId;
    payment.find({ customerId: loggedCustomerId })
        .then((payments) => {
            res.json(payments);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

router.route("/update/:orderId").put(async(req,res)=>{
    const orderId = req.params.orderId;
    const { isSuccess } = req.body;

    try {
        const updatedPayment = await payment.findOneAndUpdate(
            { orderId: orderId }, // Find the document with the given orderId
            { isSuccess: isSuccess }, // Update isSuccess field
            { new: true } // Return the updated document
        );

        if (updatedPayment) {
            res.status(200).send({ status: "Updated", payment: updatedPayment });
        } else {
            res.status(404).send({ status: "Not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Unsuccessful" });
    }
});
router.route("/get/:orderId").get((req, res) => {
    const orderId = req.params.orderId;
    payment.find({ orderId: orderId })
        .then((payments) => {
            res.json(payments);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});
module.exports = router;