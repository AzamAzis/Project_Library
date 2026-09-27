const hanakoKun = {
	title: "Toilet Bound Hanako Kun",
	author: "AidaIro",
	pages: 131,
	read: "it's read",

	info: function() {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
	},
};

// console.log(hanakoKun.info());

const something = crypto.randomUUID();
// console.log(something);

// ||BOOK OVERFLOW
const bookContainer = document.querySelector(".book-container");
const books = bookContainer.querySelectorAll(".book");
const showMore = document.querySelector(".show-more");

const bookItems = Array.from(books);

window.addEventListener("resize", () => {
	if (getComputedStyle(bookContainer).gridTemplateColumns.split(" ").length > 1) {
		showMore.classList.toggle("hidden");
	}
})