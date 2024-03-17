const router = require("express").Router();

let payment = require("../models/orderPayments"); 

router.route("/add").post(async(req,res)=>{
    const { orderId,customerId,amount,date,paymentMethod,paymentSlip,isSuccess} = req.body;

    const  newPayment = new payment({
        orderId,
        customerId,
        amount,
        date,
        paymentMethod,
        // paymentSlip,
        isSuccess
    })
    newPayment.save().then(()=>{
        res.json("payment added")
    }).catch((err)=>{
        console.log(err)
    })


})
module.exports = router;