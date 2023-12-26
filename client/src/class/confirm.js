class Confirm {
	static #list = []

	constructor(data) {
		this.code = Confirm.generateCode()
		this.data = data
	}

	static generateCode = () => {
		return Math.floor(Math.random() * 9000) + 1000 // Повернення згенерованого коду
	}

	static create = (data) => {
		this.#list.push(new Confirm(data))

		setTimeout(() => { this.delete(code) }, 24 * 60 * 60 * 100) // 24 години у мілісекундах

		console.log(this.#list)
	}

	static delete = (data) => {
		const lenght = this.#list

		this.#list = this.#list.filter((item) => item.code !== code)

		return lenght > this.#list.length
	}

	static getData = (code) => {
		const obj = this.#list.find((item) => item.code === code)

		return obj ? obj.data : null
	}
}

module.exports = { Confirm }