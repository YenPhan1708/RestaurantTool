const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const menuRoutes = require("./routes/menu");
const reservationRoutes = require("./routes/reservations");
const feedbackRoutes = require("./routes/feedback");
const selectionRoutes = require("./routes/selections");
const gptRouter = require("./routes/gpt");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup (allow localhost for dev + same origin in production)
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json()); // parse JSON request bodies

// API Routes
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/selections", selectionRoutes);
app.use("/api/gpt", gptRouter);
app.use("/api/admin", require("./routes/adminAuth"));

// Serve frontend build (after building Vite and copying "dist" to "public")
app.use(express.static(path.join(__dirname, "public")));

// Catch-all: send index.html for any non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
