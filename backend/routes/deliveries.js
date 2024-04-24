//Initialializing express router
const router = require("express").Router();
let Delivery = require("../models/Delivery");
let Feedback = require("../models/Feedback");
let Driver = require("../models/Driver");
let User = require("../src/Modal/User");

//CRUD starts here
//1. Create Route
router.route("/add").post((req, res) => {
  // Get data from the request body
  const { orderId, userId, paymentMethod } = req.body;
  const deliveryStatus = "of-delivery";
  const driverId = null;

  // Create a new Delivery object
  const newDelivery = new Delivery({
    orderId,
    userId,
    driverId,
    paymentMethod,
    deliveryStatus,
    date: new Date(),
  });

  // Save the new Delivery object to the database
  newDelivery
    .save()
    .then((delivery) =>
      res.status(200).send({ status: "Delivery added", delivery: delivery })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

//2a. Read Route
router.route("/").get((req, res) =>
  Delivery.find()
    .then((deliveries) => res.json(deliveries))
    .catch((err) => console.log(err))
);

//2b. Read Specific Route
router.route("/:id").get(async (req, res) => {
  let deliveryId = req.params.id;

  const delivery = await Delivery.findById(deliveryId)
    .then((delivery) =>
      res.status(200).send({ status: "Delivery fetched", delivery: delivery })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

//2c. Read Specific Driver Route
router.route("/driver/:id").get(async (req, res) => {
  try {
    const driverId = req.params.id;

    // Find deliveries for the given driverId
    const driverDeliveries = await Delivery.find({ driverId: driverId });

    // Filter completed deliveries
    const completedDeliveries = driverDeliveries.filter(
      (delivery) => delivery.deliveryStatus === "completed"
    );
    let currentDeliveryId;
    // Find the date of the last completed delivery
    const lastCompletedDelivery =
      completedDeliveries.length > 0
        ? new Date(
            completedDeliveries[completedDeliveries.length - 1].date
          ).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : null;

    // Find current delivery ID if the driver isn't available
    const driverInfo = await Driver.findById(driverId);
    if (driverInfo && !driverInfo.isAvailable) {
      const currentDelivery = driverDeliveries.find(
        (delivery) => delivery.deliveryStatus === "on-delivery"
      );
      currentDeliveryId = currentDelivery
        ? currentDelivery._id
        : "Not Available";
    }

    // Extract orderId from each delivery and fetch corresponding feedback
    const driverDataPromises = driverDeliveries.map(async (delivery) => {
      const orderId = delivery.orderId;

      // Find corresponding user for the delivery
      const user = await User.findById(delivery.userId);

      // Combine first name and last name
      const cusName = user ? `${user.name}` : "Unknown";
      const cusLocation = user ? `${user.address}` : "Unknown";

      // Find feedback for the delivery
      const driverFeedback = await Feedback.findOne({ orderId: orderId });

      // Return combined data with rating
      return {
        delivery: {
          ...delivery.toObject(), // Convert Mongoose object to plain JavaScript object
          cusName,
          cusLocation,
          rating: driverFeedback ? driverFeedback.rating : null, // Extracting rating if feedback exists
        },
      };
    });

    // Wait for all promises to resolve
    const driverData = await Promise.all(driverDataPromises);

    res.status(200).json({
      status: "Driver data fetched",
      driverData: driverData,
      lastCompletedDelivery: lastCompletedDelivery,
      currentDeliveryId: currentDeliveryId,
    });
  } catch (error) {
    res.status(400).json({ status: "Error", message: error.message });
  }
});

//3. Update Route
router.route("/:id").put(async (req, res) => {
  let deliveryId = req.params.id;
  const { driverId, deliveryStatus } = req.body;

  const updateDelivery = {
    driverId,
    deliveryStatus,
    date: new Date(),
  };

  await Delivery.findByIdAndUpdate(deliveryId, updateDelivery)
    .then(() => res.status(200).send({ status: "Delivery updated" }))
    .catch((err) =>
      res
        .status(500)
        .send({ status: "Error with updating data", error: err.message })
    );
});

//4. Delete Route
router.route("/:id").delete(async (req, res) => {
  let deliveryId = req.params.id;
  await Delivery.findByIdAndDelete(deliveryId)
    .then(() => res.status(200).send({ status: "Delivery deleted" }))
    .catch((err) =>
      res
        .status(500)
        .send({ status: "Error with deleting delivery", error: err.message })
    );
});
//CRUD ends here

//export the router
module.exports = router;
