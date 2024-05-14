const router = require("express").Router();
const Shipment = require("../models/shipment.js");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

/// Multer configuration 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./files"); // Destination directory for storing uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    }
    
});
  const upload = multer({ storage: storage });

//(if you called, http://localhost:8070/shipment/ship) - run create function
router.route("/ship").post(upload.single("file"), (req, res)=>{

    const supplier_name = req.body.supplier_name;
    const catogory = req.body.catogory;
    const email = req.body.email;
    const order_list = req.file.filename;
    const ship_date = req.body.ship_date;
    const status = req.body.status;

    //create new object to save details of shipment
    const newShipment = new Shipment({
        supplier_name,
        catogory,
        email,
        order_list,
        ship_date,
        status
    });

    newShipment.save().then(()=>{
        res.json("Shipment Added Successfully"); //if it save successfully, print this
    }).catch((err)=>{
        console.log(err); //if it save unsuccessfully, print this
        res.status(500).send("Failed to add shipment");
    })
});


//CURD - dispaly
//http://localhost:8070/shipment/displays
router.route("/shipments").get((req,res)=>{

    Shipment.find().then((shipments)=>{
        res.json(shipments)
    }).catch((err)=>{
        console.log(err)
    })
})

// Get shipments by status
router.route("/shipments/:status").get((req, res) => {
    const { status } = req.params;
    Shipment.find({ status })
      .then((shipments) => {
        res.json(shipments);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error fetching shipments by status");
      });
  });

//CURD - update
//http://localhost:8070/shipment/updates/(:id)
//get data to update using id to identify the student
router.route("/updates/:id").put(upload.single("file"), async(req, res) => {
    try {
        const userId = req.params.id;
        const { supplier_name, catogory, email, ship_date, delived_date, status } = req.body;
        let order_list = null;

        if (req.file) {
            order_list = req.file.filename;
        }

        // Find the shipment by ID and update its details
        const updatedShipment = await Shipment.findByIdAndUpdate(userId, {
            supplier_name,
            catogory,
            email,
            order_list,
            ship_date,
            delived_date,
            status
        });

        if (!updatedShipment) {
            return res.status(404).send({ status: "Shipment not found" });
        }

        return res.status(200).send({ status: "Shipment Updated" });
    } catch (error) {
        console.error("Error updating shipment:", error);
        return res.status(500).send({ status: "Error with updating shipment" });
    }
});


//CRUD - delete
//http://localhost:8070/shipment/delete/
router.route("/delete/:id").delete(async(req,res)=> {
    let userId = req.params.id;

    await Shipment.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "Shipment deleted"});
    }).catch((err) => {
        console.log(err,message);
        res.status(500).send({status: "Erro with delete Shipment"});
    })
})

//only get one user
router.route("/displays/:id").get(async(req,res) => {
    let userId = req.params.id;
    const user = await Shipment.findById(userId).then((shipment) => {
        res.status(200).send({status: "Shipment fetched", shipment})
    }).catch(() => {
        console.log(err.message);
        res.status(500).send({status: "Error with get Shipment", error: err.message});
    })
});



// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'indudunu22@gmail.com',
        pass: 'sskflgelcbmshrkx'
    }
});


// Route to send emails for order
router.post("/sending/:id", async (req, res) => {
    const { email, supplier_name, catogory } = req.body;
    const shipmentId = req.params.id;

    try {
        // Retrieve shipment details
        let shipment = await Shipment.findById(shipmentId);

        // Check if the shipment has already been sent
        if (shipment.status === "Sent Email") {
            return res.status(400).json({ error: "Email already sent to this supplier" });
        }

        // Email template
        const emailContent = `
            <p>Hello, ${supplier_name}</p>
            <p>You have a new order:</p>
            <p>Category: ${catogory}</p>
            <p>Please find the attached PDF for more details.</p>
            <p>Thank you!</p>
        `;

        // Attach PDF file
        const attachment = {
            filename: shipment.order_list,
            path: path.join(__dirname, "../files", shipment.order_list)
        };

        // Send email
        const info = await transporter.sendMail({
            from: {
                name: "Hearthily",
                address: 'indudunu22@gmail.com'
            },
            to: email,
            subject: 'New Order Details',
            html: emailContent,
            attachments: [attachment]
        });

        // Update shipment status to "sent"
        shipment.status = "Sending";
        await shipment.save();

        console.log("Email sent: ", info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

  
  

module.exports = router;