const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();
// NOTE: Replace './config/serviceAccountKey.json' with the actual path
// to the JSON file you downloaded.
const serviceAccount = require('./serviceAccountKey.json');
const { env } = require('process');

// Get a reference to the Realtime Database service - Declare 'database' globally within the module scope.
let database; // Changed 'db' to 'database' to reflect RTDB more clearly

// --- Initialization ---
try {
  // Check if the app is already initialized to prevent errors in hot-reload environments
  if (admin.apps.length === 0) {
    admin.initializeApp({
      
      credential: admin.credential.cert(serviceAccount),

      databaseURL:process.env.FIREBASE_URI 
    });
    console.log("Firebase Admin SDK initialized successfully for Realtime Database.");
  } else {
    console.log("Firebase app already initialized. Reusing existing instance.");
  }

  // Assign 'database' AFTER successful initialization, getting the Realtime Database service
  database = admin.database(); // <-- KEY CHANGE: Get the Realtime Database service here!

} catch (error) {
  // For any other error during initialization, log it and re-throw
  console.error("Firebase initialization failed:", error);
  throw error;
}

// Define the root path where your coach data is stored in Realtime Database
const COACHES_PATH = 'coaches'; // Changed 'COACHES_COLLECTION' to 'COACHES_PATH' for RTDB nomenclature

const readData = async () => {
  try {
    const coachesRef = database.ref(COACHES_PATH); // Get a reference to the coaches path
    const snapshot = await coachesRef.once('value'); // Read data once

    if (!snapshot.exists() || snapshot.val() === null) { // Check if the path exists or is empty
      console.log('No coaches found in Realtime Database.');
      return [];
    }

    const coaches = [];
    // Iterate over the children of the snapshot to get individual coach objects
    snapshot.forEach(childSnapshot => {
      coaches.push({
        id: childSnapshot.key, // In RTDB, childSnapshot.key is the unique ID
        ...childSnapshot.val() // childSnapshot.val() gets the data for that child
      });
    });

    return coaches;
  } catch (error) {
    console.error("Error reading coaches data from Realtime Database:", error);
    throw error;
  }
};


// --- Adapted writeData for Realtime Database (for adding new data with auto-generated ID) ---
/**
 * Writes new coach data to the 'coaches' path, generating a unique key.
 * This function is designed to *add* new records.
 * For updating existing records, you would use `database.ref('coaches/' + coachId).update(...)`
 * or `database.ref('coaches/' + coachId).set(...)`.
 * @param {Object} coachData The data for the new coach.
 * @returns {Promise<Object>} A promise that resolves to the newly added coach object,
 *                             including its generated key (ID).
 */
const writeData = async (coachData) => {
  try {
    const coachesRef = database.ref(COACHES_PATH);

    // Fetch all existing coaches to find the highest numeric ID
    const snapshot = await coachesRef.once("value");
    let nextId = 1; // default starting ID

    if (snapshot.exists()) {
      const data = snapshot.val();

      // Extract all keys, convert numeric strings to numbers, find the max
      const ids = Object.keys(data)
        .map((key) => Number(key))
        .filter((num) => !isNaN(num)); // ensure only numbers

      if (ids.length > 0) nextId = Math.max(...ids) + 1;
    }

    // Now use the numeric ID as the key instead of .push()
    const newCoachRef = coachesRef.child(String(nextId));

    const dataWithTimestamp = {
      id: nextId,
      ...coachData,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await newCoachRef.set(dataWithTimestamp);

    //console.log(`✅ New coach added with numeric ID: ${nextId} successfully saved in RTDB.`    );
    return dataWithTimestamp;
  } catch (error) {
    console.error("Error writing coach data to Realtime Database:", error);
    throw error;
  }
};

module.exports = {
  readData,
  writeData,
  database // Export the Realtime Database instance
};
