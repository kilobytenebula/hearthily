const router = require("express").Router();
let Supplier = require("../models/supplier.js");

//(if you called, http://localhost:8070/supplier/add) - run create function
router.route("/add").post((req,res)=>{
    const supplier_name = req.body.supplier_name;
    const catogory = req.body.catogory;
    const address = req.body.address;
    const email = req.body.email;
    const phone_n = req.body.phone_n;
    const reg_date = req.body.reg_date;

    //create new object to save details of student
    const newSupplier = new Supplier({
        supplier_name,
        catogory,
        address,
        email,
        phone_n,
        reg_date
    })

    newSupplier.save().then(()=>{
        res.json("Supplier Added Successfully"); //if it save sucessfully, print this
    }).catch((err)=>{
        console.log(err); //if it save unsucessfully, print this
    })

})

//CURD - dispaly
//http://localhost:8070/supplier
router.route("/display").get(async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.catogory = category;
        }
        const suppliers = await Supplier.find(query);
        res.json(suppliers);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching suppliers");
    }
});




//CURD - update
//http://localhost:8070/supplier/update/(:id)
//get data to update using id to identify the student
router.route("/update/:id").put(async(req,res)=>{
    let userId = req.params.id;
    //const name = req.body.name; can use this also
    const {supplier_name, catogory, address, email, phone_n, reg_date} = req.body; //destructure

    //update data
    const updateSupplier = {
        supplier_name,
        catogory,
        address,
        email,
        phone_n,
        reg_date
    }

    //if it has student in this database by id
    //(if use email, nic for primary key - findOne)
    await Supplier.findByIdAndUpdate(userId,updateSupplier).then(()=>{
        res.status(200).send({status: "Supplier Updated"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data"});
    }) 

})

//CRUD - delete
//http://localhost:8070/supplier/delete/
router.route("/delete/:id").delete(async(req,res)=> {
    let userId = req.params.id;

    await Supplier.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "Supplier deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Erro with delete user"});
    })
});

//only get one user
router.route("/display/:id").get(async (req, res) => {
    let userId = req.params.id;
    const user = await Supplier.findById(userId).then((supplier) =>{
        res.status(200).send({status:"supplier fetchd",supplier});
    }).catch ((err) =>{
        console.log(err.message);
        res.status(500).send({status:"Error retrieving user by ID",error:err.message});
    }) 

});

module.exports = router;