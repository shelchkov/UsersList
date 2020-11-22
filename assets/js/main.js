// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc="
	+ "gender,name,location,email,phone,picture";

let usersList = [];


// Load Users List
fetchData(link, function(data) {
	usersList = data.results;
	updateContent(true);
}, function() {
	const loadingMessage =
		document.querySelector(".loading-screen__message")
	loadingMessage.innerText = "Something went wrong. Try again."
});


// Sort
let sortDirection = "without";
const select = document.querySelector(".sort__select");
select.onchange = function() {
	const sort = this.value;

	if (sort === sortDirection || sort === "without") return;

	if (sortDirection !== "without") {
		usersList = usersList.reverse();
		sortDirection = sort;
		updateContent();

		return;
	}

	sortDirection = sort;
	const getUserName = function(user) {
		return user.name.last + " " + user.name.first;
	}
	const sortDir = sort === "alphabetically" ? 1 : -1

	usersList.sort(function(a, b) { 
		return sortDir * (getUserName(a) > getUserName(b) ? 1 : -1)
	});

	updateContent();
};


// Modal Window
const icons = {
	location: {
		url: "assets/icons/location.svg", 
		fallback : "assets/icons/marker.png"
	},
	email: { 
		url: "assets/icons/email.svg", 
		fallback : "assets/icons/email.png"
	},
	phone: { 
		url: "assets/icons/phone.svg", 
		fallback : "assets/icons/phone.png"
	},
	person: { 
		url: "assets/icons/person.svg", 
		fallback : "assets/icons/person.png"
	}
};


// User Card
function updateContent(isInitializing) {
	let html = '';
	usersList.forEach(function(user) {
		const user_html = createElement(
			"article",
			{ class: "user", title: "Show More Info" },
			[
				createElement(
					"div",
					{ class: "user__placeholder" },
					createElement(
						"img",
						{
							class: "user__image",
							src: user.picture.large,
							alt: getUserLastName(user)
						}
					)
				),
				createElement(
					"div",
					{ class: "user__info" },
					[
						createElement(
							"h4",
							{ class: "user__info__name" },
							getUserName(user)
						),
						createElement(
							"p",
							{ class: "user__info__show-more" },
							"Click To See More"
						)
					]
				)
			]
		)

		html += user_html;
	});

	const users = document.querySelector(".users")
	users.innerHTML = html;

	if (isInitializing) {
		const h1 = document.querySelector("h1")
		h1.innerHTML = "List of 50 Users";
	}

	// Click Event Listeners
	const userCards = document.querySelectorAll(".user");
	for (let i = 0; i < userCards.length; i++) {
		const userCard = userCards[i]
		const user = usersList[i]
		userCard.onclick = function() {
			showInfo(user);
		}
		userCard.onmouseenter = function() {
			userCardInfoToggle(userCard);
		}
		userCard.onmouseleave = function() {
			userCardInfoToggle(userCard);
		}
	}

	if (isInitializing) {
		const divSort = document.querySelector("div.sort")
		divSort.style.visibility = "visible";

		hideLoadingScreen();
	}
}


function showInfo(user) {
	const closeBtn = createElement(
		"p",
		{
			class: "modal__closeModal modal__closeButton",
			title: "Close"
		},
		"X"
	)

	const image = createElement(
		"div",
		{ class: "modal__info__image" },
		createElement(
			"img",
			{ src: user.picture.large, alt: getUserLastName(user) }
		)
	)

	const location = user.location.street + "," + user.location.city +
		"," + user.location.state;

	const locationWithIcon = createElement(
		"div",
		{ class: "modal__info__text" },
		[
			createInfoBlockWithIcon(
				icons.location.url,
				icons.location.fallback,
				location
			),
			createInfoBlockWithIcon(
				icons.email.url,
				icons.email.fallback,
				user.email
			),
			createInfoBlockWithIcon(
				icons.phone.url,
				icons.phone.fallback,
				user.phone
			),
			createInfoBlockWithIcon(
				icons.person.url,
				icons.person.fallback,
				getUserName(user)
			),
		]
	)

	const userInfo = closeBtn + image + locationWithIcon

	const infoBlock = document.querySelector(".modal__info");

	infoBlock.innerHTML = userInfo;

	const closeObjects = document.querySelectorAll(
		".modal__closeModal"
	);

	for (key in closeObjects) {
		const closeObj = closeObjects[key]
		if (closeObj.onclick === null) {
			closeObj.onclick = hideModal;
		}
	}

	showModal();
}


const hideLoadingScreen = function() {
	const loadingScreen = document.querySelector(".loading-screen")
	loadingScreen.style.visibility = "hidden";
}

function fetchData(url, callback, errorHandler) {
	function newCallback(event) {
		callback(JSON.parse(event.currentTarget.response))
	}

	createResponse(url, newCallback, errorHandler)
}

function createResponse(url, callback, errorHandler) {
	const request = new XMLHttpRequest()
	request.addEventListener("load", callback)
	request.addEventListener("error", errorHandler)
	request.open("GET", url)
	request.send()
}

function userCardInfoToggle(userCard) {
	for (key in userCard.children) {
		const item = userCard.children[key]
		if (item.className &&
			item.className.indexOf("user__info") !== -1) {
			item.classList.toggle("move-up");
		}
	}
}

function showModal() {
	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	const windowWidth = body.clientWidth;

	modal.style.zIndex = 1;
	modal.style.opacity = 1;
	// Disable scroll
	body.style.overflow = "hidden";
	body.style.paddingRight = body.clientWidth - windowWidth + "px";
}

function hideModal() {
	const body = document.querySelector("body");
	const modal = document.querySelector(".modal");
	modal.style.zIndex = -1;
	modal.style.opacity = 0;
	// Enable scroll
	body.style.overflow = "auto";
	body.style.paddingRight = "";
}

function createElement (el, props, children) {
	const propsString = Object.keys(props || {})
		.reduce(function(acc, key) {
			return acc + " " + key + '="' + props[key] + '"'
		}, "")

	const formattedChildren = children ?
		(Array.isArray(children) ? children : [children])
		:
		[]
	
	return "<" + el + propsString + ">" + formattedChildren.join("") +
		"</" + el + ">"
}

function createInfoBlockWithIcon (src, fallback, text) {
	return createElement(
		"p",
		{},
		[
			createElement(
				"img",
				{
					class: "icon",
					src: src,
					onerror: createImgOnerror(fallback)
				}
			),
			text
		]
	)
}

function createImgOnerror (fallback) {
	return "this.src='" + fallback + "'"
}

const getUserName = function(user) {
	return user.name.title + " " + user.name.first + " " +
		user.name.last;
}

const getUserLastName = function(user) {
	return user.name.title + " " + user.name.last;
}
