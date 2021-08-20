const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const argon2 = require('argon2');
const { jwtSecret } = require('../config');
const uniqueValidator = require('mongoose-unique-validator');
const UserSchema = new mongoose.Schema({
	username: {type: String, required: [true, "can't be blank"], unique: true},
	hash: String,
	websites: [String]
});
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
UserSchema.methods.setPassword = async function (password) {
	this.hash = await argon2.hash(password);
};
UserSchema.methods.validatePassword = async function (password) {
	const res = await argon2.verify(this.hash, password);
	return res;
};
UserSchema.methods.generateJWT = function () {
	const today = new Date();
	const exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	console.log(this.username)
	return jwt.sign({
		username: this.username,
		exp: parseInt(exp.getTime() / 1000)
	}, jwtSecret);
};
module.exports = mongoose.model('User', UserSchema);