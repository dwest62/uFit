const entryRouter = require('express').Router()
const Entry = require('../models/entry')
const User = require('../models/user')
const Team = require('../models/team')
const { authenticate } = require('../utils/middleware')
const { updateUserParticipation } = require('../utils/participationUtils')


entryRouter.post('/', authenticate, async (request, response) => {
	const user = await User.findById(request.user.id)

	const entry = new Entry({
		content: request.body.content,
		user: user._id
	})

	await updateUserParticipation(user, false)
	const savedEntry = await entry.save()
	const responseObject = {
		...savedEntry._doc,
		user: { username: user.username, id: user.id, participation_points: user.participation_points }
	}


	response.status(200).json(responseObject)
})

entryRouter.get('/', authenticate, async (request, response) => {
	const user = await User.findById(request.user.id).populate('teams')

	const teamMemberIds = user.teams.reduce((acc, team) => {
		const allMembers = [...team.members, team.admin]
		return acc.concat(allMembers)
	}, [])

	const entries = await Entry
		.find({
			$or: [{ 'user': { $in: teamMemberIds } }]
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username picture')

	return response.status(200).json(entries)
})

entryRouter.get('/team', authenticate, async (request, response) => {
	const { teamId } = request.query

	const user = await User.findById(request.user.id)

	const team = await Team.findById(teamId).populate('members').populate('admin')

	if(!team) {
		return response.status(404).json({ error: 'team not found' })
	}

	const teamMembers = [...team.members, team.admin]
	const teamMemberIds = teamMembers.map(member => member._id.toString())

	if(!teamMemberIds.includes(user._id.toString())) {
		return response.status(405).json({ error: 'user not authorized' })
	}

	const entries = await Entry
		.find({
			$or: [{ 'user': { $in: teamMemberIds } }]
		})
		.sort({ createdAt: -1 })
		.populate('user', 'username picture')

	return response.status(200).json(entries)
})

module.exports = entryRouter