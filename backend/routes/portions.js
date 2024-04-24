//const { Decimal128 } = require('mongodb');
const router = require("express").Router();
let Portion = require("../models/Portion");

router.route("/add").post((req,res)=>{
    const image_url = req.body.image_url;
    const portion_name = req.body.portion_name;
    const portion_type = req.body.portion_type;
    const price = Number(req.body.price);

    const newPortion = new Portion({
        image_url,
        portion_name,
        portion_type,
        price,
    })
    
    newPortion.save().then(()=>{
        res.json("Portion Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    Portion.find().then((portions)=>{
        res.json(portions)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/get/:id").get(async(req, res)=>{
    let portionId = req.params.id;
    const portion = await Portion.findById(portionId)
    .then((portion)=>{
        res.json(portion)
        res.status(200).send({status: "Portion fetched",portion})
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with get portion",error: err.message});
    })
})

module.exports = router;

