const express = require('express');
const cors = require('cors');
const coachRoutes = require('./src/routes/coachRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/coaches', coachRoutes);

app.get('/', (req, res) => {
  res.send('CoachHub API is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
