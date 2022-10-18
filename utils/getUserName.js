const getUserName = (services, users) => {
	let updatedServices = services.map((eachService) => {
		return {
			_id: eachService._id,
			ownerName: eachService.ownerName,
			carNumber: eachService.carNumber,
			phone: eachService.phone,
			serviceStatus: eachService.serviceStatus,
			createdAt: eachService.createdAt,
			updatedAt: eachService.updatedAt,
			__v: eachService.__v,
			selectedServices: eachService.selectedServices,
			attendeeName: getName(users, eachService.user_id)
		};
	});
	return updatedServices;
};

const getName = (users, id) => {
	let findUserName = users.find((eachUser) => id.equals(eachUser._id));
	return findUserName.userName;
};

module.exports = getUserName;
