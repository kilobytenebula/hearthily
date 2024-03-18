const router = require("express").Router();

let payment = require("../models/OrderPayments"); 

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

router.route("/").get((req, res) => {
    const loggedCustomerId = "60a9b5d6f2cf19454c18c71a";
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
    const { orderId,customerId,amount,date,paymentMethod,paymentSlip,isSuccess} = req.body;
    const  updatePaymanet= {
        orderId,
        customerId,
        amount,
        date,
        paymentMethod,
       // paymentSlip,
        isSuccess
    }

    const update = await payment.findByIdAndUpdate(userId, updatePaymanet )
    .then(()=>{
        res.status(200).send({status: "Updated"})
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status: "unsuccessfull"})
    })
})

module.exports = router;