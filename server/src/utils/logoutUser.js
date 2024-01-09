const { Session } = require('./../class/session')

const logoutUser = (req, res) => {
	const token = req.headers.authorization;
	Session.delete(token);

	// Якщо користувач має куки
	res.clearCookie('sessionToken');

	// Повернення користувача на головну
	res.redirect('/');
};

// Перевірка сесії для кожного запиту
app.use((req, res, next) => {
	const token = req.headers.authorization;

	// Перевірка наявності сесії або її валідності
	const session = Session.get(token);

	if (!session) {
		// Якщо сесія вже не дійсна або відсутня, робимо logout
		logoutUser(req, res);
	} else {
		// Сесія дійсна, переходимо до наступного middleware або маршруту
		next();
	}
});