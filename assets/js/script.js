const bookContainer = document.querySelector(".book-container");
const books = bookContainer.querySelectorAll(".book");
const showMoreBtn = document.querySelector(".show-more");
const screen = window.matchMedia("(width < 680px)");

const bookItems = Array.from(books);
const savedBookId = [];

let initialDisplay = 0;
let nextDisplay = 1;
let isRemoved = true;

const next = getNextBook(initialDisplay, nextDisplay);
const bookContainerGap = Number.parseFloat(getComputedStyle(bookContainer).gap);
const initialBookHeight = getBookHeight(next);
let initialBookContainerHeight = getBookContainerHeight(initialBookHeight, bookContainerGap);

bookItems.forEach((item) => {
	const id = crypto.randomUUID();
	item.id = id;
	savedBookId.push(item.id);
});

toResponsive();
screen.addEventListener("change", toResponsive);

showMoreBtn.addEventListener("click", showMore);

// ||FUNCTIONS
function toResponsive() {
	const smallScreen = screen.matches;

	if (smallScreen) {
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap)
		;
		initialDisplay = 0;
		nextDisplay = 1;
		if (isRemoved) {
			showMoreBtn.textContent = "Show More";
			isRemoved = false;
		}
		removeHidden(showMoreBtn);
		setHeight(bookContainer, initialBookContainerHeight);
		overflowHide(bookContainer);
		hideBook();
	} else {
		addHidden(showMoreBtn);
		unsetHeight(bookContainer);
		overflowUnHide(bookContainer);
		unHideBook();
	}
}

function showMore() {
	initialDisplay++;
	nextDisplay++;
	const nextBook = getNextBook(initialDisplay, nextDisplay);
	if (nextDisplay <= savedBookId.length) {
	removeHidden(nextBook[0]);

	const height = getBookHeight(nextBook) + bookContainerGap;
	initialBookContainerHeight += height;
	setHeight(bookContainer, initialBookContainerHeight);
	}

	if (!isRemoved) {
		bookContainer.removeEventListener("transitionend", hideBook);
		isRemoved = true;
	}

	if (nextDisplay === savedBookId.length) {
		showMoreBtn.textContent = "Show Less";
		return;
	} else if (nextDisplay > savedBookId.length) {
		showMoreBtn.textContent = "Show More";
		initialDisplay = 0;
		nextDisplay = 1;
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap)
		;
		setHeight(bookContainer, initialBookContainerHeight);
		bookContainer.addEventListener("transitionend", hideBook);
		isRemoved = false;
	}
}

function hideBook() {
	bookItems.forEach((item, index, array) => {
		if (array[index] === array[0]) return;
		addHidden(item);
	});
}

function unHideBook() {
	bookItems.forEach((item) => {
		removeHidden(item);
	});
}

function addHidden(item) {
	item.classList.add("hidden");
}

function removeHidden(item) {
	item.classList.remove("hidden");
}

function setHeight(item, height) {
	item.style.height = `${height}px`;
}

function unsetHeight(item) {
	item.style.removeProperty("height");
}

function overflowHide(item) {
	item.style.overflow = "hidden";
}

function overflowUnHide(item) {
	item.style.overflow = "visible";
}

function getNextBook(initialDisplay, nextDisplay) {
	const storage = bookItems.slice(initialDisplay, nextDisplay);
	return storage;
}

function getBookHeight(book) {
	const bookHeight = book[0].getBoundingClientRect().height;
	return bookHeight;
}

function getBookContainerHeight(value, gap) {
	const height = value + gap;
	return height;
}