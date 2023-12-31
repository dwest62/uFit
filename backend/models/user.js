const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	firstname: String,
	lastname: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	age: { type: Number, min: 1, max: 122 },
	weight: Number,
	height: Number,
	picture: { type: String, default: '' },
	participation_points: { type: Number, default: 0 },
	ufit_points: { type: Number, default: 0 },
	lastReplyDate: Date,
	lastPostDate: Date,
	currentStreak: {
		type: Number,
		default: 0
	},
	longestStreak: {
		type:Number,
		default: 0
	},
	teams: [{
		type: Schema.Types.ObjectId,
		ref: 'Team'
	}],
	invitations: [{
		type: Schema.Types.ObjectId,
		ref: 'TeamInvitation'
	}],
	created_at: { type: Date, default: Date.now() },
	updated_at: { type: Date, default: Date.now() }
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		//Convert object id to string.
		if (!returnedObject.id) {
			returnedObject.id = returnedObject._id.toString()
		}
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)