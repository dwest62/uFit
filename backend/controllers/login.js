const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { authenticate } = require('../utils/middleware')

loginRouter.post('/', async (request, response) => {
	const { username, password } = request.body

	const user = await User.findOne({ username })
		.populate({
			path: 'teams',
			populate: [
				{ path: 'admin', select: '_id' }, // only populates '_id' for admin
				{ path: 'members', select: 'username _id' }, // populates 'username' and '_id' for members
				{ path: 'invitations' }
			]
		})

	const validPassword = user === null
		? false
		: await bcrypt.compare(password, user.passwordHash)

	if (!(user && validPassword)) {
		return response.status(401).json({
			error: 'invalid username or password'
		})
	}

	const token = jwt.sign({
		username: user.username,
		id: user._id,
	}, process.env.SECRET, { expiresIn: 3600 })

	user.teams.forEach(team => {
		team.admin = team.admin._id
	})

	const userJSON = user.toJSON()
	response
		.status(200)
		.send({ token, user: userJSON })
})

loginRouter.post('/validate', authenticate, async (_, _r) => {
})

module.exports = loginRouter
