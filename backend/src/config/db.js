const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
const { env } = require('process');


let database; 
try {
  // Check if the app is already initialized to prevent errors in hot-reload environments
  if (admin.apps.length === 0) {
    admin.initializeApp({
      
      credential: admin.credential.cert(serviceAccount),

      databaseURL: process.env.FIREBASE_URI 
    });
    console.log("Firebase Admin SDK initialized successfully for Realtime Database.");
  } else {
    console.log("Firebase app already initialized. Reusing existing instance.");
  }

  
  database = admin.database(); // <-- KEY CHANGE: Get the Realtime Database service here!

} catch (error) {
  
  console.error("Firebase initialization failed:", error);
  throw error;
}


const COACHES_PATH = 'coaches'; 

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

module.exports = connectDB;
