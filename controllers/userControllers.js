const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

const getUsers = asyncHandler(async (req, res) => {
	let users = await User.find();
	if (users) {
		res.send({
			totalCount: users?.length,
			data: users
		});
	} else {
		res.status(404).res.send('User not found');
	}
});

const addUser = asyncHandler(async (req, res) => {
	const { userName, email, password, isAdmin } = req.body;

	const userExists = await User.findOne({ email });
	if (userName === '' || email === '' || password === '') {
		res.status(400);
		throw new Error('Please fill all fields');
	}
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}
	const user = User.create({
		userName,
		email,
		password,
		isAdmin
	});

	if (user) {
		res.status(200).json({
			_id: user._id,
			userName: userName,
			email: email,
			isAdmin: isAdmin
		});
	} else {
		res.status(400);
		throw new Error('Bad request');
	}
});

const loginUser = asyncHandler(async (req, res) => {
	let { email, password } = req.body;
	let user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			id: user._id,
			userName: user.userName,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id)
		});
	} else {
		res.status(404);
		throw new Error('Invalid email or password');
	}
});

const updateUser = asyncHandler(async (req, res) => {
	let user = await User.findById(req.params.id);

	if (user) {
		user.userName = req.body.userName || user.userName;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin || user.isAdmin;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();
		res.json({
			message: 'Updated user scussessfully',
			data: {
				_id: updatedUser._id,
				userName: updatedUser.userName,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				token: generateToken(updatedUser._id)
			}
		});
	} else {
		res.status(400);
		throw new Error('User not found');
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	let adminUser = await User.findById(req.body.id);
	let user = await User.findById(req.params.id);

	if (user) {
		if (adminUser.isAdmin) {
			if (user.isAdmin) {
				res.status(400);
				throw new Error('Admins user can not be deleted');
			} else {
				await user.remove();
				res.json({ message: 'User deleted successfully' });
			}
		} else {
			res.status(400);
			throw new Error('Unauthorized! Action not permitted');
		}
	} else {
		res.status(400);
		throw new Error('User not found');
	}
});

const getUserbyId = asyncHandler(async (req, res) => {
	console.log(req.params, 'res');
	let user = await User.findById({ _id: req.params.id });
	console.log(user, 'USER');
	if (user) {
		res.status(200);
		res.json(user);
	} else {
		res.status(400);
		throw new Error('User not found');
	}
});

module.exports = {
	getUsers,
	addUser,
	loginUser,
	updateUser,
	deleteUser,
	getUserbyId
};
