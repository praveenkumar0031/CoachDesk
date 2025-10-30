const { readData, writeData } = require('../utils/fileHelper');

// ✅ GET all coaches with filtering, pagination, and sorting
const getCoaches = (req, res) => {
  let coaches = readData();

  // Extract query parameters
  const {
    status,
    category,
    rating,
    page = 1,
    limit = 5,
    sort,
    order = 'asc'
  } = req.query;

  // ---- FILTER LOGIC ----
  if (status) {
    coaches = coaches.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  if (category) {
    coaches = coaches.filter(c =>
      c.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (rating) {
    coaches = coaches.filter(c => c.rating >= Number(rating));
  }

  // ---- SORTING LOGIC ----
  const sortField = sort || 'id';
  
    coaches.sort((a, b) => {
      const valA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
    const valB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  

  // ---- PAGINATION LOGIC ----
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginated = coaches.slice(startIndex, endIndex);

  // ---- META INFO ----
  const totalItems = coaches.length;
  const totalPages = Math.ceil(totalItems / limitNum);

  res.json({
    page: pageNum,
    limit: limitNum,
    totalItems,
    totalPages,
    sortBy: sortField,
    order,
    data: paginated
  });
};
// ✅ GET single coach
const getCoachById = (req, res) => {
  const coaches = readData();
  const coach = coaches.find(c => c.id === Number(req.params.id));
  if (!coach) return res.status(404).json({ message: 'Coach not found' });
  res.json(coach);
};

// ✅ POST new coach
const addCoach = (req, res) => {
  const { name, email, category, rating, status } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: 'Name and Email are required' });

  const coaches = readData();
  const newCoach = {
    id: coaches.length ? coaches[coaches.length - 1].id + 1 : 1,
    name,
    email,
    category: category || 'General',
    rating: Number(rating) || 0,
    status: status || 'active',
    createdAt: new Date().toISOString()
  };
  coaches.push(newCoach);
  writeData(coaches);
  res.status(201).json(newCoach);
};

// ✅ PUT update coach
const updateCoach = (req, res) => {
  const coaches = readData();
  const index = coaches.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Coach not found' });

  coaches[index] = { ...coaches[index], ...req.body };
  writeData(coaches);
  res.json(coaches[index]);
};

// ✅ DELETE coach
const deleteCoach = (req, res) => {
  const coaches = readData();
  const filtered = coaches.filter(c => c.id !== Number(req.params.id));
  if (filtered.length === coaches.length)
    return res.status(404).json({ message: 'Coach not found' });

  writeData(filtered);
  res.json({ message: 'Coach deleted successfully' });
};

module.exports = {
  getCoaches,
  getCoachById,
  addCoach,
  updateCoach,
  deleteCoach
};
