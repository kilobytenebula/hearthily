const router = require('express').Router();
const Kitchenbases = require('../models/KitchenBase');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname); // Define how file names will be saved
    }
  });
  
  const upload = multer({ storage: storage });

// Upload base image
router.post("/upload/base", upload.single('Kitchenbases'), (req, res) => {
    res.json({
        success: 1,
        message: "Base image uploaded successfully",
        image_url: `http://localhost:3500/images/${req.file.filename}`
    });
});

// Add base
router.post('/addbase', async (req, res) => {
    let bases = await Kitchenbases.find({});
    let id;
    if(bases.length > 0) 
    {
        let last_base_array =bases.slice(-1);
        let last_base= last_base_array[0];
        id=last_base.id+1;
    }
    else{
        id=1;
    }
    const base = new Kitchenbases({
        id: id,
        name: req.body.name,
        category: req.body.category,
        m_type: req.body.m_type,
        reg_price: req.body.reg_price,
        full_price: req.body.full_price,
    });
    console.log(base);
    await base.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    });
});

// Remove base
router.post('/removebase', async (req, res) => {
    await Kitchenbases.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({ 
        success: true, 
        name: req.body.name 
    });
});

// Get all bases
router.get('/allbases', async (req, res) => {
    let bases = await Kitchenbases.find({});
    console.log("All bases Fetched");
    res.send(bases);
});


// Get orders by base type
router.get('/orders/type/:baseType', async (req, res) => {
    const baseType = req.params.baseType;

    try {
        const orders = await filterOrdersByBaseType(baseType);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error while filtering orders by base type" });
    }
});

// Get orders by base name
router.get('/orders/name/:baseName', async (req, res) => {
    const baseName = req.params.baseName;

    try {
        const orders = await findOrdersByBaseName(baseName);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error while finding orders by base name" });
    }
});

module.exports = router;
