class Session {
	static list = []

	constructor(user) {
		this.token = this.generateToken()
		this.user = {
			email: user.email,
			isConfirm: user.isConfirm,
			id: user.id,
		}
	}

	generateToken = () => {
		const length = 6
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length)
			result += characters[randomIndex]
		}

		return result
	}

	static create = (user) => {
		const session = new Session(user)
		Session.list.push(session)
		return session
	}

	static get = (token) => {
		return Session.list.find((item) => item.token === token) || null
	}

	static delete = (token) => {
		const index = Session.list.findIndex((item) => item.token === token);
		if (index !== -1) {
			Session.list.splice(index, 1);
			return true; // Сесія успішно видалена
		}
		return false; // Сесія не знайдена за вказаним токеном
	}
}

module.exports = { Session }