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

router.route("/get/:id").get((req, res) => {
    const refundId = req.params.id;

    refund.findById(refundId)
        .then((refund) => {
            if (!refund) {
                return res.status(404).json({ error: "Refund not found" });
            }
            res.json(refund);
            console.log(refund);
        })
        .catch((err) => {
            console.error(err);
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

router.put('/refundEdit/:id', async (req, res) => {
    const { id } = req.params;
    const { mobileNumber, reason, description } = req.body; // Extract specific fields

    try {
        const existingRefund = await refund.findById(id);

        
        // Check if the status is pending, if so, don't update i
        const update = { mobileNumber, reason, description };
        // If status is not pending, update all fields
        const updatedRefund = await refund.findByIdAndUpdate(id, update, { new: true });
        res.json(updatedRefund);
    } catch (error) {
        console.error('Error updating refund:', error);
        res.status(500).json({ message: 'Internal Server Error', });
    }
});



module.exports = router;