const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONOGO_DB_URI);
		console.log(
			`Monogo DB connection successful at ${connect.connection.host}`.cyan
		);
	} catch (err) {
		console.log(`Error ${err.message}`.red);
		// PREVENT APP FROM RUNNING FUTHER ONCE DATABASE IS NOT CONNECTED
		process.exit();
	}
};

module.exports = connectDB;
