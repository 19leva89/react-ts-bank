// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('./../class/user')
const { Session } = require('./../class/session')
const { Transaction } = require('./../class/transaction')


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

router.get('/user-notifications/', function (req, res) {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({
			message: "Необхідна авторизація для отримання нотифікацій",
		});
	}

	const session = Session.get(token); // Знаходження сесії за токеном

	if (!session) {
		return res.status(401).json({
			message: "Недійсний токен сесії, авторизація відхилена",
		});
	}

	const user = User.list.find(user => user.id === session.user.id);

	if (!user) {
		return res.status(404).json({
			message: "Користувача не знайдено",
		});
	}

	res.status(200).json({
		notifications: user.notifications,
	});
});

router.post('/user-notifications', function (req, res) {
	const { eventTitle, eventTime, eventType } = req.body;
	const token = req.headers.authorization;

	if (!eventTitle || !eventTime || !eventType || !token) {
		return res.status(400).json({
			message: "Error: Required fields are missing",
		});
	}

	try {
		const session = Session.get(token);

		if (!session) {
			return res.status(400).json({
				message: "Error: Invalid session or unauthorized access",
			});
		}

		const user = User.list.find((user) => user.id === session.user.id);

		if (!user) {
			return res.status(400).json({
				message: "Error: User not found",
			});
		}

		if (!user.notifications) {
			user.notifications = [];
		}

		user.notifications.push({ eventTitle, eventTime, eventType });

		res.status(200).json({
			message: "Notification saved successfully",
			notifications: user.notifications,
		});
	} catch (err) {
		console.error("Error processing request:", err);
		res.status(500).json({
			message: "An error occurred while processing the request",
		});
	}
});

router.post('/user-receive', function (req, res) {
	const { paymentSystem, amount, status } = req.body;
	const token = req.headers.authorization;

	if (!paymentSystem || !amount || !status || !token) {
		return res.status(400).json({
			message: "Error: Required fields are missing",
		});
	}

	try {
		const session = Session.get(token);

		if (!session) {
			return res.status(400).json({
				message: "Error: Invalid session or unauthorized access",
			});
		}

		const user = User.list.find((user) => user.id === session.user.id);

		if (!user) {
			return res.status(400).json({
				message: "Error: User not found",
			});
		}

		user.depositBalance(amount);


		const newTransaction = Transaction.create(token, paymentSystem, amount, status)
		// console.log("Receipt newTransaction:", newTransaction)

		res.status(200).json({
			message: "Баланс поповнено успішно",
			transaction: newTransaction,
		});
	} catch (err) {
		console.error("Error processing request:", err);
		res.status(500).json({
			message: "An error occurred while processing the request",
		});
	}
});

router.post('/user-send', function (req, res) {
	const { email, paymentSystem, amount, status } = req.body;
	const token = req.headers.authorization;

	if (!email || !paymentSystem || !amount || !status || !token) {
		return res.status(400).json({
			message: "Error: Required fields are missing",
		});
	}

	try {
		const session = Session.get(token);
		if (!session) {
			return res.status(400).json({
				message: "Error: Invalid session or unauthorized access",
			});
		}

		const sender = User.list.find((user) => user.id === session.user.id);
		if (!sender) {
			return res.status(400).json({
				message: "Error: Sender not found",
			});
		}

		const recipient = User.list.find((user) => user.email === email);
		if (!recipient) {
			return res.status(400).json({
				message: "Error: Recipient not found",
			});
		}

		if (sender.balance < amount) {
			return res.status(400).json({
				message: "Error: Insufficient balance",
			});
		}

		sender.withdrawBalance(amount);
		recipient.depositBalance(amount);

		const newTransaction = Transaction.create(token, paymentSystem, amount, status)
		// console.log("Sending newTransaction:", newTransaction)

		res.status(200).json({
			message: "Баланс поповнено успішно",
			transaction: newTransaction,
		});
	} catch (err) {
		console.error("Error processing request:", err);
		res.status(500).json({
			message: "An error occurred while processing the request",
		});
	}
});

router.get('/user-balance', function (req, res) {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({
			message: "Необхідна авторизація для отримання нотифікацій",
		});
	}

	const session = Session.get(token); // Знаходження сесії за токеном

	if (!session) {
		return res.status(401).json({
			message: "Недійсний токен сесії, авторизація відхилена",
		});
	}

	const user = User.list.find(user => user.id === session.user.id);

	if (!user) {
		return res.status(404).json({
			message: "Користувача не знайдено",
		});
	}

	const userBalance = user.getBalance();

	res.status(200).json({
		message: "Баланс завантажено",
		userBalance
	});
});

// Підключаємо роутер до бек-енду
module.exports = router
