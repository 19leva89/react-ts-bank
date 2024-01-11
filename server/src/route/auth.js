// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('./../class/user')
const { Confirm } = require('./../class/confirm')
const { Session } = require('./../class/session')


User.create({
	email: 'test@gmail.com',
	password: '123Ab456',
})

Confirm.create("test@gmail.com")

// ================================================================

router.post('/login', function (req, res) {
	const { email, password } = req.body

	// console.log(email, password)

	if (!email || !password) {
		return res.status(400).json({
			message: "Error. Required fields are missing"
		})
	}

	try {
		const user = User.getByEmail(email)
		if (!user) {
			return res.status(400).json({
				message: "Error. User with this email does not exist"
			})
		}

		if (user.password !== password) {
			return res.status(400).json({
				message: "Error. Incorrect passwor"
			})
		}

		const session = Session.create(user)

		return res.status(200).json({
			message: "You have logged in",
			session
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.post('/register', function (req, res) {
	const { email, password } = req.body
	// console.log(req.body)

	if (!email || !password) {
		return res.status(400).json({
			message: "Error. Required fields are missing"
		})
	}

	try {
		const user = User.getByEmail(email)
		if (user) {
			return res.status(400).json({
				message: "Error. Such user already exists"
			})
		}

		const newUser = User.create({ email, password })
		const session = Session.create(newUser)
		Confirm.create(newUser.email)

		return res.status(200).json({
			message: "User successfully registered",
			session
		})
	} catch (err) {
		return res.status(400).json({
			message: "Error creating user"
		})
	}
})

router.post('/register-confirm', function (req, res) {
	const { code, token } = req.body

	// console.log(code, token)

	if (!code || !token) {
		return res.status(400).json({
			message: "Error. Required fields are missing"
		})
	}

	try {
		const session = Session.get(token)

		if (!session) {
			return res.status(400).json({
				message: "Error. You are not logged in"
			})
		}

		const email = Confirm.getData(code)
		// console.log("email from server:", email);

		if (!email) {
			return res.status(400).json({
				message: "Error. Code does not exist"
			})
		}

		if (email !== session.user.email) {
			return res.status(400).json({
				message: "Error. The code is invalid"
			})
		}

		const user = User.getByEmail(session.user.email)
		user.isConfirm = true
		session.user.isConfirm = true

		return res.status(200).json({
			message: "You have confirmed your email",
			session
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.post('/recovery', function (req, res) {
	const { email } = req.body

	// console.log(email)

	if (!email) {
		return res.status(400).json({
			message: "Error. Required fields are missing"
		})
	}

	try {
		const user = User.getByEmail(email)

		if (!user) {
			return res.status(400).json({
				message: "Error. User with this email does not exist"
			})
		}

		Confirm.create(email)

		return res.status(200).json({
			message: "The password reset code has been sent"
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.post('/recovery-confirm', function (req, res) {
	const { password, code } = req.body

	// console.log(password, code)

	if (!code || !password) {
		return res.status(400).json({
			message: "Error. Required fields are missing"
		})
	}

	try {
		const email = Confirm.getData(Number(code))
		if (!email) {
			return res.status(400).json({
				message: "Error. Code does not exist"
			})
		}

		const user = User.getByEmail(email)
		if (!user) {
			return res.status(400).json({
				message: "Error. User with this email does not exist"
			})
		}

		// Але залишати зміну пароля напряму - це дуже небезпечно, потім треба доробити функціонал
		user.password = password
		// console.log(user)

		const session = Session.create(user)

		return res.status(200).json({
			message: "Password changed",
			session
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}

})

// Підключаємо роутер до бек-енду
module.exports = router

