//const { Decimal128 } = require('mongodb');
const router = require("express").Router();
let Order = require("../models/Order");

router.route("/add").post((req,res)=>{
    const base_name = req.body.base_name;
    const portion_name = req.body.portion_name;
    const portion_size = req.body.portion_size;
    const qty = Number(req.body.qty);
    const date = new Date();
    const payment_method = req.body.payment_method;
    const total_amount = Number(req.body.total_amount);

    const newOrder = new Order({
        base_name,
        portion_name,
        portion_size,
        qty,
        date,
        payment_method,
        total_amount
    })
    
    newOrder.save().then(()=>{
        res.json("Order Added")
    }).catch((err)=>{
        console.log(err);
    })
})

router.route('/').get((req, res) => Order.find()
    .then(orders => res.json(orders))
    .catch(err => console.log(err))
);


router.route('/:orderId').get(async (req, res) => {
    let orderId = req.params.orderId;

    const order = await Order.findById(orderId)
        .then(order => res.status(200).send({ status: "Order fetched", order: order }))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/update/:orderId").put(async(req,res)=>{
    let orderId = req.params.orderId;
    const {base_name, portion_name, portion_size, qty, date, payment_method, total_amount, status} = req.body;

    const updateOrder = {
        base_name,
        portion_name,
        portion_size,
        qty,
        date,
        payment_method,
        total_amount
    }

    const update = await Order.findByIdAndUpdate(orderId, updateOrder)
    .then(()=>{
        res.status(200).send({status: "Order updated", order: update})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});
    })
})

router.route("/delete/:orderId").delete(async(req,res)=>{
    let orderId = req.params.orderId;

    await Order.findByIdAndDelete(orderId)
    .then(()=>{
      res.status(200).send({status: "Order deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user",error: err.message});
    })
})

router.get("/lastorder/lastid", async (req, res) => {
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

