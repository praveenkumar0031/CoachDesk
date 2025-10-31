const admin = require('firebase-admin');

// --- IMPORTANT: Firebase Admin SDK Initialization ---
// You will need to initialize the Firebase Admin SDK once in your application.
// This typically involves providing a service account key and your database URL.
// Example:
// const serviceAccount = require('./path/to/your/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://projectsem2-d4e74-default-rtdb.asia-southeast1.firebasedatabase.app'
// });
// ----------------------------------------------------

const db = admin.database();
const COACHES_REF = db.ref('coaches'); // This is the path in your Realtime Database where coaches data will be stored

// Read coaches data from Realtime Database
const readCoachesFromRTDB = async () => {
  try {
    const snapshot = await COACHES_REF.once('value'); // 'value' event listener retrieves all data at this path
    // .val() returns the JavaScript value of the data snapshot
    return snapshot.val() || []; // Return an empty array if no data exists at the path
  } catch (error) {
    console.error("Error reading coaches from Realtime Database:", error);
    throw error; // It's good practice to re-throw or handle the error appropriately
  }
};

// Write coaches data to Realtime Database
const writeCoachesToRTDB = async (data) => {
  try {
    await COACHES_REF.set(data); // Overwrites the data at the 'coaches' path with the new 'data'
    console.log("Coaches data saved to Realtime Database successfully!");
  } catch (error) {
    console.error("Error writing coaches to Realtime Database:", error);
    throw error;
  }
};

module.exports = { readCoachesFromRTDB, writeCoachesToRTDB };
