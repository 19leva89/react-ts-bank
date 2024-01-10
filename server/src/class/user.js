class User {
	static list = [];
	static count = 1;

	constructor({ email, password }) {
		this.id = User.count++;
		this.email = String(email).toLowerCase();
		this.password = String(password);
		this.isConfirm = false;
		this.balance = 0;
		this.img = "./../img/user.svg";
		this.transactions = [];
		this.notifications = [];
	}

	static create(data) {
		const user = new User(data);
		// console.log(user);

		this.list.push(user);
		// console.log(this.list);

		return user;
	}

	static getByEmail(email) {
		return (
			this.list.find(
				(user) => user.email === String(email).toLowerCase()
			) || null
		);
	}

	changeEmail(newEmail) {
		const user = User.getByEmail(this.email);
		if (user) {
			user.email = String(newEmail).toLowerCase();
			this.email = String(newEmail).toLowerCase();
			return true; // Електронна адреса успішно змінена
		}
		return false; // Користувач не знайдений
	}

	changePassword(password, newPassword) {
		if (this.password === password) {
			this.password = String(newPassword);
			return true; // Пароль успішно змінено
		}
		return false; // Неправильний старий пароль
	}

	comparePassword(password) {
		return this.password === String(password);
		// Порівнюємо введений пароль зі збереженим у класі користувача
		// Найкраще використовувати бібліотеки для хешування паролів для більшої безпеки
	}

	depositBalance(amount) {
		this.balance += amount;
		return this.balance; // Повернути оновлений баланс користувача
	}

	withdrawBalance(amount) {
		this.balance -= amount;
		return this.balance;
	}

	getBalance() {
		return this.balance; // Повернути поточний баланс користувача
	}

	addTransaction(transaction) {
		this.transactions.push(transaction);
	}
}

module.exports = { User }