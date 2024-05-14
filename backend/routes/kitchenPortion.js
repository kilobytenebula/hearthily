const router = require('express').Router();
const KitchenPortion = require('../models/KitchenPortion');
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

// Upload portion image
router.post("/upload/portion", upload.single('portion'), (req, res) => {
    res.json({
        success: 1,
        message: "Portion image uploaded successfully",
        image_url: `http://localhost:3500/images/${req.file.filename}`
    });
});

// Add portion
router.post('/addportion', async (req, res) => {
    let portions = await KitchenPortion.find({});
    let id;
    if(portions.length > 0) 
    {
        let last_portion_array =portions.slice(-1);
        let last_portion= last_portion_array[0];
        id=last_portion.id+1;
    }
    else{
        id=1;
    }
    const portion = new KitchenPortion({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        p_type: req.body.p_type,
        price: req.body.price,
    });
    console.log(portion);
    await portion.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    });
});

// Remove portion
router.post('/removeportion', async (req, res) => {
    await KitchenPortion.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({ 
        success: true, 
        name: req.body.name 
    });
});

// Get all portions
router.get('/allportions', async (req, res) => {
    let portions = await KitchenPortion.find();
    console.log("All portions Fetched");
    res.send(portions);
});

module.exports = router;
