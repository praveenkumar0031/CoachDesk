const Coach = require('../models/coachModel');

// GET all coaches
const getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single coach
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findOne({ id: Number(req.params.id) });
    if (!coach) return res.status(404).json({ message: 'Coach not found' });
    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new coach
const addCoach = async (req, res) => {
  try {
    const { name, email, category, rating, status } = req.body;


    const coachesWithoutId = await Coach.find({ $or: [{ id: { $exists: false } }, { id: null }] });
    if (coachesWithoutId.length > 0) {
      let counter = 1;
      for (const coach of coachesWithoutId) {
        const lastCoach = await Coach.findOne().sort({ id: -1 });
        coach.id = lastCoach ? lastCoach.id + 1 : counter;
        await coach.save();
        counter++;
      }
      console.log("🧩 Missing IDs fixed in existing documents");
    }


    const lastCoach = await Coach.findOne().sort({ id: -1 });
    const nextId = lastCoach && lastCoach.id ? lastCoach.id + 1 : 1;


    const coach = new Coach({
      id: nextId,
      name,
      email,
      category,
      rating,
      status
    });

    const savedCoach = await coach.save();
    res.status(201).json(savedCoach);
  } catch (err) {
    console.error("❌ Error adding coach:", err);
    res.status(400).json({ message: err.message });
  }
};


// PUT update coach
const updateCoach = async (req, res) => {
  try {
    const updatedCoach = await Coach.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
    if (!updatedCoach) return res.status(404).json({ message: 'Coach not found' });
    res.json(updatedCoach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE coach
const deleteCoach = async (req, res) => {
  try {
    const deletedCoach = await Coach.findOneAndDelete({ id: Number(req.params.id) });
    if (!deletedCoach) return res.status(404).json({ message: 'Coach not found' });
    res.json({ message: 'Coach deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCoaches,
  getCoachById,
  addCoach,
  updateCoach,
  deleteCoach
};
