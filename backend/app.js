const dotenv = require('dotenv');
dotenv.config()

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const expenseRoutes = require('./routes/expenseRoute');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Logging (development friendly)
app.use(morgan('dev'));

// Parse JSON body
app.use(express.json());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use('/api/expenses', expenseRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.use(errorHandler);

module.exports = app;
