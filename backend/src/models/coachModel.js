const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  id: { type: Number }, // 👈 numeric id
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: String,
  rating: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coach', coachSchema);
