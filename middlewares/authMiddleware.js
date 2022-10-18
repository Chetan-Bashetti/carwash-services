const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protected = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select('-password');

			next();
		} catch (e) {
			res.status(401);
			throw new Error('User authentication failed');
		}
	}
	if (!token) {
		res.status(401);
		throw new Error('User authentication failed');
	}
});

module.exports = protected;
