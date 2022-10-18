const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const userSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
			minlength: 3
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true,
			selected: true
		},
		isAdmin: {
			type: Boolean,
			required: true
		}
	},
	{
		timestamps: true
	}
);

userSchema.methods.matchPassword = async function (enteredPasswoed) {
	return await bcrypt.compare(enteredPasswoed, this.password);
};

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
