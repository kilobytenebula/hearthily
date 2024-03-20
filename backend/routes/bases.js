//const { Decimal128 } = require('mongodb');
const router = require("express").Router();
let Base = require("../models/Base");

router.route("/add").post((req,res)=>{
    const base_name = req.body.base_name;
    const base_type = req.body.base_type;
    const reg_price = Number(req.body.reg_price);
    const full_price = Number(req.body.full_price);

    const newBase = new Base({
        base_name,
        base_type,
        reg_price,
        full_price,
    })
    
    newBase.save().then(()=>{
        res.json("Base Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    Base.find().then((bases)=>{
        res.json(bases)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/get/:id").get(async (req, res) => {
    try {
        const baseId = req.params.id;
        const base = await Base.findById(baseId);
        if (!base) {
            return res.status(404).json({ status: "Base not found" });
        }
        console.log(base);
        res.status(200).json({ status: "Base fetched", base });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "Error with get base", error: err.message });
    }
});



module.exports = router;

