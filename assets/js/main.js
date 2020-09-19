// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=" +
	"gender,name,location,email,phone,picture";

let usersList = [];


// Load Users List
fetchData(link).then(data => {
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
	const getUserName = (user) => `${user.name.last} ${user.name.first}`;
	const sortDir = sort === "alphabetically" ? 1 : -1

	usersList.sort((a, b) => 
		sortDir * (getUserName(a) > getUserName(b) ? 1 : -1)
	);

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

const getUserName = (user) =>
	`${user.name.title} ${user.name.first} ${user.name.last}`;
const getUserLastName = (user) => `${user.name.title} ${user.name.last}`;


// Hide loading screen after user's list was loaded
const hideLoadingScreen = () => {
	const loadingScreen = document.querySelector(".loading-screen")
	loadingScreen.style.visibility = "hidden";
}


// User Card
function updateContent() {
	let html = '';
	usersList.forEach(function(user, i) {
		let user_html = 
			`<article class="user user--${i}" title="Show More Info">`;
		user_html += `<div class="user__placeholder">
			<img class="user__image" src=${user.picture.large}
			alt="${getUserLastName(user)}"></div>`;
		user_html += `<div class="user__info">
			<h4 class="user__info__name">${getUserName(user)}</h4>
			<p class="user__info__show-more">Click To See More</p></div>`;
		user_html += '</article>';
		html += user_html;
	});

	const users = document.querySelector(".users")
	users.innerHTML = html;
	const h1 = document.querySelector("h1")
	h1.innerHTML = "List of 50 Users";

	// Click Event Listeners
	let userCards = document.querySelectorAll(".user");
	for(let i = 0; i < userCards.length; i++) {
		userCards[i].onclick = () => showInfo(usersList[i]);
		userCards[i].onmouseenter = () =>
			userCardInfoToggle(userCards[i]);
		userCards[i].onmouseleave = () =>
			userCardInfoToggle(userCards[i]);
	}

	const divSort = document.querySelector("div.sort")
	divSort.style.visibility = "visible";

	hideLoadingScreen();
}


function showInfo(user) {
	let userInfo = "";
	const infoBlock = document.querySelector(".modal__info");
	userInfo += `<p class="modal__closeModal modal__closeButton"
		title="Close">X</p>`;
	userInfo += `<div class="modal__info__image">
		<img src=${user.picture.large} alt="${getUserLastName(user)}">
		</div>`;
	const location = `${user.location.street}, ${user.location.city}, 
		${user.location.state}`;
	userInfo += `<div class="modal__info__text"><p><img class="icon"
		src=${icons.location.url} 
		onerror="this.src='${icons.location.fallback}'">${location}</p>`;
	userInfo += `<p><img class="icon" src=${icons.email.url}
		onerror="this.src='${icons.email.fallback}'">${user.email}</p>`;
	userInfo += `<p><img class="icon" src=${icons.phone.url}
		onerror="this.src='${icons.phone.fallback}'">${user.phone}</p>`;
	userInfo += `<p><img class="icon" src=${icons.person.url} 
		onerror="this.src='${icons.person.fallback}'">${getUserName(user)}
		</p></div>`;
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
	const usersInfo = [].find.call(userCard.children, item => 
		item.className.split(" ").includes("user__info")
	)
	usersInfo.classList.toggle("move-up");
}

const windowWidth = body.clientWidth;
const modal = document.querySelector(".modal");
const body = document.querySelector("body");

function showModal() {
	modal.style.zIndex = 1;
	modal.style.opacity = 1;
	// Disable scroll
	body.style.overflow = "hidden";
	body.style.paddingRight = `${body.clientWidth - windowWidth}px`;
}

function hideModal() {
	modal.style.zIndex = -1;
	modal.style.opacity = 0;
	// Enable scroll
	body.style.overflow = "auto";
	body.style.paddingRight = "";
}
