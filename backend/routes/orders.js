//const { Decimal128 } = require('mongodb');
const router = require("express").Router();
let Order = require("../models/Order");

router.route("/add").post((req,res)=>{
    const base_name = req.body.base_name;
    const portion_name = req.body.portion_name;
    const portion_size = req.body.portion_size;
    const qty = Number(req.body.qty);
    const date = new Date();
    const total_amount = Number(req.body.total_amount);
    const status = req.body.status;

    const newOrder = new Order({
        base_name,
        portion_name,
        portion_size,
        qty,
        date,
        total_amount,
        status
    })
    
    newOrder.save().then((order)=>{
        res.json({ message: "Order Added", orderId: order._id });
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req,res)=>{
    Order.find().then((orders)=>{
        res.json(orders)
    }).catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:orderid").put(async(req,res)=>{
    let orderId = req.params.orderid;
    const {base_name, portion_name, portion_size, qty, date, total_amount,status} = req.body;

    const updateOrder = {
        base_name,
        portion_name,
        portion_size,
        qty,
        date,
        total_amount,
        status
    }

    const update = await Order.findByIdAndUpdate(orderId, updateOrder)
    .then(()=>{
        res.status(200).send({status: "Order updated", order: update})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});
    })
})

router.route("/delete/:orderid").delete(async(req,res)=>{
    let orderId = req.params.orderid;

    await Order.findByIdAndDelete(orderId)
    .then(()=>{
      res.status(200).send({status: "Order deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user",error: err.message});
    })
})

// Route to get the ID of the last added order
router.get("/lastid", async (req, res) => {
    try {
        const lastOrder = await Order.findOne().sort({ _id: -1 });
        if (!lastOrder) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json({orderId: lastOrder._id});
    } catch (error) {
        console.error("Error fetching last order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;

