const { readData, writeData, database } = require('../config/db.js');
const COACHES_COLLECTION = 'coaches'; // Root node name in RTDB

/**
 * @desc Get all coaches with client-side filtering, pagination, and sorting
 * @route GET /api/coaches
 * @access Public
 */
const getCoaches = async (req, res) => {
  try {
    const snapshot = await database.ref(COACHES_COLLECTION).once('value');
    let coaches = [];

    snapshot.forEach((childSnapshot) => {
      coaches.push({
        id: Number(childSnapshot.key), // ensure numeric ID
        ...childSnapshot.val(),
      });
    });

    const {
      status,
      category,
      rating,
      page = 1,
      limit = 5,
      sort,
      order = 'asc',
    } = req.query;

    // ---- FILTER LOGIC ----
    if (status) {
      coaches = coaches.filter(
        (c) => c.status && c.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (category) {
      coaches = coaches.filter(
        (c) =>
          c.category && c.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (rating) {
      coaches = coaches.filter(
        (c) => typeof c.rating === 'number' && c.rating >= Number(rating)
      );
    }

    // ---- SORTING LOGIC ----
    const sortField = sort || 'id';
    coaches.sort((a, b) => {
      const valA =
        typeof a[sortField] === 'string'
          ? a[sortField].toLowerCase()
          : a[sortField];
      const valB =
        typeof b[sortField] === 'string'
          ? b[sortField].toLowerCase()
          : b[sortField];

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // ---- PAGINATION ----
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginated = coaches.slice(startIndex, endIndex);

    res.json({
      page: pageNum,
      limit: limitNum,
      totalItems: coaches.length,
      totalPages: Math.ceil(coaches.length / limitNum),
      sortBy: sortField,
      order,
      data: paginated,
    });
  } catch (error) {
    console.error('Error getting coaches:', error);
    res.status(500).json({ message: 'Failed to retrieve coaches', error: error.message });
  }
};

/**
 * @desc Get single coach by ID
 * @route GET /api/coaches/:id
 */
const getCoachById = async (req, res) => {
  try {
    const coachId = req.params.id;
    const coachRef = database.ref(`${COACHES_COLLECTION}/${coachId}`);
    const snapshot = await coachRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json({ id: Number(snapshot.key), ...snapshot.val() });
  } catch (error) {
    console.error('Error getting coach by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve coach', error: error.message });
  }
};

/**
 * @desc Add a new coach (numeric ID)
 * @route POST /api/coaches
 */
const addCoach = async (req, res) => {
  const { name, email, category, rating, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  try {
    const coachData = {
      name,
      email,
      category: category || 'General',
      rating: Number(rating) || 0,
      status: status || 'active',
    };

    // ✅ Delegate to writeData() which assigns numeric ID automatically
    const addedCoach = await writeData(coachData);

    res.status(201).json(addedCoach);
  } catch (error) {
    console.error('Error adding coach:', error);
    res.status(500).json({ message: 'Failed to add coach', error: error.message });
  }
};

/**
 * @desc Update an existing coach
 * @route PUT /api/coaches/:id
 */
const updateCoach = async (req, res) => {
  try {
    const coachId = req.params.id;
    const updatedData = req.body;

    if (!coachId || isNaN(Number(coachId))) {
      return res.status(400).json({ message: 'Invalid coach ID' });
    }

    const coachRef = database.ref(`${COACHES_COLLECTION}/${coachId}`);
    const snapshot = await coachRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    await coachRef.update(updatedData);

    const updatedSnapshot = await coachRef.once('value');
    res.json({
      message: `Coach ${coachId} updated successfully.`,
      updatedCoach: { id: Number(coachId), ...updatedSnapshot.val() },
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    res.status(500).json({ message: 'Failed to update coach', error: error.message });
  }
};

/**
 * @desc Delete a coach
 * @route DELETE /api/coaches/:id
 */
const deleteCoach = async (req, res) => {
  try {
    const coachId = req.params.id;

    if (!coachId || isNaN(Number(coachId))) {
      return res.status(400).json({ message: 'Invalid coach ID' });
    }

    const coachRef = database.ref(`${COACHES_COLLECTION}/${coachId}`);
    const snapshot = await coachRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    await coachRef.remove();
    res.json({ message: `Coach ${coachId} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting coach:', error);
    res.status(500).json({ message: 'Failed to delete coach', error: error.message });
  }
};

module.exports = {
  getCoaches,
  getCoachById,
  addCoach,
  updateCoach,
  deleteCoach,
};
