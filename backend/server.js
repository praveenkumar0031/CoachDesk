const express = require('express');
const cors = require('cors');
const coachRoutes = require('./src/routes/coachRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/coaches', coachRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Mock JSON backend running on port ${PORT}`));
