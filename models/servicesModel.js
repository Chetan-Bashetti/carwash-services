const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		ownerName: {
			type: String,
			required: true,
			minlength: 3
		},
		carNumber: {
			type: String,
			required: true,
			minlength: 3
		},
		phone: {
			type: String,
			required: true,
			minlength: 10
		},
		selectedServices: {
			type: [
				{
					serviceName: String,
					isSelected: Boolean
				}
			],
			required: true
		},
		serviceStatus: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;
