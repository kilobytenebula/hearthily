const router = require("express").Router();
let Inviter = require("../models/invitedsupplier.js");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');



//(if you called, http://localhost:8070/inviter/add) - run create function
router.route("/add").post((req,res)=>{
    const inviter_name = req.body.inviter_name;
    const email = req.body.email;
    const int_date = req.body.int_date;
    const status = req.body.status;

    //create new object to save details of inviters
    const newInviter = new Inviter({
        inviter_name,
        email,
        int_date,
        status
    })

    newInviter.save().then(()=>{
        res.json("Inviter Added Successfully"); //if it save sucessfully, print this
    }).catch((err)=>{
        console.log(err); //if it save unsucessfully, print this
    })

})

//CURD - dispaly
//http://localhost:8070/inviter
router.route("/invite").get((req,res)=>{

    Inviter.find().then((inviters)=>{
        res.json(inviters)
    }).catch((err)=>{
        console.log(err)
    })
})

//CRUD - delete
//http://localhost:8070/inviter/delete/
router.route("/delete/:id").delete(async(req,res)=> {
    let userId = req.params.id;

    await Inviter.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "Inviter deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Erro with delete Inviter"});
    })
});

//only get one user
router.route("/display/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await Inviter.findById(userId).then((inviter) =>{
        res.status(200).send({status:"Inviter fetchd",inviter});
    }).catch ((err) =>{
        console.log(err.message);
        res.status(500).send({status:"Error retrieving Inviter by ID",error:err.message});
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

// Route to send accepting or declining emails
router.post("/sending", async (req, res) => {
    const { email, inviterId, inviter_name } = req.body;

    try {
        // Generate unique tokens for acceptance and decline
        const acceptanceToken = uuidv4();
        const declineToken = uuidv4();

        // Include tokens in acceptance and decline links
        const acceptanceLink = `http://localhost:8070/inviter/accept/${inviterId}/${acceptanceToken}`;
        const declineLink = `http://localhost:8070/inviter/decline/${inviterId}/${declineToken}`;

        // Email content with acceptance and decline links
        const emailContent = `
            <p>Hello, ${inviter_name}</p>
            <p>You have been invited to join our company as a supplier.</p>
            <p>Please click the links below to accept or decline:</p>
            <p>Accept: <a href="${acceptanceLink}">${acceptanceLink}</a></p>
            <p>Decline: <a href="${declineLink}">${declineLink}</a></p>
            <p>Thank you!</p>
        `;

        // Send email with defined transport object
        await transporter.sendMail({
            from: {
                name: "Hearthily",
                address: 'indudunu22@gmail.com'
            },
            to: email,
            subject: "Invitation to Join Us",
            html: emailContent
        });

        // Send success response
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        // Send error response
        console.error(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Route to handle acceptance of invitation
router.post("/accept/:inviterId/:token", async (req, res) => {
    const { inviterId, token } = req.params;

    // Verify token and update invitation status
    try {
        // Find invitation by ID
        const invitation = await Inviter.findById(inviterId);

        // Check if token matches
        if (invitation && invitation.acceptanceToken === token) {
            // Update invitation status to accepted
            await Inviter.findByIdAndUpdate(inviterId, { status: 'Accepted' });
            // Return success response
            return res.status(200).json({ message: 'Invitation accepted successfully' });
        } else {
            // Return error response if token doesn't match
            return res.status(400).json({ error: 'Invalid token' });
        }
    } catch (error) {
        // Return error response if any error occurs
        console.error(error);
        return res.status(500).json({ error: 'Failed to accept invitation' });
    }
});

// Route to handle decline of invitation
router.post("/decline/:inviterId/:token", async (req, res) => {
    const { inviterId, token } = req.params;

    // Verify token and update invitation status
    try {
        // Find invitation by ID
        const invitation = await Inviter.findById(inviterId);

        // Check if token matches
        if (invitation && invitation.declineToken === token) {
            // Update invitation status to declined
            await Inviter.findByIdAndUpdate(inviterId, { status: 'Declined' });
            // Return success response
            return res.status(200).json({ message: 'Invitation declined successfully' });
        } else {
            // Return error response if token doesn't match
            return res.status(400).json({ error: 'Invalid token' });
        }
    } catch (error) {
        // Return error response if any error occurs
        console.error(error);
        return res.status(500).json({ error: 'Failed to decline invitation' });
    }
});



module.exports = router;