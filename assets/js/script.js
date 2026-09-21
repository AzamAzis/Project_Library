const hanakoKun = {
	title: "Toilet Bound Hanako Kun",
	author: "AidaIro",
	pages: 131,
	read: "it's read",

	info: function() {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
	},
};

console.log(hanakoKun.info());

const something = crypto.randomUUID();
console.log(something);