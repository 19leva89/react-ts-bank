// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('./../class/user')

// ================================================================

router.post('/user-new-email', function (req, res) {
	const { id, newEmail, password } = req.body;
	console.log(req.body)

	if (!id || !newEmail || !password) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const userToUpdate = User.getByEmail(newEmail)

		if (userToUpdate) {
			return res.status(400).json({
				message: "Помилка. Користувач з таким email вже існує"
			})
		}

		const user = User.list.find(user => user.id === parseInt(id));

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувача не знайдено"
			});
		}

		const emailChanged = user.changeEmail(newEmail);
		if (emailChanged) {
			return res.status(200).json({
				message: "Email успішно змінено",
				user
			});
		} else {
			return res.status(400).json({
				message: "Помилка зміни email"
			});
		}
	} catch (err) {
		return res.status(400).json({
			message: "Помилка зміни email"
		})
	}
})

router.post('/user-new-password', function (req, res) {
	const { id, password, newPassword } = req.body;
	console.log(req.body)

	if (!id || !password || !newPassword) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const user = User.list.find(user => user.id === parseInt(id));

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувача не знайдено"
			});
		}

		const passwordChanged = user.changePassword(password, newPassword);
		if (passwordChanged) {
			return res.status(200).json({
				message: "Password успішно змінено",
				user
			});
		} else {
			return res.status(400).json({
				message: "Помилка зміни password"
			});
		}
	} catch (err) {
		return res.status(400).json({
			message: "Помилка зміни password"
		})
	}
})

router.get('/user-notifications/:id', function (req, res) {
	const userId = req.params.id;

	// Пошук користувача за ідентифікатором
	const user = User.list.find(user => user.id === parseInt(userId));

	if (!user) {
		// Якщо користувача не знайдено, поверніть відповідний статус та повідомлення
		return res.status(404).json({
			message: "Користувача не знайдено"
		});
	}

	// Повернення списку нотифікацій користувача
	res.status(200).json({
		notifications: user.notifications
	});
});

router.post('/user-notifications', function (req, res) {
	const { id, eventType, time } = req.body;
	console.log(req.body)

	if (!id || !eventType || !time) {
		return res.status(400).json({
			message: "Помилка. Обов'язкові поля відсутні"
		})
	}

	try {
		const user = User.list.find(user => user.id === parseInt(id));

		if (!user) {
			return res.status(400).json({
				message: "Помилка. Користувача не знайдено"
			});
		}

		if (!user.notifications) {
			user.notifications = [];
		}

		user.notifications.push({ eventType, time });

		res.status(200).json({
			message: "Нотифікація збережена успішно",
			notifications: user.notifications
		});

	} catch (err) {
		res.status(500).json({
			message: "Сталася помилка під час обробки запиту"
		});
	}
})

// Підключаємо роутер до бек-енду
module.exports = router
