const router = require("express").Router();

let loyalty = require("../models/LoyaltyPoints"); 

router.route("/:id").get((req, res) => {
    const loyaltyId = req.params.id;
    loyalty.findOne({ customerId: loyaltyId })
        .then((loyalty) => {
            if (!loyalty) {
                return res.status(404).json({ error: "Loyalty not found" });
            }
            const points = loyalty.points;
            res.json({ points });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});


router.route("/update/:id").put(async(req,res)=>{
    try {
        const customerId = req.params.id;
        const { points } = req.body;

        const updatedDocument = await loyalty.findOneAndUpdate({ customerId }, { points }, { new: true });
        if (!updatedDocument) {
            return res.status(404).send({ status: "Document not found" });
        }
        res.status(200).send({ status: "Updated", updatedDocument });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Unsuccessful", error: err.message });
    }
});

module.exports = router;