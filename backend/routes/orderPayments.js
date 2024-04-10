const router = require("express").Router();
const moment = require('moment-timezone');
let payment = require("../models/OrderPayments"); 

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
       // paymentSlip,
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

router.route("/update/:id").put(async(req,res)=>{

    let userId = req.params.id;
    const { orderId,customerId,amount,date,paymentMethod,phoneNumber,paymentSlip,isSuccess} = req.body;
    const  updatePaymanet= {
        orderId,
        customerId,
        amount,
        date,
        paymentMethod,
        address,
        phoneNumber,
       // paymentSlip,
        isSuccess
    }

    const update =await payment.findByIdAndUpdate(userId, updatePaymanet )
    .then(()=>{
        res.status(200).send({status: "Updated"})
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status: "unsuccessfull"})
    })
})

module.exports = router;