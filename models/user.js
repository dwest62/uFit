const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: String,
	passwordHash: String,
	first_name: String,
	last_name: String,
	email: String,
	age: { type: Number, min: 1, max: 122 },
	gender: {
		type: String,
		enum: ['Male', 'Female', 'Other']
	},
	weight: Number,
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() }
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)