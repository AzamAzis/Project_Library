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

// ||BOOK OVERFLOW TRANSITION
const bookContainer = document.querySelector(".book-container");
const books = bookContainer.querySelectorAll(".book");
const showMore = document.querySelector(".show-more");

const bookItems = Array.from(books);
const savedBookIds = [];

const allBookHeights = [];
let totalBookHeight;

bookItems.forEach((item) => {
	const bookId = crypto.randomUUID();//**BOOK ID */
	item.id = bookId;
	savedBookIds.push(item.id);

	allBookHeights.push(getHeight(item));
});

const bookContainerGap = parseFloat(getGap(bookContainer));

let columnLength = bookContainerColumnLength();

toggleShowMoreBtn(columnLength);
overflowHide(columnLength);

window.addEventListener("resize", () => { //**WINDOW RESIZE */
	columnLength = bookContainerColumnLength();
	toggleShowMoreBtn(columnLength);
	overflowHide(columnLength);
});

let bookContainerHeight = getHeight(bookContainer);
const increasePointHeight = getHeight(bookContainer);
const maxHeight = savedBookIds.length * increasePointHeight;
// !!CREATE NEXT

showMore.addEventListener("click", () => { //**SHOW MORE or SHOW LESS BTN */
	if (bookContainerHeight === maxHeight) {
		bookItems.forEach((item) => {
			bookContainer.style.height = `${getHeight(item) + bookContainerGap}px`;
			bookContainerHeight = 0;
		});
	}

	if (showMore.textContent === "Show Less") {
		showMore.textContent = "Show More";
	}

	if (bookContainerHeight < maxHeight) {
		bookContainerHeight += increasePointHeight;
		bookContainer.style.height = `${bookContainerHeight}px`;
		showMore.textContent = "Show More";
	}

	if (bookContainerHeight === maxHeight) {
			showMore.textContent = "Show Less";
	}
});

// **FUNCTIONS
function bookContainerColumnLength() {
	return getComputedStyle(bookContainer).gridTemplateColumns.split(" ").length;
};

function toggleShowMoreBtn(length) {
	if (length > 1 || length < 1) {
		showMore.classList.add("hidden");
		return;
	}

	showMore.classList.remove("hidden");
}

function getHeight(item) {
	const height = item.getBoundingClientRect().height;
	return height;
}

function getGap(item) {
	const gap = getComputedStyle(item).gap;
	return gap;
}

function toHide(item) {
	item.classList.add("hidden");
}

function toVisible(item) {
	item.classList.remove("hidden");
}

function overflowHide(length) {
	bookItems.forEach((item, index, array) => {
		// const bookHeight = getHeight(array[0]);

		allBookHeights.reduce((x, y) => {
			totalBookHeight = x + y;
			return totalBookHeight;
		});

		const averageBookHeight = totalBookHeight / savedBookIds.length;
		if (length === 1) {
			bookContainer.classList.add("overflow-hidden");
			bookContainer.style.height = `${averageBookHeight + bookContainerGap}px`;

			if (!(array[0] === item)) {
				array[index].classList.add("hidden");
			}
		} else {
			bookContainer.classList.remove("overflow-hidden");
			bookContainer.style.removeProperty("height");
			array[index].classList.remove("hidden");
		}
	});
}