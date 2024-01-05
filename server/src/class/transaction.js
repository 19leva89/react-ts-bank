class Transaction {
	static list = [];
	static count = 0;

	constructor(token, paymentSystem, amount, status) {
		this.id = Transaction.count++;
		this.token = token;
		this.paymentSystem = paymentSystem
		this.amount = amount;
		this.status = status;
		this.date = Date.now();
	}

	getInfo() {
		return `Transaction of $${this.amount} at ${new Date(this.date)}`;
	}

	static create(token, paymentSystem, amount, status) {
		const transaction = new Transaction(token, paymentSystem, amount, status);
		console.log(transaction);

		this.list.push(transaction);

		return transaction;
	}
}

module.exports = { Transaction }