const mongoose = require("mongoose");

// Function to filter orders by base type
const filterOrdersByBaseType = async (baseType) => {
    try {
        // Perform aggregation to filter orders by base type and pending status
        const orders = await mongoose.connection.db.collection("orders").aggregate([
            {
                $lookup: {
                    from: "bases",
                    localField: "base_name",
                    foreignField: "base_name",
                    as: "base_info"
                }
            },
            {
                $match: { 
                    "base_info.base_type": baseType,
                    "status": "pending"  // Add condition for pending status
                }
            }
        ]).toArray();

        return orders;
    } catch (error) {
        // Handle filtering error
        console.error("Error while filtering orders by base type:", error);
        throw error;
    }
};

// Function to search orders by base name and pending status
const findOrdersByBaseName = async (baseName) => {
    try {
        const orders = await mongoose.connection.db.collection("orders").find({ base_name: baseName, status: "pending" }).toArray();
        return orders;
    } catch (error) {
        console.error("Error while finding orders by base name:", error);
        throw error;
    }
};

module.exports = { filterOrdersByBaseType, findOrdersByBaseName };
