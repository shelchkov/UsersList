// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

// User's List
let usersList = [];

const windowWidth = document.body.clientWidth;

// Sort
let sortDirection = "without";
const select = document.querySelector(".sort--select");
select.onchange = (event) => {
	const sort = event.target.value;

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
const modal = document.querySelector(".modal");
const body = document.querySelector("body");

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

const getUserName = (user) => `${user.name.title} ${user.name.first} ${user.name.last}`;

const getUserLastName = (user) => `${user.name.title} ${user.name.last}`;


// Hide loading screen after user's list was loaded
const hideLoadingScreen = () => 
	document.querySelector(".loading-screen").style.visibility = "hidden";


ajax_get(link, function(data) { // Load Users List
	for(var i = 0; i < data["results"].length; i++) {
		usersList[usersList.length] = data["results"][i];
	}
	updateContent();
});


// User Card
function updateContent() {
	let html = '';
	usersList.forEach(function(user, i) {
		let user_html = 
			`<article class="user user--${i}" title="Show More Info">`;
		user_html += `<div class="user--placeholder"><img class="user--image"
			src=${user.picture.large} alt="${getUserLastName(user)}"></div>`;
		user_html += `<div class="user--info">
			<h4 class="user--info--name">${getUserName(user)}</h4>
			<p class="user--info--show-more">Click To See More</p></div>`;
		user_html += '</article>';
		html += user_html;
	});
	document.querySelector(".users").innerHTML = html;
	document.querySelector("h1").innerHTML = "List of 50 Users";

	// Click Event Listeners
	let userCards = document.querySelectorAll(".user");
	for(let i = 0; i < userCards.length; i++) {
		userCards[i].onclick = () => showInfo(usersList[i]);
		userCards[i].onmouseenter = () => userCardInfoToggle(userCards[i]);
		userCards[i].onmouseleave = () => userCardInfoToggle(userCards[i]);
	}

	// Make div.sort visible
	document.querySelector("div.sort").style.visibility = "visible";

	hideLoadingScreen();
}

function showInfo(user) {
	let userInfo = "";
	const infoBlock = document.querySelector(".modal--info");
	userInfo += `<p class="modal--closeModal modal--closeButton" 
		title="Close">X</p>`;
	userInfo += `<img src=${user.picture.large} alt="${getUserLastName(user)}">`;
	const location = `${user.location.street}, ${user.location.city}, 
		${user.location.state}`;
	userInfo += `<div class="modal--info--text"><p><img class="icon" src=${icons.location.url} 
		onerror="this.src='${icons.location.fallback}'">${location}</p>`;
	userInfo += `<p><img class="icon" src=${icons.email.url}
		onerror="this.src='${icons.email.fallback}'">${user.email}</p>`;
	userInfo += `<p><img class="icon" src=${icons.phone.url}
		onerror="this.src='${icons.phone.fallback}'">${user.phone}</p>`;
	userInfo += `<p><img class="icon" src=${icons.person.url} 
		onerror="this.src='${icons.person.fallback}'">${getUserName(user)}
		</p></div>`;
	infoBlock.innerHTML = userInfo;

	const closeObjects = document.querySelectorAll(".modal--closeModal");
	for (closeObj of closeObjects) {
		closeObj.onclick = hideModal;
	}

	showModal();
}

async function fetchData(url) {
	const response = await fetch(url);
	return response.json();
}

function ajax_get(url, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		try {
			var data = JSON.parse(xmlhttp.responseText);
		} catch(err) {
			console.log(err.message + " in " + xmlhttp.responseText);
			return;
		}
		callback(data);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function userCardInfoToggle(userCard) {
	const usersInfo = [].find.call(userCard.children, item => 
		item.className.split(" ").includes("user--info")
	)
	usersInfo.classList.toggle("move-up");
}

function showModal() {
	modal.style.zIndex = 1;
	modal.style.opacity = 1;
	// Disable scroll
	body.style.overflow = "hidden";
	body.style.paddingRight = `${document.body.clientWidth - windowWidth}px`;
}

function hideModal() {
	modal.style.zIndex = -1;
	modal.style.opacity = 0;
	// Enable scroll
	body.style.overflow = "auto";
	body.style.paddingRight = "";
}
