class Transaction {
	static list = [];
	static count = 1;


	constructor(token, paymentSystem, amount, status, userId, userImg) {
		this.id = Transaction.count++;
		this.token = token;
		this.paymentSystem = paymentSystem
		this.amount = amount;
		this.status = status;
		this.date = Date.now();
		this.userId = userId;
		this.userImg = userImg;
	}

	getInfo() {
		return `Transaction of $${this.amount} at ${new Date(this.date)}`;
	}

	static create(token, paymentSystem, amount, status, userId, userImg) {
		const transaction = new Transaction(token, paymentSystem, amount, status, userId, userImg);
		// console.log("class Transaction:", transaction);

		this.list.push(transaction);

		return transaction;
	}
}

module.exports = { Transaction }