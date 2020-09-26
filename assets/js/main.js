// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=" +
	"gender,name,location,email,phone,picture";

let usersList = [];


// Load Users List
fetchData(link).then(function(data) {
	if (data.error) {
		const loadingMessage =
			document.querySelector(".loading-screen__message")
		loadingMessage.innerText = data.error + ". Try again."

		return
	}
	
	usersList = data.results;
	updateContent();
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

const getUserName = function(user) {
	return user.name.title + " " + user.name.first + " " + user.name.last;
}

const getUserLastName = function(user) {
	return user.name.title + " " + user.name.last;
}


// Hide loading screen after user's list was loaded
const hideLoadingScreen = function() {
	const loadingScreen = document.querySelector(".loading-screen")
	loadingScreen.style.visibility = "hidden";
}


// User Card
function updateContent() {
	let html = '';
	usersList.forEach(function(user, i) {
		const user_html = createElement(
			"article",
			{ class: "user", title: "Show More Info" },
			createElement(
				"div",
				{ class: "user__placeholder" },
				createElement(
					"img",
					{
						class: "user__image",
						src: user.picture.large,
						alt: getUserLastName(user)
					},
				)
			),
			createElement(
				"div",
				{ class: "user__info" },
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
			)
		)

		html += user_html;
	});

	const users = document.querySelector(".users")
	users.innerHTML = html;
	const h1 = document.querySelector("h1")
	h1.innerHTML = "List of 50 Users";

	// Click Event Listeners
	let userCards = document.querySelectorAll(".user");
	for (let i = 0; i < userCards.length; i++) {
		userCards[i].onclick = function() {
			showInfo(usersList[i]);
		}
		userCards[i].onmouseenter = function() {
			userCardInfoToggle(userCards[i]);
		}
		userCards[i].onmouseleave = function() {
			userCardInfoToggle(userCards[i]);
		}
	}

	const divSort = document.querySelector("div.sort")
	divSort.style.visibility = "visible";

	hideLoadingScreen();
}


function showInfo(user) {
	const closeBtn = createElement(
		"p",
		{ class: "modal__closeModal modal__closeButton", title: "Close" },
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
	)

	const userInfo = closeBtn + image + locationWithIcon

	const infoBlock = document.querySelector(".modal__info");

	infoBlock.innerHTML = userInfo;

	const closeObjects = document.querySelectorAll(".modal__closeModal");

	for (closeObj of closeObjects) {
		closeObj.onclick = hideModal;
	}

	showModal();
}

async function fetchData(url) {
	try {
		const response = await fetch(url);
		return response.json();
	} catch (error) {
		return { error: error.message }
	}
}

function userCardInfoToggle(userCard) {
	const usersInfo = [].find.call(userCard.children, function(item) { 
		return item.className.split(" ").includes("user__info")
	})
	usersInfo.classList.toggle("move-up");
}

const body = document.querySelector("body");
const windowWidth = body.clientWidth;
const modal = document.querySelector(".modal");

function showModal() {
	modal.style.zIndex = 1;
	modal.style.opacity = 1;
	// Disable scroll
	body.style.overflow = "hidden";
	body.style.paddingRight = body.clientWidth - windowWidth + "px";
}

function hideModal() {
	modal.style.zIndex = -1;
	modal.style.opacity = 0;
	// Enable scroll
	body.style.overflow = "auto";
	body.style.paddingRight = "";
}

function createElement (el, props, ...children) {
	const propsString = Object.entries(props || {})
		.reduce(function(acc, [prop, value]) {
			return acc + " " + prop + '="' + value + '"'
		}, " ")
	
	return "<" + el + propsString + ">" + (children || []).join("") + "</" +
		el + ">"
}

function createInfoBlockWithIcon (src, fallback, text) {
	return createElement(
		"p",
		{},
		createElement(
			"img",
			{
				class: "icon",
				src,
				onerror: createImgOnerror(fallback)
			}
		),
		text
	)
}

function createImgOnerror (fallback) {
	return "this.src='" + fallback + "'"
}
