const router = require("express").Router();
let Inventory = require("../models/Inventory");

router.route("/add").post((req,res)=>{
    const ingrediant = req.body.ingrediant;
    const qty = Number(req.body.qty);

    const newInventory = new Inventory({
        ingrediant,
        qty
    })

    newInventory.save().then(()=>{
        res.json("Inventory added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    Inventory.find().then((inventories)=>{
        res.json(inventories)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route('/:inventoryId').get(async (req, res) => {
    let inventoryId = req.params.inventoryId;

    const inventory = await Inventory.findById(inventoryId)
        .then(inventory => res.status(200).send({ status: "Inventory record fetched", inventory: inventory }))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/update/:inventoryId").put(async(req,res)=>{
    let inventoryId = req.params.inventoryId;
    const {ingrediant,qty} = req.body;

    const updateInventory = {
        ingrediant,
        qty
    }

    const update = await Order.findByIdAndUpdate(inventoryId, updateInventory)
    .then(()=>{
        res.status(200).send({status: "Inventory updated", inventory: update})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});
    })
})

module.exports = router;