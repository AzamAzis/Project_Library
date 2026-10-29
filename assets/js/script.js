const addBookBtn = document.querySelector(".add");
const updateBtn = document.querySelector(".update");
const removeBtn = document.querySelector(".remove");
const confirmBtn = document.querySelector(".confirm");
const cancelBtn = document.querySelector(".cancel");
const checkAllBtn = document.querySelector(".check-all");
const uncheckAllBtn = document.querySelector(".uncheck-all");
const bookContainer = document.querySelector(".book-container");
const showMoreBtn = document.querySelector(".show-more");
const addBookModal = document.querySelector(".add-book-modal");
const closeBtn = addBookModal.querySelector(".__close");
const form = addBookModal.querySelector(".__form");
const coverInput = addBookModal.querySelector(".__cover");
const titleInput = addBookModal.querySelector(".__title");
const invalidMessage = addBookModal.querySelector(".__required");
const invalidLink = addBookModal.querySelector(".__incorrect-link");
const volInput = addBookModal.querySelector(".__vol");
const authorInput = addBookModal.querySelector(".__author");
const linkInput = addBookModal.querySelector(".__link");
const markAsReadInput = addBookModal.querySelector(".__read-check");
const upBtn = document.querySelector(".up");
const upIcon = upBtn.querySelector(".__icon");
const addedMessage = document.querySelector(".added");
const searchInput = document.querySelector(".__search");
const searchBtn = document.querySelector(".__search-btn");
const clearBtn = document.querySelector(".__clear");

const screens = window.matchMedia("(width < 680px)");

const controller = new AbortController();

const preview = document.querySelector(".__preview");
const previewPrevChild = preview.firstElementChild;
const cover = document.createElement("img");

const saveBtn = document.querySelector(".__save");

const fileReader = new FileReader();

const bookOne = {
	cover: "assets/img/book-cover/Hanako-cover.jpg",
	title: "Toilet-bound Hanako-Kun",
	vol: 1,
	author: "AidaIro",
	link: "https://www.amazon.com/dp/B074QTZGJ3?lv=shuf&channelId=500&plpRedirect=mhFallback",
	markAsRead: true,
	id: `book-${crypto.randomUUID()}`,
};

const bookTwo = {
	cover: "assets/img/book-cover/Made-in-Abyss-cover.jpg",
	title: "Made in Abyss",
	vol: 1,
	author: "Akihito Tsukushi",
	link: "https://www.amazon.com/dp/1626927731?lv=shuf&channelId=500&plpRedirect=mhFallback",
	markAsRead: true,
	id: `book-${crypto.randomUUID()}`,
};

const bookThree = {
	cover: "assets/img/book-cover/Asuras-Verdict-Cover.webp",
	title: "Asura's Verdict",
	vol: 1,
	author: "Utsugi Unohana",
	link: "https://www.ebay.com/itm/396332939412",
	markAsRead: true,
	id: `book-${crypto.randomUUID()}`,
};

const localLibrary = JSON.parse(localStorage.getItem("localLibrary"));

const myLibrary = localLibrary ? localLibrary : [bookOne, bookTwo, bookThree];

const currentDisplay = 0;
const nextDisplay = 1;
let isRemoved = true;

// ||DISPLAY BOOKS
for (let i = 0; i < 6; i++) {
	const book = myLibrary[i];

	if (!book) continue;

	createBook(book);
}

const checkboxes = bookContainer.querySelectorAll(".__checkbox");
const checkboxItems = [...checkboxes];

const next = getNextBook(currentDisplay);
const bookContainerGap = Number.parseFloat(getComputedStyle(bookContainer).gap);
const initialBookHeight = getBookHeight(next);
let initialBookContainerHeight = getBookContainerHeight(
	initialBookHeight,
	bookContainerGap,
);

// ||RESPONSIVENESS
toResponsive();
screens.addEventListener("change", toResponsive);

showMoreBtn.addEventListener("click", showMore);

// ||SEARCH
searchInput.addEventListener("input", (elem) => {
	if (elem.currentTarget.value) {
		removeSynchronously(clearBtn, "hidden", "__clear-visible");
	} else {
		removeSlowly(clearBtn, "__clear-visible");
		clearKeyword();
	}
});

clearBtn.addEventListener("click", clearSearch);

searchBtn.addEventListener("click", searchBook);

// ||UPDATE
updateBtn.addEventListener("click", update);
cancelBtn.addEventListener("click", cancelUpdate);
confirmBtn.addEventListener("click", confirmUpdate);

// ||CHECK
checkAllBtn.addEventListener("click", checkAll);
uncheckAllBtn.addEventListener("click", uncheckAll);

// ||OPEN DIALOG
addBookBtn.addEventListener("click", bodyOverflowHide);
addBookBtn.addEventListener("click", endAlertImmediately);

// ||CLOSE DIALOG
closeBtn.addEventListener("click", toClose);

// ||ADD PREVIEW
coverInput.addEventListener("change", (event) => {
	for (const file of event.currentTarget.files) {
		readFileImg(cover, file);

		preview.firstElementChild.replaceWith(cover);
	}
});
// ||SHOW INVALID INPUT MESSAGE
titleInput.addEventListener("input", checkValidTitle);
linkInput.addEventListener("input", checkValidLink);

// ||ADD BOOK
addBookBtn.addEventListener("click", () => {
	saveBtn.addEventListener("click", addBook);
});

// ||REMOVE BOOK
removeBtn.addEventListener("click", removeBook);

// ||DROP COVER
preview.addEventListener("drop", dropHandler);

// ||PREVENT DROPPING FILES
window.addEventListener("drop", (event) => {
	if ([...event.dataTransfer.items].some((item) => item.kind === "file")) {
		event.preventDefault();
	}
});

// ||DRAGOVER
preview.addEventListener("dragover", (event) => {
	const fileItem = [...event.dataTransfer.items].filter(
		(item) => item.kind === "file",
	);

	if (fileItem.length > 0) {
		event.preventDefault();
		if (fileItem.some((item) => item.type.startsWith("image/"))) {
			event.dataTransfer.dropEffect = "copy";
		} else {
			event.dataTransfer.dropEffect = "none";
		}
	}
});

window.addEventListener("dragover", (event) => {
	const fileItems = [...event.dataTransfer.items].filter(
		(item) => item.kind === "file",
	);

	if (fileItems.length > 0) {
		event.preventDefault();

		if (!preview.contains(event.target)) {
			event.dataTransfer.dropEffect = "none";
		}
	}
});

// ||BOOK CHECK
checkboxItems.forEach((item) => {
	item.addEventListener("change", toCheck);
});

// ||UP
	upBtn.addEventListener("click", goUp);

// ||FUNCTIONS
function toResponsive() {
	const smallScreen = screens.matches;

	if (smallScreen) {
		initialBookContainerHeight = getBookContainerHeight(
			initialBookHeight,
			bookContainerGap,
		);

		if (!isRemoved) {
			createPreviewText(preview);
			isRemoved = true;
		}

		removeUpBtn();

		window.addEventListener("scroll", showUpBtn);

		showMoreBtn.classList.remove("hidden");
		setHeight(bookContainer, initialBookContainerHeight);
		overflowHide(bookContainer);
		hideBook();

		removeShowBtn();
		clearBtn.addEventListener("click", removeShowBtn);
	} else {
		showMoreBtn.classList.add("hidden");
		unsetHeight(bookContainer);
		overflowUnHide(bookContainer);
		unHideBook();
		removeUpBtn();

		window.addEventListener("scroll", showUpBtn);

		upBtn.addEventListener("mouseover", () => {
			upIcon.src = "assets/img/other/boy-up.png";
		});
	}
}

function removeShowBtn() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	if (currentBooks.length <= 1) {
		if (screens.matches) {
			showMoreBtn.classList.add("hidden");
		}
	} else {
		if (screens.matches) {
			showMoreBtn.classList.remove("hidden");
		}
	}

	clearBtn.removeEventListener("click", removeShowBtn);
}

function removeUpBtn() {
	if (!upBtn.classList.contains("hidden")) {
		upBtn.classList.add("hidden");
	}
}

function showUpBtn() {
	let location;
	const currentBooks = bookContainer.querySelectorAll(".book");

	if (screens.matches) {
		location = 2;
	} else {
		location = 6;
	}

	if (
		!currentBooks[location] ||
		currentBooks[location].classList.contains("invincible-book")
	) return;

	const bookLocation = currentBooks[location].getBoundingClientRect().y;

	if (window.scrollY > bookLocation) {
		upBtn.classList.remove("hidden");
	} else if (
		window.scrollY < bookLocation &&
		!upBtn.classList.contains("go-up")
	) {
		upBtn.classList.add("hidden");
	}
}

function makeBookInvincible() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks].filter(checkUnHiddenBooks);
	currentBookItems.forEach((book, index) => {
		if (index !== 0) {
			book.classList.add("invincible-book");
		}
	});

	bookContainer.removeEventListener("transitionend", makeBookInvincible);
}

function showMore() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];

	if (showMoreBtn.textContent === "Show Less") {
		showMoreBtn.textContent = "Show More";
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap);
		;
		setHeight(bookContainer, initialBookContainerHeight);
		bookContainer.addEventListener("transitionend", makeBookInvincible);
	}

	const hiddenBooks =
		currentBookItems.filter(checkBookInvincibility);
	;

	if (!hiddenBooks[0]) return;
	hiddenBooks[0].classList.remove("invincible-book");

	const visibleBooks =
		currentBookItems.filter(checkBookVisibility);
	;

	if (visibleBooks.length <= currentBookItems.length) {
		const height = getBookHeight(hiddenBooks[0]) + bookContainerGap;
		initialBookContainerHeight =
			getBookHeight(bookContainer);
		;
		initialBookContainerHeight += height;
		setHeight(bookContainer, initialBookContainerHeight);
	}

	if (visibleBooks.length === currentBookItems.length) {
		showMoreBtn.textContent = "Show Less";
	}
}

function checkBookInvincibility(book) {
	return book.classList.contains("invincible-book");
}

function checkBookVisibility(book) {
	return !book.classList.contains("invincible-book");
}

function hideBook() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	currentBookItems.forEach((item, index) => {
		if (index !== 0) {
			item.classList.add("invincible-book");
		}
	});
}

function unHideBook() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	currentBookItems.forEach((item) => {
		if (item.classList.contains("invincible-book")) {
			item.classList.remove("invincible-book");
		}
	});
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

function getNextBook(currentDisplay) {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const storage = currentBookItems[currentDisplay];
	return storage;
}

function getBookHeight(book) {
	const bookHeight = book.getBoundingClientRect().height;
	return bookHeight;
}

function getBookContainerHeight(value, gap) {
	const height = value + gap;
	return height;
}

function addBook(event) {
	event.preventDefault();
	const newBookCard = document.createElement("li");
	const newCheckbox = document.createElement("input");
	const newCover = document.createElement("img");
	const newTitle = document.createElement("h2");
	const newDetail = document.createElement("ul");
	const newVol = document.createElement("li");
	const newAuthor = document.createElement("li");
	const newLinkContainer = document.createElement("li");
	const newLink = document.createElement("a");
	const newMark = document.createElement("div");
	const newEditBtn = document.createElement("button");
	const newReadCheckInput = document.createElement("input");
	const newMarkLabel = document.createElement("label");
	const randomId = `book-${crypto.randomUUID()}`;

	const isCoverExist = cover.getAttribute("src");
	const isTitleExist = Boolean(titleInput.value);
	const isLinkValid = linkInput.checkValidity();

	const prevMessage = "Book has been added to your library.";

	if (!isTitleExist) {
		showInvalidMessage(invalidMessage);

		if (!isLinkValid) {
			showInvalidMessage(invalidLink);
		}

		return;
	}

	if (!isLinkValid) {
		showInvalidMessage(invalidLink);
		return;
	}

	if (updateBtn.disabled) {
		updateBtn.disabled = false;
	}

	createBookCard(newBookCard, randomId);

	if (screens.matches) {
		newBookCard.classList.add("invincible-book");
	}

	createBookCheckbox(newCheckbox, titleInput.value, newBookCard.dataset.id);

	if (!isCoverExist) {
		const placeholderImg = "assets/img/book-cover/placeholder-cover.jpg";
		const placeholderAlt = "Hanako-Kun Peace Sign";
		createBookCover(newCover, placeholderImg, placeholderAlt);
	} else {
		createBookCover(newCover, cover.src, cover.alt);
	}

	// ##TITLE
	createNewDetail(newTitle, titleInput, "__title", "overflow-hidden");

	// ##DETAIL
	newDetail.classList.add("__detail");

	// ##VOL
	createNewDetail(newVol, volInput, "__vol", "overflow-hidden");

	// ##AUTHOR
	createNewDetail(newAuthor, authorInput, "__author", "overflow-hidden");

	// ##LINK
	createBookLink(newLinkContainer, newLink, linkInput.value);

	// ##MARK
	createMarkAsRead(newMark, newReadCheckInput, newMarkLabel, newReadCheckInput.id);

	// ##EDIT BTN
	createEditBtn(newEditBtn, newBookCard.dataset.id);

	addBookToLibrary(
		newCover.src,
		titleInput.value,
		volInput.value,
		authorInput.value,
		linkInput.value,
		markAsReadInput.checked,
		newBookCard.dataset.id,
	);

	const localBooks = JSON.stringify(myLibrary);

	localStorage.setItem("localLibrary", localBooks);

	// !!ADD TO DETAIL
	newDetail.append(newTitle, newVol, newAuthor, newLinkContainer);

	// !!ADD TO BOOK
	newBookCard.append(
		newCheckbox,
		newCover,
		newTitle,
		newDetail,
		newMark,
		newEditBtn,
	);

	if (addedMessage.textContent !== prevMessage) {
		addedMessage.textContent = prevMessage;
	}

	alert();

	if (myLibrary.length <= 6) {
		bookContainer.appendChild(newBookCard);
	}

	if (
		showMoreBtn.classList.contains("hidden") &&
		myLibrary.length > 1 &&
		screens.matches
	) {
		showMoreBtn.classList.remove("hidden");
	}

	if (updateBtn.disabled) {
		updateBtn.disabled = false;
	}

	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];

	if (
		nextDisplay < currentBookItems.length &&
		(currentBookItems.length === myLibrary.length) &&
		showMoreBtn.textContent === "Show Less"
	) {
		showMoreBtn.textContent = "Show More";
	}

	if (document.body.classList.contains("overflow-hidden")) {
		document.body.classList.remove("overflow-hidden");
	}

	createPreviewText(preview);
	form.reset();
	saveBtn.removeEventListener("click", addBook);
	addBookModal.close();
}

function alert() {
	removeSynchronously(addedMessage, "hidden", "alert");

	setTimeout(stopAlert, 5000);
}

function stopAlert() {
	if (addedMessage.classList.contains("alert")) {
		addedMessage.classList.remove("alert");
		addedMessage.addEventListener("animationend", hideMessage);
	}

}

function endAlertImmediately() {
	if (addedMessage.classList.contains("alert")) {
		addedMessage.classList.remove("alert");
		addedMessage.classList.add("hidden");
	}
}

function showInvalidMessage(message) {
	addBookModal.showModal();
	removeSynchronously(message, "hidden", "__message");
}

function removeSynchronously(item, class1, class2) {
	item.classList.remove(class1);
	setTimeout(() => {
		item.classList.add(class2);
	});
}

function createNewDetail(item, value, __class, ...utilities) {
	inputValue(item, __class, value.value);

	for (const utility of utilities) {
		item.classList.add(__class, utility);
	}
}

function displayImage(files) {
	for (const file of files) {
		if (file.type.startsWith("image/")) {
			readFileImg(cover, file);

			preview.firstElementChild.replaceWith(cover);
		}
	}
}

function dropHandler(ev) {
	ev.preventDefault();
	const file = [...ev.dataTransfer.items]
		.map((item) => item.getAsFile())
		.filter((file) => file);
	displayImage(file);

	coverInput.files = ev.dataTransfer.files;
}

function toClose() {
	controller.abort("Stop event listener for saving a book and start event listener that adds a book");
	createPreviewText(preview);

	if (invalidMessage.classList.contains("__message")) {
		removeInvalidMessage(invalidMessage);
	}

	if (invalidLink.classList.contains("__message")) {
		removeInvalidMessage(invalidLink);
	}

	if (document.body.classList.contains("overflow-hidden")) {
		document.body.classList.remove("overflow-hidden");
	}

	form.reset();
}

function removeInvalidMessage(message) {
	message.classList.add("hidden");
	message.classList.remove("__message");
}

function checkValidTitle() {
	removeMessage(titleInput, invalidMessage);
}

function checkValidLink() {
	removeMessage(linkInput, invalidLink);
}

function removeMessage(input, invalid) {
	if (
		input.validity.valid &&
		invalid.classList.contains("__message")
	) {
		invalid.classList.remove("__message");
		invalid.addEventListener("transitionend", hideMessage, {once: true});
	}
}

function hideMessage(e) {
	e.currentTarget.classList.add("hidden");
}

function Book(cover, title, vol, author, link, markAsRead, id) {
	if (!new.target) {
		throw Error("You must use the 'new' operator to call the constructor");
	}

	this.cover = cover;
	this.title = title;
	this.vol = vol;
	this.author = author;
	this.link = link;
	this.markAsRead = markAsRead;
	this.id = id;
}

function addBookToLibrary(cover, title, vol, author, link, markAsRead, id) {
	const book = new Book(cover, title, vol, author, link, markAsRead, id);
	const newCover = book.cover;
	const newTitle = book.title;
	const newVol = book.vol;
	const newAuthor = book.author;
	const newLink = book.link;
	const newMarkAsRead = book.markAsRead;
	const newId = book.id;

	const newBook = {
		cover: newCover,
		title: newTitle,
		vol: newVol,
		author: newAuthor,
		link: newLink,
		markAsRead: newMarkAsRead,
		id: newId,
	};

	myLibrary.push(newBook);
}

function createPreviewText(parent) {
	if (parent.firstElementChild !== previewPrevChild) {
		parent.firstElementChild.replaceWith(previewPrevChild);
	}
}

function readFileImg(item, file) {
	fileReader.addEventListener("load", () => {
		item.src = fileReader.result;
		item.alt = `${file.name}`;
		item.classList.add("__img-cover", "img-size");
	});

	if (file) {
		fileReader.readAsDataURL(file);
	}
}

function update() {
	const currentEditBtns = bookContainer.querySelectorAll(".__edit");
	const currentCheckboxes = document.querySelectorAll(".book .__checkbox");
	const currentEditBtnItems = [...currentEditBtns];
	const currentCheckboxItems = [...currentCheckboxes];
	currentEditBtnItems.forEach((item) => {
		item.classList.remove("hidden");
	});
	currentCheckboxItems.forEach((item) => {
		item.classList.remove("hidden");
	});

	addBookBtn.classList.add("hidden");
	updateBtn.classList.add("hidden");
	removeBtn.classList.remove("hidden");
	checkAllBtn.classList.remove("hidden");
	uncheckAllBtn.classList.remove("hidden");
	confirmBtn.classList.remove("hidden");
	cancelBtn.classList.remove("hidden");

	stopAlert();
}

function checkAll() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];

	currentCheckboxItems.forEach((item, index) => {
		const isTemporalRemoved =
			currentBookItems[index].classList.contains("hidden");
		item.checked = true;

		if (isTemporalRemoved) {
			item.checked = false;
		}
	});

	checkAllBtn.disabled = true;
	uncheckAllBtn.disabled = false;

	removeBtn.disabled = false;
}

function uncheckAll() {
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];

	currentCheckboxItems.forEach((item) => {
		if (item.checked) {
			item.checked = false;
		}
	});

	removeBtn.disabled = true;
	uncheckAllBtn.disabled = true;
	checkAllBtn.disabled = false;
}

function toCheck(event) {
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];
	const isAllChecked = currentCheckboxItems.every((item) => item.checked);
	const isSomeChecked = currentCheckboxItems.some((item) => item.checked);

	if (event.currentTarget.checked && uncheckAllBtn.disabled) {
		uncheckAllBtn.disabled = false;
	} else if (!isSomeChecked && !uncheckAllBtn.disabled) {
		uncheckAllBtn.disabled = true;
	}

	if (!event.currentTarget.checked && checkAllBtn.disabled) {
		checkAllBtn.disabled = false;
	} else if (isAllChecked) {
		checkAllBtn.disabled = true;
	}

	if (event.currentTarget.checked && removeBtn.disabled) {
		removeBtn.disabled = false;
	} else if (!isSomeChecked && !removeBtn.disabled) {
		removeBtn.disabled = true;
	}
}

function cancelUpdate() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const isAllTemporalRemoved = currentBookItems.every((book) =>
		book.classList.contains("hidden"),
	);

	currentBookItems.forEach((item, index) => {
		const book = myLibrary[index];
		const updatedCover = item.querySelector(".__cover");
		const updatedTitle = item.querySelector(".__title");
		const updatedVol = item.querySelector(".__vol");
		const updatedAuthor = item.querySelector(".__author");
		const updatedLink = item.querySelector(".__link");
		const updatedReadCheckInput = item.querySelector(".__read-check");
		const isTemporalRemoved = item.classList.contains("hidden");

		updatedCover.src = book.cover;
		updatedTitle.textContent = book.title;
		updatedVol.textContent = `Vol: ${book.vol}`;
		updatedAuthor.textContent = `Author: ${book.author}`;
		if (book.link) {
			updatedLink.href = book.link;
			if (updatedLink.textContent !== "Visit me.") {
				updatedLink.textContent = "Visit me.";
			}
		} else {
			if(updatedLink.href) {
				updatedLink.removeAttribute("href");
				if (updatedLink.textContent !== "none") {
					updatedLink.textContent = "none";
				}
			}
		}
		updatedReadCheckInput.checked = book.markAsRead;

		if (isTemporalRemoved) {
			item.classList.add("invincible-book");
			item.classList.remove("hidden");
		}
	});

	if (!removeBtn.disabled) {
		removeBtn.disabled = true;
	}

	if ((showMoreBtn.classList.contains("hidden")) || isAllTemporalRemoved) {
		showMoreBtn.classList.remove("hidden");
	}

	if (nextDisplay === myLibrary.length) {
		resizeBookContainerHeight(currentBookItems);
	}

	if (showMoreBtn.textContent === "Show Less") {
		showMoreBtn.textContent = "Show More";
	}

	finishUpdate();
}

function finishUpdate() {
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];
	const currentEditBtns = bookContainer.querySelectorAll(".__edit");
	const currentEditBtnItems = [...currentEditBtns];

	addBookBtn.classList.remove("hidden");
	updateBtn.classList.remove("hidden");
	removeBtn.classList.add("hidden");
	checkAllBtn.classList.add("hidden");
	uncheckAllBtn.classList.add("hidden");
	confirmBtn.classList.add("hidden");
	cancelBtn.classList.add("hidden");

	if (checkAllBtn.disabled) {
		checkAllBtn.disabled = false;
		uncheckAllBtn.disabled = true;
	} else {
		uncheckAllBtn.disabled = true;
	}

	currentCheckboxItems.forEach((item) => {
		if (item.checked) {
			item.checked = false;
		}

		item.classList.add("hidden");
	});

	currentEditBtnItems.forEach((item) => {
		item.classList.add("hidden");
	});
}

function removeBook() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];
	const nextBook =
		currentBookItems.filter(checkBookInvincibility)
	;
	const visibleBook =
		currentBookItems.filter(checkBookVisibility);
	;

	currentCheckboxItems.forEach((item) => {
		const isCheckTrue = item.checked;
		const bookLocation = myLibrary.findIndex(
			(book) => book.id === item.dataset.id,
		);
		const currentBookCard = currentBookItems[bookLocation];

		if (!isCheckTrue) return;
		currentBookCard.classList.add("hidden");

		if (nextBook[0]) {
			nextBook[0].classList.remove("invincible-book");
		}

		const isAllTemporalRemoved = currentBookItems.every((book) =>
			book.classList.contains("hidden"),
		);

		const notTemporalRemovedBooks =
			currentBookItems.filter(checkUnHiddenBooks);
		;

		if ((notTemporalRemovedBooks.length === 1) || isAllTemporalRemoved) {
			showMoreBtn.classList.add("hidden");
		}

		if (currentBookCard.classList.contains("hidden") && item.checked) {
			item.checked = false;
			removeBtn.disabled = true;
		}
	});

	if (visibleBook.length === currentBooks.length) {
		showMoreBtn.textContent = "Show Less";

		const updatedCurrentBooks = bookContainer.querySelectorAll(".book");
		const updatedCurrentBookItems = [...updatedCurrentBooks].filter(checkUnHiddenBooks);

		if (screens.matches) {
			resizeBookContainerHeight(updatedCurrentBookItems);
		}
	}

	uncheckAllBtn.disabled = true;
	confirmBtn.disabled = false;
}

function checkUnHiddenBooks(book) {
	return !book.classList.contains("hidden");
}

function resizeBookContainerHeight(currentBook) {
	const totalBookHeight = currentBook.reduce(sumHeight, 0);
	const currentTotalBook = bookContainerGap * currentBook.length;
	bookContainer.style.height = `${totalBookHeight + currentTotalBook}px`;
}

function sumHeight(accumulator, currentValue) {
	const currentBookHeight = currentValue.getBoundingClientRect().height;
	const totalHeight = accumulator + currentBookHeight;
	return totalHeight;
}

function confirmUpdate() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const newMessage = "Book has been saved";

	for (let index = currentBookItems.length - 1; index >= 0; index--) {
		const book = myLibrary[index];
		const updatedCover = currentBookItems[index].querySelector(".__cover");
		const updatedTitle = currentBookItems[index].querySelector(".__title");
		const updatedVol = currentBookItems[index].querySelector(".__vol");
		const updatedAuthor = currentBookItems[index].querySelector(".__author");
		const updatedLink = currentBookItems[index].querySelector(".__link");
		const updatedReadCheckInput = currentBookItems[index].querySelector(".__read-check");
		const isTemporalRemoved = currentBookItems[index].classList.contains("hidden");

		if (isTemporalRemoved) {
			const bookCurrentLocation =
				myLibrary.findIndex((book) => book.id === currentBookItems[index].dataset.id);

			myLibrary.splice(bookCurrentLocation, 1);
			currentBookItems.splice(bookCurrentLocation, 1);
			currentBooks[index].remove();
		} else {
			book.cover = updatedCover.src;
			book.title = updatedTitle.textContent;
			book.vol = updatedVol.textContent.replace("Vol: ", "");
			book.author = updatedAuthor.textContent.replace("Author: ", "");
			book.link = updatedLink.href ? updatedLink.href : "";
			book.markAsRead = updatedReadCheckInput.checked;
		}
	};

	const localBooks = JSON.stringify(myLibrary);

	localStorage.setItem("localLibrary", localBooks);

	const isEmptyLibrary = myLibrary.length === 0;

	if (isEmptyLibrary) {
		updateBtn.disabled = true;
		showMoreBtn.classList.add("hidden");
	}

	confirmBtn.disabled = true;

		if (addedMessage.textContent !== newMessage) {
		addedMessage.textContent = newMessage;
	}

	alert();

	finishUpdate();
}

function editBook(event) {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const currentPreview = addBookModal.querySelector(".__preview");
	const currentCover = document.createElement("img");
	const currentTitle = addBookModal.querySelector(".__title");
	const currentVol = addBookModal.querySelector(".__vol");
	const currentAuthor = addBookModal.querySelector(".__author");
	const currentLink = addBookModal.querySelector(".__link");
	const currentReadCheckInput = addBookModal.querySelector(".__read-check");

	currentCover.classList.add("__img-cover", "img-size");

	setTimeout(() => {
		bodyOverflowHide();
	});

	currentBookItems.forEach((item, index) => {
		if (item.dataset.id === event.currentTarget.dataset.id) {
			const book = myLibrary[index];
			const updatedCover = item.querySelector(".__cover");
			const updatedTitle = item.querySelector(".__title");
			const updatedVol = item.querySelector(".__vol");
			const updatedAuthor = item.querySelector(".__author");
			const updatedLink = item.querySelector(".__link");
			const updatedReadCheckInput = item.querySelector(".__read-check");

			// ##COVER
			currentCover.src = book.cover;
			currentCover.alt = `${book.title} cover`;
			currentPreview.firstElementChild.replaceWith(currentCover);

			// ##TITLE
			currentTitle.value = updatedTitle.textContent;

			// ##VOL
			currentVol.value = updatedVol.textContent.replace("Vol: ", "");

			// ##AUTHOR
			currentAuthor.value = updatedAuthor.textContent.replace("Author: ", "");

			// ##LINK
			currentLink.value = updatedLink.href ? updatedLink.href : "";

			// ##READ CHECKBOX
			currentReadCheckInput.checked = updatedReadCheckInput.checked;

			saveBtn.addEventListener("click", (event) => {
				event.preventDefault();

				const filesCoverImg = coverInput.files;

				// ##UPDATED COVER
				for (const file of filesCoverImg) {
					readFileImg(updatedCover, file);
				}

				// ##UPDATED TITLE
				updatedTitle.textContent = currentTitle.value;

				// ##UPDATED VOL
				updatedVol.textContent = `Vol: ${currentVol.value}`;

				// ##UPDATED AUTHOR
				updatedAuthor.textContent = `Author: ${currentAuthor.value}`;

				// ##UPDATED LINK
				if (!currentLink.value) {
					updatedLink.removeAttribute("href");
					updatedLink.textContent = "none";
				} else {
					if (updatedLink.textContent !== "Visit me.") {
						updatedLink.textContent = "Visit me.";
					}
					updatedLink.href= currentLink.value;
				}

				// ##UPDATED READ CHECKBOX
				updatedReadCheckInput.checked = currentReadCheckInput.checked;

				if (confirmBtn.disabled) {
					confirmBtn.disabled = false;
				}

				if (document.body.classList.contains("overflow-hidden")) {
					document.body.classList.remove("overflow-hidden");
				}

				createPreviewText(preview);

				form.reset();
				addBookModal.close();
			}, {once: true, signal: controller.signal});
		}
	});
}

function bodyOverflowHide() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});

	document.body.classList.add("overflow-hidden");
}

function goUp() {
	upIcon.src = "assets/img/other/boy-flying.png";
	upIcon.alt = "a boy is flying";
	upBtn.classList.add("go-up");

	setTimeout(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, 250);

		upBtn.addEventListener("animationend", hideBoy);
}

function hideBoy() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const secondBookLocationY = currentBookItems[1].getBoundingClientRect().y;

	upBtn.classList.remove("go-up");
	upIcon.src = "assets/img/other/boy-normal.png";
	upIcon.alt = "a boy is standing";

	if (window.scrollY > secondBookLocationY) {
		upBtn.classList.remove("hidden");
	} else {
		upBtn.classList.add("hidden");
	}
}

function clearKeyword() {
	const currentBooks = bookContainer.querySelectorAll(".book");

	if (addBookBtn.classList.contains("hidden")) {
		addBookBtn.classList.remove("hidden");
	}

	currentBooks.forEach((book) => {
		book.remove();
	});

	for (let i = 0; i < 6; i++) {
		if (!myLibrary[i]) continue;
		createBook(myLibrary[i]);
	}

	const currentBookItems = [...bookContainer.querySelectorAll(".book")];

	if (screens.matches) {
		resizeBookContainerHeight(currentBookItems);
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap);
		;
		setHeight(bookContainer, initialBookContainerHeight);
		currentBookItems.forEach((book, index) => {
			if (index !== 0) {
				book.classList.add("invincible-book");
			}
		});

		const updatedCurrentBookItems = currentBookItems.filter(checkBookVisibility);

		if (updatedCurrentBookItems.length < currentBookItems.length) {
			if (showMoreBtn.textContent === "Show Less") {
				showMoreBtn.textContent = "Show More";
			}
			if (showMoreBtn.classList.contains("hidden")) {
				showMoreBtn.classList.remove("hidden");
			}
		}
	}
}

function clearSearch(item) {
	removeSlowly(item.currentTarget, "__clear-visible");

	if (searchInput.value) {
		searchInput.value = "";
	}

	clearKeyword();

}

function removeSlowly(item, class1) {
	item.classList.remove(class1);
	item.addEventListener("transitionend", addClassEvent);
}

function addClassEvent(e) {
	e.currentTarget.classList.add("hidden");
	e.currentTarget.removeEventListener("transitionend", addClassEvent);
}

function searchBook(btn) {
	btn.preventDefault();
	if (!searchInput.value) return;

	const currentBooks = bookContainer.querySelectorAll(".book");
	const isBookInLibrary =
		myLibrary.some(searchBookTitle);
	;
	const bookInLibrary =
		myLibrary.filter(searchBookTitle);
	;

	addBookBtn.classList.add("hidden");

	for (let i = currentBooks.length - 1; i >= 0; i--) {
		currentBooks[i].remove();
	}

	if (isBookInLibrary) {
		bookInLibrary.forEach((book) => {
			createBook(book);
		});
	}

	if (bookContainer.style.overflow) {
		const currentBookItems = [...bookContainer.querySelectorAll(".book")];
		if (screens.matches) {
			resizeBookContainerHeight(currentBookItems);
		}
	}

	if (!showMoreBtn.classList.contains("hidden")) {
		showMoreBtn.classList.add("hidden");
	}
}

function searchBookTitle(book) {
	const keyword = searchInput.value.toLocaleLowerCase();
	return book.title.toLocaleLowerCase().includes(keyword);
}

function createBook(book) {
	const bookCard = document.createElement("li");
	const bookCheckbox = document.createElement("input");
	const bookCover = document.createElement("img");
	const bookTitle = document.createElement("h2");
	const bookDetail = document.createElement("ul");
	const bookVol = document.createElement("li");
	const bookAuthor = document.createElement("li");
	const bookLinkContainer = document.createElement("li");
	const bookLink = document.createElement("a");
	const markContainer = document.createElement("div");
	const bookReadCheckbox = document.createElement("input");
	const bookReadLabel = document.createElement("label");
	const bookEditBtn = document.createElement("button");

	createBookCard(bookCard, book.id);
	createBookCheckbox(bookCheckbox, book.title, book.id);
	createBookCover(bookCover, book.cover, book.title);
	createBookTitle(bookTitle, book.title);
	createBookVol(bookVol, book.vol);
	createBookAuthor(bookAuthor, book.author);
	createBookLink(bookLinkContainer, bookLink, book.link);
	createMarkAsRead(markContainer, bookReadCheckbox, bookReadLabel, book);
	createEditBtn(bookEditBtn, book.id);

	bookDetail.classList.add("__detail");
	bookDetail.append(bookVol, bookAuthor, bookLinkContainer);

	bookCard.append(
		bookCheckbox,
		bookCover,
		bookTitle,
		bookDetail,
		markContainer,
		bookEditBtn,
	);
	bookContainer.appendChild(bookCard);
}

function createBookCard(elem, id) {
	elem.classList.add("book")
	elem.dataset.id = id;
}

function createBookCheckbox(elem, title, id) {
	elem.classList.add("__checkbox", "hidden");
	elem.name = title;
	elem.type = "checkbox";
	elem.ariaDescription = "Click to select the book.";
	elem.dataset.id = id;
	elem.addEventListener("change", toCheck);
}

function createBookCover(elem, img, alt) {
	elem.classList.add("__cover", "img-size");
	elem.src = img;
	elem.alt = `${alt}'s cover`;
	elem.loading = "lazy";
}

function createBookTitle(elem, title) {
	elem.classList.add("__title", "overflow-hidden");
	elem.textContent = title;
}

function createBookVol(elem, vol) {
	elem.classList.add("__vol", "overflow-hidden");
	inputValue(elem, "__vol", vol);
}

function createBookAuthor(elem, author) {
	elem.classList.add("__author", "overflow-hidden");
	inputValue(elem, "__author", author);
}

function createBookLink(container, elem, link) {
	container.classList.add("link-container");
	elem.classList.add("__link");
	if (link) {
		elem.href = link;
		elem.textContent = "Visit me.";
	} else {
		elem.textContent = "none";
		if (elem.getAttribute("href")) {
			elem.removeAttribute("href");
		}
	}

	elem.rel = "noopener noreferrer";
	elem.target = "_blank";

	container.textContent = "Link: ";
	container.appendChild(elem);
}

function createMarkAsRead(container, input, label, book) {
	container.classList.add("__mark");
	input.classList.add("__read-check");
	input.id = book.id;
	input.type = "checkbox";
	input.checked = book.markAsRead;
	label.classList.add("__text");
	label.setAttribute("for", book.id);
	label.textContent = "Mark as read.";
	container.append(input, label);

	input.addEventListener("change", saveRead);
}

function createEditBtn(elem, id) {
	elem.classList.add("btn", "__edit", "hidden");
	elem.type = "button";
	elem.commandForElement = addBookModal;
	elem.command = "show-modal";
	elem.dataset.id = id;
	elem.textContent = "Edit";
	elem.addEventListener("click", editBook);
}

function inputValue(elem, __class, value) {
	const rawDetail = __class.replaceAll(/__/g, "");
	const detail = rawDetail.slice(0, 1).toLocaleUpperCase() + rawDetail.slice(1);

	const text = value ? value : "none";

	if (__class === "__title") {
		elem.textContent = text;
	} else {
		elem.textContent = `${detail}: ${text}`;
	}
}

function saveRead(input) {
	const checkbox = input.currentTarget;
	const book = myLibrary.findIndex((book) => book.id === checkbox.id);
	myLibrary[book].markAsRead = checkbox.checked;
	localStorage.setItem("localLibrary", JSON.stringify(myLibrary));
}