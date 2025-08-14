const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const mainRouter = require('./routes/index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', mainRouter);

// Database Connection
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});