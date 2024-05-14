const express = require('express');
const router = express.Router();
const Chef = require('../models/chef');

// Get all chefs
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new chef
router.post('/', async (req, res) => {
  const chef = new Chef({
    chef_id: req.body.chef_id,
    chef_name: req.body.chef_name,
    date: req.body.date,
    orders_completed: req.body.orders_completed
  });

  try {
    const newChef = await chef.save();
    res.status(201).json(newChef);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
