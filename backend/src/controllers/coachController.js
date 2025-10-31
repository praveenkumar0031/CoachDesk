const { readData, writeData, database } = require('../config/db.js'); // Assuming db.js is in ../config/
const COACHES_COLLECTION = 'coaches'; // Define the collection name here or import from db.js


// ✅ GET all coaches with filtering, pagination, and sorting
const getCoaches = async (req, res) => { // Made async
  try {
    let coaches = await readData(); // Await the asynchronous readData() call

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

    // ---- FILTER LOGIC (still client-side for simplicity, but ideally done with Firestore queries) ----
    if (status) {
      coaches = coaches.filter(c => c.status && c.status.toLowerCase() === status.toLowerCase());
    }

    if (category) {
      coaches = coaches.filter(c =>
        c.category && c.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (rating) {
      // Ensure rating exists and is a number before filtering
      coaches = coaches.filter(c => typeof c.rating === 'number' && c.rating >= Number(rating));
    }

    // ---- SORTING LOGIC ----
    const sortField = sort || 'id'; // 'id' will be the Firestore document ID now

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
  } catch (error) {
    console.error("Error getting coaches:", error);
    res.status(500).json({ message: "Failed to retrieve coaches", error: error.message });
  }
};

// ✅ GET single coach
const getCoachById = async (req, res) => { // Made async
  try {
    const coachId = req.params.id; // The ID from the URL parameter

    // Directly get the coach document from Firestore by its ID
    const docRef = database.collection(COACHES_COLLECTION).doc(coachId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json({ id: doc.id, ...doc.data() }); // Include the Firestore ID
  } catch (error) {
    console.error("Error getting coach by ID:", error);
    res.status(500).json({ message: "Failed to retrieve coach", error: error.message });
  }
};

// ✅ POST new coach
const addCoach = async (req, res) => { // Made async
  const { name, email, category, rating, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  try {
    const newCoachData = {
      name,
      email,
      category: category || 'General',
      rating: Number(rating) || 0, // Ensure rating is a number
      status: status || 'active',
      // createdAt is handled by writeData internally with serverTimestamp
    };

    // Use the writeData function to add the new coach directly to Firestore
    // writeData returns the added coach object including its new Firestore ID
    const addedCoach = await writeData(newCoachData);

    res.status(201).json(addedCoach);
  } catch (error) {
    console.error("Error adding coach:", error);
    res.status(500).json({ message: "Failed to add coach", error: error.message });
  }
};
// ✅ PUT update coach (fixed)
const updateCoach = async (req, res) => {
  try {
    const coachId = req.params.id; // Ensure this is a string or number from the URL
    const updatedData = req.body;

    if (!coachId || isNaN(Number(coachId))) {
      return res.status(400).json({ message: "Invalid coach ID" });
    }

    const coachRef = database.ref(`coaches/${coachId}`);

    // Check if the coach exists before updating
    const snapshot = await coachRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Coach not found" });
    }

    await coachRef.update(updatedData);

    // Optionally fetch updated data
    const updatedSnapshot = await coachRef.once("value");
    res.json({
      message: `Coach ${coachId} updated successfully.`,
      updatedCoach: updatedSnapshot.val(),
    });
  } catch (error) {
    console.error("Error updating coach:", error);
    res
      .status(500)
      .json({ message: "Failed to update coach", error: error.message });
  }
};

// ✅ DELETE coach (Realtime Database version)
const deleteCoach = async (req, res) => {
  try {
    const coachId = req.params.id;

    if (!coachId || isNaN(Number(coachId))) {
      return res.status(400).json({ message: "Invalid coach ID" });
    }

    const coachRef = database.ref(`coaches/${coachId}`);

    const snapshot = await coachRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Coach not found" });
    }

    await coachRef.remove();
    res.json({ message: `Coach ${coachId} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting coach:", error);
    res
      .status(500)
      .json({ message: "Failed to delete coach", error: error.message });
  }
};


module.exports = {
  getCoaches,
  getCoachById,
  addCoach,
  updateCoach,
  deleteCoach
};
