const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoute');
const cors = require('cors');

// DB
const connetDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

connetDB();

const server = express();
server.use(express.json());
server.use(cors());

server.use('/users', userRoutes);
server.use('/services', serviceRoutes);

server.use(notFound);
server.use(errorHandler);

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`Server is running on port ${port}`.yellow.bold);
});
