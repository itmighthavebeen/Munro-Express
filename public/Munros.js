// models/Mountain.js
const mongoose = require('mongoose');

// Define the mountain schema
const mountainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gaelic: { type: String, required: true},
  translation: { type: String, required: true},
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  height: {type: Number, required: true},
  comments: {type: String, required: true}

});

// Create a model from the schema
const Mountain = mongoose.model('Mountain', mountainSchema);

module.exports = Mountain;
