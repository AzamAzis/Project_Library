const bookContainer = document.querySelector(".book-container");
const books = bookContainer.querySelectorAll(".book");
const showMoreBtn = document.querySelector(".show-more");
const addBookModal = document.querySelector(".add-book-modal");
const closeBtn = addBookModal.querySelector(".__close");
const form = addBookModal.querySelector(".__form");
const titleInput = addBookModal.querySelector(".__title");
const volInput = addBookModal.querySelector(".__vol");
const authorInput = addBookModal.querySelector(".__author");
const link = addBookModal.querySelector(".__link");
const marked = addBookModal.querySelector(".__read-check");

const screen = window.matchMedia("(width < 680px)");

const preview = document.querySelector(".__preview");
const previewPrevChild = preview.firstElementChild;
const imgInput = document.querySelector(".__input-img");
const cover = document.createElement("img");

const saveBtn = document.querySelector(".__save");

const bookItems = Array.from(books);
const savedBookId = [];

// !!TEST
let urlImg;
let urlCover;
// !!TEST

let initialDisplay = 0;
let nextDisplay = 1;
let isRemoved = true;

const next = getNextBook(initialDisplay, nextDisplay);
const bookContainerGap = Number.parseFloat(getComputedStyle(bookContainer).gap);
const initialBookHeight = getBookHeight(next);
let initialBookContainerHeight = getBookContainerHeight(initialBookHeight, bookContainerGap);

bookItems.forEach((item) => {
	const id = crypto.randomUUID(); //**GENERATE BOOK ID */
	item.id = id;

	savedBookId.push(item.id); //**STORING BOOK ID */
});

// ||RESPONSIVENESS
toResponsive();
screen.addEventListener("change", toResponsive);

showMoreBtn.addEventListener("click", showMore);

// ||CLOSE DIALOG
closeBtn.addEventListener("click", toClose);


// ||ADD PREVIEW
imgInput.addEventListener("change", (event) => {
	for (const file of event.currentTarget.files) {
		readImg(file, cover);
		cover.alt = file.name;
		cover.classList.add("__img-cover", "img-size");

		previewPrevChild.remove();
		preview.append(cover);
	}
});

// ||ADD BOOK
saveBtn.addEventListener("click", addBook);

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


function readImg(file, item) {
	if (urlImg) {
		URL.revokeObjectURL(urlImg);
	}

	urlImg = URL.createObjectURL(file);

	item.src = urlImg;
}

function addBook(event) {
	event.preventDefault();
	const newBook = document.createElement("li");
	const checkbox = document.createElement("input");
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
	const randomId = crypto.randomUUID();

	const isCoverExist = cover.getAttribute("src");
	const isTitleExist = titleInput.value;
	const isLinkExist = link.value;

	if (!isTitleExist) {
		addBookModal.showModal();
		return;
	} else {
		addBookModal.close();
	};

	//##BOOK
	newBook.classList.add("book");

	// ##CHECKBOX
	checkbox.classList.add("__checkbox");
	checkbox.name = "book";
	checkbox.type = "checkbox";
	checkbox.ariaDescription = "Click to select the book.";

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
	newLink.rel = "noopener noreferrer";
	newLink.target = "_blank";

	if (!isLinkExist) {
		newLink.textContent = "none";
		newLink.removeAttribute("href");
	} else {
		newLink.textContent = "Visit me.";
		newLink.href = link.value;
	}

	// ##MARK
	newMark.classList.add("__mark");

	// ##MARK INPUT
	newReadCheckInput.classList.add("__read-check");
	newReadCheckInput.id = randomId;
	newReadCheckInput.type = "checkbox";
	newReadCheckInput.checked = marked.checked;

	// ##MARK LABEL
	newMarkLabel.classList.add("__text", "__mark");
	newMarkLabel.setAttribute("for", newReadCheckInput.id);
	newMarkLabel.textContent = "Mark as read.";

	// !!ADD TO LINK CONTAINER
	newLinkContainer.appendChild(newLink);

	// !!ADD TO MARK
	newMark.append(newReadCheckInput, newMarkLabel);

	// !!ADD TO DETAIL
	newDetail.append(newTitle, newVol, newAuthor, newLinkContainer);

	// !!ADD TO BOOK
	newBook.append(checkbox, newCover, newTitle, newDetail, newMark);

	if (bookItems.length <= 6) {
		bookContainer.appendChild(newBook);
	}

	preview.firstElementChild.remove();
	preview.textContent = "Preview";
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
			if (urlImg) {
				URL.revokeObjectURL(urlImg);
			}
			urlImg = URL.createObjectURL(file);
			cover.src = urlImg;
			cover.classList.add("__cover", "img-size");
			cover.alt = file.name;
			previewPrevChild.remove();
			preview.appendChild(cover);
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

	imgInput.files = ev.dataTransfer.files;
}

function toClose(event) {
	console.log(preview.firstElementChild === previewPrevChild);
	if (preview.firstElementChild !== previewPrevChild) {
		preview.firstElementChild.replaceWith(previewPrevChild);
	}
	if (!titleInput.value) {
		form.reset();
	}
}