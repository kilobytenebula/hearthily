const router = require("express").Router();

let refund = require("../models/Refunds"); 

router.route("/add").post(async(req,res)=>{
    const { customerId,mobileNumber,orderId,reason,description,image} = req.body;

    const  newRefund = new refund({
        
        customerId,
        mobileNumber,
        orderId,
        reason,
        description,
        image,
    })
    newRefund.save().then(()=>{
        res.json("Refund added")
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/").get((req, res) => {
    refund.find()
        .then((refunds) => {
            if (!refunds || refunds.length === 0) {
                return res.status(404).json({ error: "No refunds found" });
            }
            res.json(refunds);
            console.log(refunds);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});
router.route("/:customerId").get((req, res) => {
    const customerId = req.params.customerId;

    refund.find({ customerId: customerId })
        .then((refunds) => {
            if (!refunds || refunds.length === 0) {
                return res.status(404).json({ error: "No refunds found for the provided customer ID" });
            }
            res.json(refunds);
            console.log(refunds);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

router.route("/update/:id").put(async (req, res) => {
    const refundId = req.params.id;
    const { isSuccess } = req.body; // Only need isSuccess from req.body

    try {
        // Find the document with the matching refundId field
        const update = await refund.findOneAndUpdate({ orderId: refundId }, { isSuccess }, { new: true });
        if (update) {
            res.status(200).send({ status: "Updated" });
        } else {
            res.status(404).send({ status: "Refund not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Unsuccessful" });
    }
});

router.route("/delete/:id").delete((req, res) => {
    const refundId = req.params.id;

    refund.findOneAndDelete({ _id: refundId })
        .then((deletedRefund) => {
            if (deletedRefund) {
                res.status(200).send({ status: "Deleted" });
            } else {
                res.status(404).send({ status: "Refund not found" });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ status: "Unsuccessful" });
        });
});


module.exports = router;