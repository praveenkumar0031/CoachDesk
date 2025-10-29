const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const coachRoutes = require('./src/routes/coachRoutes');

dotenv.config();
connectDB();  // connect MongoDB

const app = express();
app.use(cors());
app.use(express.json());

app.use('/coaches', coachRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
