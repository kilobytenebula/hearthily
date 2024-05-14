const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { filterOrdersByBaseType } = require("../utils/orderUtils"); // Import filterOrdersByBaseType
const { findOrdersByBaseName } = require("../utils/orderUtils"); // Import findOrdersByBaseName from the orderController

// Use the existing "orders" collection
// Pass an empty schema since the schema is already defined in the database

// Route to filter orders by base type
router.get("/orders", async (req, res) => {
  try {
    const baseType = req.query.base_type; // Extract base type from query parameter

    if (!baseType) {
      return res
        .status(400)
        .json({ error: true, message: "Base type is required" });
    }

    // Call the function to filter orders by base type
    const orders = await filterOrdersByBaseType(baseType);

    res.status(200).json({ error: false, orders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route to search orders by base name
router.get("/orders/search", async (req, res) => {
  try {
    const baseName = req.query.base_name; // Extract base name from query parameter

    if (!baseName) {
      return res
        .status(400)
        .json({ error: true, message: "Base name is required" });
    }

    // Call the function to search orders by base name
    const orders = await findOrdersByBaseName(baseName);

    res.status(200).json({ error: false, orders });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route to update order status by ID
/*router.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/

// Route to update order status by ID
// router.put("/orders/:id", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports = router;

