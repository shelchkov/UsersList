// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

var width = document.documentElement.clientWidth; // Page Width
var numColumns = 50; // numOfCols(width); // Number of Columns

window.onresize = function(event) {
	console.log(event);
	width = event.target.innerWidth;
	numColumns = 50; // numOfCols(width);
	updateContent();
}

let sort = "without"; // Initial value
var select = document.querySelector("select#sort");
select.onchange = function(event) { // Add Event Listener
	sort = event.target.value; // New Value

	if(sort === "alphabetically" || sort === "reverse") {
		usersList.sort(function(a, b){
			if(a["name"]["last"] + a["name"]["first"] < b["name"]["last"] + b["name"]["first"])
				return -1;
			else if(a["name"]["last"] + a["name"]["first"] > b["name"]["last"] + b["name"]["first"]) 
				return 1;
			return 0;
		});
		if (sort == "reverse") {
			usersList.reverse();
		}
		updateContent();
	}
};

// Modal Window
const modal = document.querySelector(".modal");

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

const showModal = () => {
	modal.style.zIndex = 1;
	modal.style.opacity = 1;
}

const hideModal = () => {
	modal.style.zIndex = -1;
	modal.style.opacity = 0;
}

const getUserName = (user) => `${user.name.title} ${user.name.first} ${user.name.last}`;

const getUserLastName = (user) => `${user.name.title} ${user.name.last}`;


// Hide loading screen after user's list was loaded
const hideLoadingScreen = () => {
	document.querySelector(".loading-screen").style.visibility = "hidden";
}

// User's List
var usersList = [];
ajax_get(link, function(data) { // Load Users List
	for(var i = 0; i < data["results"].length; i++) {
		usersList[usersList.length] = data["results"][i];
	}
	updateContent();
});

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


// User Card
userCardShowMore = (userNumber) => {
	const selected = document.querySelector(`.user--${userNumber} > .user--info`);
	console.log(selected);

	selected.classList.add("move-up");
}

userCardHideMore = (userNumber) => {
	// TODO: Move to a function
	const selected = document.querySelector(`.user--${userNumber} > .user--info`);	
	selected.classList.remove("move-up");
}


function updateContent() {
	let html = '<div class="row">';
	usersList.forEach(function(user, i) {
		if(i % numColumns == 0 && i != 0) {
			html += '</div><div class="row">';
		}
		let user_html = 
			`<article class="user user--${i}" title="Show More Info">`;
		user_html += `<img src=${user.picture.large} 
			alt=${getUserLastName(user)}>`;
		user_html += `<div class="user--info">
			<h4 class="user--info--name">${getUserName(user)}</h4>
			<p class="user--info--show-more">Click To See More</p></div>`;
		user_html += '</article>';
		html += user_html;
	});
	html += "</div>";
	document.querySelector("div.users").innerHTML = html;
	document.querySelector("h1").innerHTML = "List of 50 Users";

	// Click Event Listener
	let userCards = document.querySelectorAll(".user");
	for(let i = 0; i < userCards.length; i++) {
		userCards[i].onclick = function() {
			showInfo(usersList[i]);
		}

		userCards[i].onmouseover = function() {
			userCardShowMore(i);
		}

		userCards[i].onmouseout = function() {
			userCardHideMore(i);
		}
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
	userInfo += `<img src=${user.picture.large} alt=${getUserLastName(user)}>`;
	const location = `${user.location.street}, ${user.location.city}, 
		${user.location.state}`;
	userInfo += `<p><img class="icon" src=${icons.location.url} 
		onerror="this.src='${icons.location.fallback}'">${location}</p>`;
	userInfo += `<p><img class="icon" src=${icons.email.url}
		onerror="this.src='${icons.email.fallback}'">${user.email}</p>`;
	userInfo += `<p><img class="icon" src=${icons.phone.url}
		onerror="this.src='${icons.phone.fallback}'">${user.phone}</p>`;
	userInfo += `<p><img class="icon" src=${icons.person.url} 
		onerror="this.src='${icons.person.fallback}'">${getUserName(user)}
		</p>`;
	infoBlock.innerHTML = userInfo;

	const closeObjects = document.querySelectorAll(".modal--closeModal");
	for (closeObj of closeObjects) {
		closeObj.onclick = hideModal;
	}

	showModal();
}

function numOfCols(width) {
	var numCols = 1; // Number of Columns
	if(width > 1200)
		numCols = 8;
	else if(width > 1000)
		numCols = 6;
	else if(width > 770)
		numCols = 5;
	else if(width > 580)
		numCols = 4;
	else if(width > 400)
		numCols = 3;
	else if(width > 240)
		numCols = 2;
	return numCols;
}