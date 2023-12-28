// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('./../class/user')
const { Confirm } = require('./../class/confirm')
const { Session } = require('./../class/session')


User.create({
	email: 'user@mail.com',
	password: 123,
})

User.create({
	email: 'admin@mail.com',
	password: 123,
})

User.create({
	email: 'developer@mail.com',
	password: 123,
})

// ================================================================

router.get('/register', function (req, res) {
	try {

	} catch (err) {

	}
})

router.post('/register', function (req, res) {
	const { email, password } = req.body
	console.log(req.body)

	if (!email || !password) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const user = User.getByEmail(email)

		if (user) {
			return res.status(400).json({
				message: "Помилка. Такий користувач вже існує"
			})
		}

		const newUser = User.create({ email, password })
		const session = Session.create(newUser)
		Confirm.create(newUser.email)

		return res.status(200).json({
			message: "Користувач успішно зареєстрований",
			session
		})
	} catch (err) {
		return res.status(400).json({
			message: "Помилка створення користувача"
		})
	}
})

router.get('/recovery', function (req, res) {
	try {

	} catch (err) {

	}
})

router.post('/recovery', function (req, res) {
	const { email } = req.body

	console.log(email)

	if (!email) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const user = User.getByEmail(email)

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувача з таким e-mail не існує"
			})
		}

		Confirm.create(email)

		return res.status(200).json({
			message: "Код для відновлення паролю відправлено"
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.get('/recovery-confirm', function (req, res) {
	try {

	} catch (err) {

	}
})

router.post('/recovery-confirm', function (req, res) {
	const { password, code } = req.body

	console.log(password, code)

	if (!code || !password) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const email = Confirm.getData(Number(code))

		if (!email) {
			return res.status(400).json({
				message: "Помилка. Код не існує"
			})
		}

		const user = User.getByEmail(email)

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувача з таким e-mail не існує"
			})
		}

		// Але залишати зміну пароля напряму - це дуже небезпечно, потім треба доробити функціонал
		user.password = password
		console.log(user)

		const session = Session.create(user)

		return res.status(200).json({
			message: "Пароль змінено",
			session
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}

})

router.get('/register-confirm', function (req, res) {
	const { renew, email } = req.query

	if (renew) {
		Confirm.create(email)
	}
})

router.post('/register-confirm', function (req, res) {
	const { code, token } = req.body

	console.log(code, token)

	if (!code || !token) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const session = Session.get(token)

		if (!session) {
			return res.status(400).json({
				message: "Помилка. Ви не увійшли в акаунт"
			})
		}

		const email = Confirm.getData(code)

		if (!email) {
			return res.status(400).json({
				message: "Помилка. Код не існує"
			})
		}

		if (email !== session.user.email) {
			return res.status(400).json({
				message: "Помилка. Код не дійсний"
			})
		}

		const user = User.getByEmail(session.user.email)
		user.isConfirm = true
		session.user.isConfirm = true

		return res.status(200).json({
			message: "Ви підтвердили свою пошту",
			session
		})

	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}


})

router.get('/login', function (req, res) {

})

router.post('/login', function (req, res) {
	const { email, password } = req.body

	console.log(email, password)

	if (!email || !password) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const user = User.getByEmail(email)

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувач з таким e-mail не існує"
			})
		}

		if (user.password !== password) {
			return res.status(400).json({
				message: "Помилка. Пароль не підходить"
			})
		}

		const session = Session.create(user)

		return res.status(200).json({
			message: "Ви увійшли",
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
