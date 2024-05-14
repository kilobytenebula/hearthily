// backend/Chef/models/chef.js

const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  chef_id: { type: String, required: true },
  chef_name: { type: String, required: true },
  date: { type: Date, required: true },
  orders_completed: { type: Number, required: true }
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;
