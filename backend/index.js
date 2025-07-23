const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservations');
const feedbackRoutes = require('./routes/feedback');
const selectionRoutes = require('./routes/selections');
const gptRouter = require('./routes/gpt');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:5174', // <-- allow your frontend
    credentials: true
}));app.use(express.json()); // parse JSON request bodies

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/selections', selectionRoutes);
app.use('/api/gpt', gptRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
