const router = require("express").Router();
const Shipment = require("../models/shipment.js");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

// Multer configuration 
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
router.route("/displays").get((req,res)=>{

    Shipment.find().then((shipments)=>{
        res.json(shipments)
    }).catch((err)=>{
        console.log(err)
    })
})

//CURD - update
//http://localhost:8070/shipment/update/(:id)
//get data to update using id to identify the student
router.route("/update/:id").put(async(req,res)=>{
    let userId = req.params.id;
    //const name = req.body.name; can use this also
    const {shipment_ID, supplier_name, catogory, order_list, status} = req.body; //destructure

    //update data
    const updateShipment = {
        shipment_ID,
        supplier_name,
        catogory,
        order_list,
        ship_date,
        status
    }

    //if it has student in this database by id
    //(if use email, nic for primary key - findOne)
    await Shipment.findByIdAndUpdate(userId,updateShipment).then(()=>{
        res.status(200).send({status: "Shipment Updated"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data"});
    }) 

})

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
router.post("/sending", upload.single("file"), async (req, res) => {
    const { email, supplier_name, catogory } = req.body;
  
    try {
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
        path: path.join(__dirname, "../files", req.file.filename),
      };
  
      // Send email
      const info = await transporter.sendMail({
        to: email,
        subject: 'New Order Details',
        html: emailContent,
        attachments: [attachment]
      });
  
      console.log("Email sent: ", info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error("Error sending email: ", error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
  
  

module.exports = router;