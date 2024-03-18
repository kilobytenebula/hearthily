const router = require("express").Router();

let refund = require("../models/Refunds"); 

router.route("/add").post(async(req,res)=>{
    const { customerId,mobileNumber,orderId,reason,description,isSuccess} = req.body;

    const  newRefund = new refund({
        
        customerId,
        mobileNumber,
        orderId,
        reason,
        description,
       // paymentSlip,
        isSuccess
    })
    newRefund.save().then(()=>{
        res.json("Refund added")
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/:id").get((req, res) => {
    const refundId = req.params.id;

    refund.findById(refundId)
        .then((refund) => {
            if (!refund) {
                return res.status(404).json({ error: "refund not found" });
            }
            res.json(refund);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

router.route("/update/:id").put(async(req,res)=>{

    let refundId = req.params.id;
    const { customerId,mobileNumber,orderId,reason,description,isSuccess} = req.body;
    const  updateRefund= {
        
        customerId,
        mobileNumber,
        orderId,
        reason,
        description,
       // image,
        isSuccess
    }

    const update =await refund.findByIdAndUpdate(refundId, updateRefund )
    .then(()=>{
        res.status(200).send({status: "Updated"})
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status: "unsuccessfull"})
    })
})


module.exports = router;