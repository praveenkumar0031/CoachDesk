const { v4: uuidv4 } = require('uuid');


const { readData, writeData } = require('../utils/fileHelper');

// GET all coaches
const getCoaches = (req, res) => {
  const coaches = readData();
  res.json(coaches);
};

// GET single coach
const getCoachById = (req, res) => {
  const { id } = req.params;
  const coaches = readData();
  const coach = coaches.find(c => c.id === id);
  if (!coach) return res.status(404).json({ message: 'Coach not found' });
  res.json(coach);
};

// POST new coach
const addCoach = (req, res) => {
  const { name, email, category, rating, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const coaches = readData();

  // Safe numeric ID generation
  const numericIds = coaches
    .map(c => Number(c.id))
    .filter(id => !isNaN(id));

  const maxId = numericIds.length ? Math.max(...numericIds) : 0;
  const newId = String(maxId + 1);

  const newCoach = {
    id: newId,
    cid: uuidv4(),
    name,
    email,
    category,
    rating: Number(rating) || 0,
    status: status || 'active',
    createdAt: new Date().toISOString(),
  };

  coaches.push(newCoach);
  writeData(coaches);
  res.status(201).json(newCoach);
};


// PUT update coach
const updateCoach = (req, res) => {
  const { id } = req.params;
  const coaches = readData();
  const index = coaches.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ message: 'Coach not found' });

  coaches[index] = { ...coaches[index], ...req.body };
  writeData(coaches);
  res.json(coaches[index]);
};

// DELETE coach
const deleteCoach = (req, res) => {
  const { id } = req.params;
  let coaches = readData();
  coaches = coaches.filter(c => c.id !== id);
  writeData(coaches);
  res.json({ message: 'Coach deleted successfully' });
};

module.exports = {
  getCoaches,
  getCoachById,
  addCoach,
  updateCoach,
  deleteCoach
};
