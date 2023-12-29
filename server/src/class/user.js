class User {
	static list = [];
	static count = 1;

	constructor({ email, password }) {
		this.id = User.count++;
		this.email = String(email).toLowerCase();
		this.password = String(password);
		this.isConfirm = false;
	}

	static create(data) {
		const user = new User(data);
		console.log(user);

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
}

module.exports = { User }