const asyncHandler = require('express-async-handler');
const Service = require('../models/servicesModel');
const User = require('../models/userModel');

const getUserName = require('../utils/getUserName');

const getServices = asyncHandler(async (req, res) => {
	let services = await Service.find().sort({ createdAt: -1 });
	let user = await User.find();
	let updatedService = getUserName(services, user);
	if (updatedService) {
		res.json({ count: services.length, data: updatedService });
	} else {
		res.status(404);
		throw new Error('Services not found');
	}
});

const createService = asyncHandler(async (req, res) => {
	let {
		user_id,
		ownerName,
		carNumber,
		selectedServices,
		phone,
		serviceStatus
	} = req.body;

	let isValidUser = await User.findById(req.body.user_id);
	if (req.body.user_id) {
		if (isValidUser) {
			if (!ownerName || !carNumber || !selectedServices) {
				res.status(400);
				throw new Error('Please fill all the fields');
			}
			if (ownerName.length < 2) {
				res.status(400);
				throw new Error('User name should atleast contain 2 charecters');
			}
			if (carNumber.trim().length < 10) {
				res.status(400);
				throw new Error('Car number should atleast contain 10 charecters');
			}
			const service = new Service({
				user_id,
				ownerName,
				carNumber,
				selectedServices,
				phone,
				serviceStatus
			});
			await service.save();
			res.status(200);
			res.json({ message: 'Service created successfully' });
		} else {
			res.status(404);
			throw new Error('Invalid user. Action not permitted');
		}
	} else {
		res.status(400);
		throw new Error('Please provide a user id');
	}
});

const updateService = asyncHandler(async (req, res) => {
	let service = await Service.findById(req.params.id);
	let isValidUser = await User.findById(req.body.user_id);
	if (service) {
		if (req.body.user_id) {
			if (isValidUser) {
				service.ownerName = req.body.ownerName || service.ownerName;
				service.carNumber = req.body.carNumber || service.carNumber;
				service.selectedServices =
					req.body.selectedServices || service.selectedServices;
				service.phone = req.body.phone || service.phone;
				service.serviceStatus = req.body.serviceStatus || service.serviceStatus;

				let updatedService = await service.save();
				res.status(200);
				res.send({ message: 'Service updated successfully' });
			} else {
				res.status(404);
				throw new Error('Invalid user. Action not permitted');
			}
		} else {
			res.status(404);
			throw new Error('Please provide a valid user id');
		}
	} else {
		res.status(400);
		throw new Error('Service not found');
	}
});

const deleteService = asyncHandler(async (req, res) => {
	let service = await Service.findById(req.params.id);
	let isValidUser = await User.findById(req.body.user_id);
	if (service) {
		if (req.body.user_id) {
			if (isValidUser && isValidUser?.isAdmin) {
				let deletedService = await service.remove();
				res.status(200);
				res.send({ message: 'Service deleted successfully' });
			} else {
				res.status(404);
				throw new Error('Invalid user, Action not permitted');
			}
		} else {
			res.status(404);
			throw new Error('Please provide a valid user id');
		}
	} else {
		res.status(404);
		throw new Error('Service not found');
	}
});

const myServices = asyncHandler(async (req, res) => {
	let services = await Service.find({ user_id: req.params.id }).sort({
		createdAt: -1
	});
	if (services) {
		res.json(services);
	} else {
		res.status(404);
		throw new Error('Services not found');
	}
});

module.exports = {
	getServices,
	createService,
	updateService,
	deleteService,
	myServices
};
