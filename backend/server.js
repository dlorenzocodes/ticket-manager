const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;


// ConnectDB
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes
app.get('/', (req, res) => {
    res.send('Hello')
})

app.use('/api/users', require('./routes/userRoutes'));


// Middleware
app.use(errorHandler)


app.listen(PORT, () => console.log(`Listenng on port ${PORT}`));