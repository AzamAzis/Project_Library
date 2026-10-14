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
const volInput = addBookModal.querySelector(".__vol");
const authorInput = addBookModal.querySelector(".__author");
const linkInput = addBookModal.querySelector(".__link");
const markAsReadInput = addBookModal.querySelector(".__read-check");
const upBtn = document.querySelector(".up");
const upIcon = upBtn.querySelector(".__icon");

const screen = window.matchMedia("(width < 680px)");

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
}

const myLibrary = [bookOne, bookTwo, bookThree];

let currentDisplay = 0;
let nextDisplay = 1;
let isRemoved = true;

// ||DISPLAY BOOKS
for (const book of myLibrary) {
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
	const newReadCheckInput = document.createElement("input");
	const newMarkLabel = document.createElement("label");
	const newEditBtn = document.createElement("button");

	// ##BOOK
	newBookCard.classList.add("book");
	newBookCard.dataset.id = book.id;

	// ##CHECKBOX
	newCheckbox.classList.add("__checkbox", "hidden");
	newCheckbox.name = "book";
	newCheckbox.type = "checkbox";
	newCheckbox.ariaDescription = "Click to select the book.";
	newCheckbox.dataset.id = newBookCard.dataset.id;

	// ##COVER
	newCover.classList.add("__cover", "img-size");
	newCover.src = book.cover;
	newCover.alt = `${book.title} cover`;
	newCover.loading = "lazy";

	// ##TITLE
	newTitle.classList.add("__title", "overflow-hidden");
	newTitle.textContent = book.title;

	// ##DETAIL
	newDetail.classList.add("__detail");

	// ##VOL
	newVol.classList.add("__vol", "overflow-hidden");
	newVol.textContent = `Vol: ${book.vol}`;

	// ##AUTHOR
	newAuthor.classList.add("__author", "overflow-hidden");
	newAuthor.textContent = `Author: ${book.author}`;

	// ##LINK CONTAINER
	newLinkContainer.classList.add("link-container");
	newLinkContainer.textContent = "Link: ";

	// ##LINK
	newLink.classList.add("__link");
	if (book.link) {
		newLink.href = book.link;
		newLink.rel = "noopener noreferrer";
		newLink.target = "_blank";
		newLink.textContent = "Visit me.";
	} else {
		newLink.textContent = "none";
	}

	// ##MARK
	newMark.classList.add("__mark");

	// ##MARK INPUT
	newReadCheckInput.classList.add("__read-check");
	newReadCheckInput.id = newBookCard.dataset.id;
	newReadCheckInput.type = "checkbox";
	newReadCheckInput.checked = book.markAsRead;

	// ##MARK LABEL
	newMarkLabel.classList.add("__text");
	newMarkLabel.setAttribute("for", newReadCheckInput.id);
	newMarkLabel.textContent = "Mark As Read.";

	// ##EDIT BTN
	newEditBtn.classList.add("btn", "__edit", "hidden");
	newEditBtn.type = "button";
	newEditBtn.commandForElement = addBookModal;
	newEditBtn.command = "show-modal";
	newEditBtn.dataset.id = newBookCard.dataset.id;
	newEditBtn.textContent = "Edit";
	newEditBtn.addEventListener("click", editBook);

	// !!ADD TO MARK
	newMark.append(newReadCheckInput, newMarkLabel);

	// !!ADD TO LINK CONTAINER
	newLinkContainer.append(newLink);

	// !!ADD TO DETAIL
	newDetail.append(newVol, newAuthor, newLinkContainer);

	// !!ADD TO BOOK
	newBookCard.append(newCheckbox ,newCover, newTitle, newDetail, newMark, newEditBtn);

	if (myLibrary.length <= 6) {
		bookContainer.appendChild(newBookCard);
	}
}

const checkboxes = bookContainer.querySelectorAll(".__checkbox");
const checkboxItems = [...checkboxes];

const next = getNextBook(currentDisplay);
const bookContainerGap = Number.parseFloat(getComputedStyle(bookContainer).gap);
const initialBookHeight = getBookHeight(next);
let initialBookContainerHeight = getBookContainerHeight(initialBookHeight, bookContainerGap);

// ||RESPONSIVENESS
toResponsive();
screen.addEventListener("change", toResponsive);

showMoreBtn.addEventListener("click", showMore);

// ||UPDATE
updateBtn.addEventListener("click", update);
cancelBtn.addEventListener("click", cancelUpdate);
confirmBtn.addEventListener("click", confirmUpdate);

// ||CHECK
checkAllBtn.addEventListener("click", checkAll);
uncheckAllBtn.addEventListener("click", uncheckAll);

// ||OPEN DIALOG
addBookBtn.addEventListener("click", bodyOverflowHide);

// ||CLOSE DIALOG
closeBtn.addEventListener("click", toClose);

// ||ADD PREVIEW
coverInput.addEventListener("change", (event) => {
	for (const file of event.currentTarget.files) {
		readFileImg(cover, file);

		preview.firstElementChild.replaceWith(cover);
	}
});

titleInput.addEventListener("input", toValid);

// ||ADD BOOK
saveBtn.addEventListener("click", addBook);

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
	const fileItem =
		[...event.dataTransfer.items].filter((item) => item.kind === "file")
	;

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
	const fileItems =
		[...event.dataTransfer.items].filter((item) => item.kind === "file")
	;

	if (fileItems.length > 0) {
		event.preventDefault();

		if (!preview.contains(event.target)) {
			event.dataTransfer.dropEffect = "none";
		}
	}
});

checkboxItems.forEach((item) => {
	item.addEventListener("change", toCheck);
});

// ||UP
const req = new Request("assets/img/other/boy-flying.png");
window.fetch(req).then((response) => {
	if (!response.ok) {
		throw Error("hello");
	}

	return response.blob();
});
upBtn.addEventListener("click", goUp);

// ||FUNCTIONS
function toResponsive() {
	const smallScreen = screen.matches;

	if (smallScreen) {
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap)
		;
		currentDisplay = 0;
		nextDisplay = 1;

		if (!isRemoved) {
			createPreviewText(preview);
			isRemoved = true;
		}

		window.addEventListener("scroll", () => {
			const currentBooks = bookContainer.querySelectorAll(".book");
			const currentBookItems = [...currentBooks];
			const secondBookLocation = currentBookItems[1].getBoundingClientRect().y;
			if (
				nextDisplay > 1 &&
				window.scrollY > secondBookLocation
			) {
				upBtn.classList.remove("hidden");
			} else if (
				window.scrollY < secondBookLocation &&
				!(upBtn.classList.contains("go-up"))
			) {
				upBtn.classList.add("hidden");
			}
		});

		showMoreBtn.classList.remove("hidden");
		setHeight(bookContainer, initialBookContainerHeight);
		overflowHide(bookContainer);
		hideBook();
	} else {
		showMoreBtn.classList.add("hidden");
		unsetHeight(bookContainer);
		overflowUnHide(bookContainer);
		unHideBook();
	}
}

function showMore() {
	currentDisplay++;
	nextDisplay++;
	const nextBook = getNextBook(currentDisplay);

	if (
		!(nextDisplay > myLibrary.length) &&
		nextBook.classList.contains("invincible-book")
	) {
		nextBook.classList.remove("invincible-book");
	}

	if (nextDisplay <= myLibrary.length) {
	const height = getBookHeight(nextBook) + bookContainerGap;
	initialBookContainerHeight += height;
	setHeight(bookContainer, initialBookContainerHeight);
	}

	if (!isRemoved) {
		bookContainer.removeEventListener("transitionend", hideBook);
		isRemoved = true;
	}

	if (nextDisplay === myLibrary.length) {
		showMoreBtn.textContent = "Show Less";
		return;
	} else if (nextDisplay > myLibrary.length) {
		showMoreBtn.textContent = "Show More";
		currentDisplay = 0;
		nextDisplay = 1;
		initialBookContainerHeight =
			getBookContainerHeight(initialBookHeight, bookContainerGap)
		;
		setHeight(bookContainer, initialBookContainerHeight);
		bookContainer.addEventListener("transitionend", hideBook);
		isRemoved = false;
		upBtn.classList.add("hidden");
	}
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
	const randomId = crypto.randomUUID();

	const isCoverExist = cover.getAttribute("src");
	const isTitleExist = titleInput.value;
	const isLinkExist = linkInput.value;

	if (!isTitleExist) {
		addBookModal.showModal();
		invalidMessage.style.display = "block";
		setTimeout(() => {
			invalidMessage.classList.add("__message");
		}, 0);
		return;
	} else {
		addBookModal.close();
	};

	if (updateBtn.disabled) {
		updateBtn.disabled = false;
	}

	//##BOOK
	newBookCard.classList.add("book");
	newBookCard.dataset.id = `book-${randomId}`;

	// ##CHECKBOX
	newCheckbox.classList.add("__checkbox", "hidden");
	newCheckbox.name = "book";
	newCheckbox.type = "checkbox";
	newCheckbox.ariaDescription = "Click to select the book.";
	newCheckbox.dataset.id = newBookCard.dataset.id;
	newCheckbox.addEventListener("change", toCheck);

	// ##COVER
	newCover.classList.add("__cover", "img-size");
	if (!isCoverExist) {
		newCover.src = "assets/img/book-cover/placeholder-cover.jpg";
		newCover.alt = "placeholder cover: Hanako-Kun Peace Sign";
	} else {
		newCover.src = cover.src;
		newCover.alt = cover.alt;
		newCover.loading = "lazy";
	}

	// ##DETAIL
	newDetail.classList.add("__detail");

	// ##TITLE
	createNewDetail(newTitle, titleInput, "__title", "overflow-hidden");

	// ##VOL
	createNewDetail(newVol, volInput, "__vol", "overflow-hidden");

	// ##AUTHOR
	createNewDetail(newAuthor, authorInput, "__author", "overflow-hidden");

	// ##LINK CONTAINER
	newLinkContainer.classList.add("link-container");
	newLinkContainer.textContent = "Link: ";

	// ##LINK
	newLink.classList.add("__link");

	if (!isLinkExist) {
		newLink.textContent = "none";
	} else {
		newLink.textContent = "Visit me.";
		newLink.href = linkInput.value;
		newLink.rel = "noopener noreferrer";
		newLink.target = "_blank";
	}

	// ##MARK
	newMark.classList.add("__mark");

	// ##MARK INPUT
	newReadCheckInput.classList.add("__read-check");
	newReadCheckInput.id = newBookCard.dataset.id;
	newReadCheckInput.type = "checkbox";
	newReadCheckInput.checked = markAsReadInput.checked;

	// ##MARK LABEL
	newMarkLabel.classList.add("__text", "__mark");
	newMarkLabel.setAttribute("for", newReadCheckInput.id);
	newMarkLabel.textContent = "Mark as read.";

	// ##EDIT BTN
	newEditBtn.classList.add("btn", "__edit", "hidden");
	newEditBtn.type = "button";
	newEditBtn.textContent = "Edit";
	newEditBtn.commandForElement = addBookModal;
	newEditBtn.command = "show-modal";
	newEditBtn.dataset.id = newBookCard.dataset.id;
	newEditBtn.addEventListener("click", editBook);

	addBookToLibrary(
		newCover.src,
		titleInput.value,
		volInput.value,
		authorInput.value,
		linkInput.value,
		markAsReadInput.checked,
		newBookCard.dataset.id,
	);

	// !!ADD TO LINK CONTAINER
	newLinkContainer.appendChild(newLink);

	// !!ADD TO MARK
	newMark.append(newReadCheckInput, newMarkLabel);

	// !!ADD TO DETAIL
	newDetail.append(newTitle, newVol, newAuthor, newLinkContainer);

	// !!ADD TO BOOK
	newBookCard.append(newCheckbox, newCover, newTitle, newDetail, newMark, newEditBtn);

	if (myLibrary.length <= 6) {
		bookContainer.appendChild(newBookCard);
	}

	if (
		showMoreBtn.classList.contains("hidden") &&
		myLibrary.length > 1 &&
		screen.matches
	) {
		showMoreBtn.classList.remove("hidden");
	}

	if (updateBtn.disabled) {
		updateBtn.disabled = false;
	}

	if (
		(nextDisplay <= myLibrary.length) &&
		(showMoreBtn.textContent === "Show Less")
	) {
		showMoreBtn.textContent = "Show More";
	}

	if (document.body.classList.contains("overflow-hidden")) {
		document.body.classList.remove("overflow-hidden");
	}

	preview.firstElementChild.remove();
	createPreviewText(preview);
	form.reset();
}

function createNewDetail(item, value, classDetail, ...utilities) {
	const rawClass = classDetail.replaceAll(/__/g, "");
	const detail =
		rawClass.slice(0, 1).toLocaleUpperCase() + rawClass.slice(1)
	;

	const text = value.value ? value.value : "none";

	if (detail.toLowerCase() === "title") {
		item.textContent = text;
	} else {
		item.textContent = `${detail}: ${text}`;
	}

	for (const utility of utilities) {
		item.classList.add(classDetail, utility);
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
	const file =
		[...ev.dataTransfer.items]
			.map((item) => item.getAsFile())
			.filter((file) => file)
	;
	displayImage(file);

	coverInput.files = ev.dataTransfer.files;
}

function toClose() {
	if (preview.firstElementChild !== previewPrevChild) {
		preview.firstElementChild.replaceWith(previewPrevChild);
	}

	if (invalidMessage.classList.contains("__message")) {
		invalidMessage.style.display = "none";
		invalidMessage.classList.remove("__message");
	}

	if (titleInput.value) {
		form.reset();
	}

	if (invalidMessage.classList.contains("__message")) {
		invalidMessage.classList.remove("__message");
	}

	if (document.body.classList.contains("overflow-hidden")) {
		document.body.classList.remove("overflow-hidden");
	}
}

function toValid() {
	if (titleInput.validity.valid && invalidMessage.classList.contains("__message")) {
		invalidMessage.classList.remove("__message");
		invalidMessage.addEventListener("transitionend", toRemoveMessage, {once: true});
	}
}

function toRemoveMessage(e) {
	e.currentTarget.style.display = "none";
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
	const previewText = document.createElement("p");
	previewText.classList.add("__preview-text");
	previewText.textContent = "Preview";
	parent.appendChild(previewText);
}

function readFileImg(item, file) {
	fileReader.addEventListener("load", () => {
		item.src = fileReader.result;
		item.alt = `${file.name}`;
		item.classList.add("__img-cover", "img-size");
	});

	if (file) {
		fileReader.readAsDataURL(file);
	};
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
}

function checkAll() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];

	currentCheckboxItems.forEach((item, index) => {
		const isTemporalRemoved = currentBookItems[index].classList.contains("hidden");
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
	const isAllTemporalRemoved =
		currentBookItems.every((book) => book.classList.contains("hidden"));

	currentBookItems.forEach((item) => {
		const isTemporalRemoved = item.classList.contains("hidden");
		if (isTemporalRemoved) {
			item.classList.remove("hidden");
		}
	});

	if (!removeBtn.disabled) {
		removeBtn.disabled = true;
	}

	if (isAllTemporalRemoved) {
		showMoreBtn.classList.remove("hidden");
	}

	if (nextDisplay === myLibrary.length) {
		resizeBookContainerHeight(currentBookItems);
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
		item.classList.add("hidden")
	});
}

function removeBook() {
	const currentBooks = bookContainer.querySelectorAll(".book");
	const currentBookItems = [...currentBooks];
	const currentCheckboxes = bookContainer.querySelectorAll(".__checkbox");
	const currentCheckboxItems = [...currentCheckboxes];

	currentCheckboxItems.forEach((item) => {
		const isCheckTrue = item.checked;
		const bookLocation =
			myLibrary.findIndex((book) => book.id === item.dataset.id);
		const currentBookCard = currentBookItems[bookLocation];

		if (!isCheckTrue) return;
		currentBookCard.classList.add("hidden");

		const isAllTemporalRemoved =
			currentBookItems.every((book) => book.classList.contains("hidden"));

		if (isAllTemporalRemoved) {
			showMoreBtn.classList.add("hidden");
		}

		if (currentBookCard.classList.contains("hidden") && item.checked) {
			item.checked = false;
			removeBtn.disabled = true;
		}
	});

	if (nextDisplay === myLibrary.length) {
		showMoreBtn.textContent = "Show Less";

		resizeBookContainerHeight(currentBookItems);
	}

	uncheckAllBtn.disabled = true;
	confirmBtn.disabled = false;
}

function resizeBookContainerHeight(currentBook) {
	const totalBookHeight = currentBook.reduce(sumHeight, 0);
	const currentTotalBook = bookContainerGap * (myLibrary.length - 1);
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

	currentBookItems.forEach((item) => {
		const isTemporalRemoved = item.classList.contains("hidden");

		if (!isTemporalRemoved) return;

		const bookCurrentLocation = myLibrary.findIndex((book) => book.id === item.dataset.id);
		myLibrary.splice(bookCurrentLocation, 1);

		item.remove();
	});

	const isEmptyLibrary = myLibrary.length === 0;

	if (isEmptyLibrary) {
		updateBtn.disabled = true;
		showMoreBtn.classList.add("hidden");
	}

	confirmBtn.disabled = true;

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

	saveBtn.removeEventListener("click", addBook);

	bodyOverflowHide();

	currentBookItems.forEach((item, index) => {
		if (item.dataset.id === event.currentTarget.dataset.id) {
			const book = myLibrary[index];
			const newCover = item.querySelector(".__cover");
			const newTitle = item.querySelector(".__title");
			const newVol = item.querySelector(".__vol");
			const newAuthor = item.querySelector(".__author");
			const newLink = item.querySelector(".__link");

			// ##COVER
			currentCover.src = book.cover;
			currentCover.alt = `${book.title} cover`;
			currentPreview.firstElementChild.replaceWith(currentCover);

			// ##TITLE
			currentTitle.value = book.title;

			// ##VOL
			currentVol.value = book.vol;

			// ##AUTHOR
			currentAuthor.value = book.author;

			// ##LINK
			currentLink.value = book.link;

			// ##READ CHECKBOX
			currentReadCheckInput.checked = book.markAsRead;

			saveBtn.addEventListener("click", (event) => {
				event.preventDefault();

				const filesCoverImg = coverInput.files;

				// ##NEW COVER
				for (const file of filesCoverImg) {
					readFileImg(newCover, file);
				}

				event.currentTarget.addEventListener("click", addBook);
			}, {once: true});
		}
	});
}

function bodyOverflowHide() {
	scroll({
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
		scroll({
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