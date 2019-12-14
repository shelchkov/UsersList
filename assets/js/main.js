// Link to API
const link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

var width = document.documentElement.clientWidth; // Page Width
var numColumns = numOfCols(width); // Number of Columns

window.onresize = function(event) {
	width = event.target.innerWidth;
	numColumns = numOfCols(width);
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

const showModal = () => {
	const wrapper = document.querySelector(".wrapper");
	wrapper.style.visibility = "visible";
	document.querySelector(".info").style.visibility = "visible";
	wrapper.style.zIndex = "1";
	wrapper.style.opacity = 1;
}

const hideLoadingScreen = () => {
	document.querySelector(".loading-screen").style.visibility = "hidden";
}

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

function updateContent() {
	let html = '<div class="row">';
	usersList.forEach(function(user, i) {
		if(i % numColumns == 0 && i != 0) {
			html += '</div><div class="row">';
		}
		let user_html = 
			`<article class="user user--${i}" title="Show More Info">`;
		user_html += ('<img src="' + user["picture"]["large"] + 
			'" alt="' + `${user.name.title} ${user.name.last}` + '">');
		user_html += `<h4 class="user--name"> ${user["name"]["title"]} 
			${user["name"]["first"]} ${user["name"]["last"]}</h4>`;
		user_html += '</article>';
		html += user_html;
	});
	html += "</div>";
	document.querySelector("div.users").innerHTML = html;
	document.querySelector("h1").innerHTML = "List of 50 Users";

	// Click Event Listener
	let userCards = document.querySelectorAll(".user");
	for(let i = 0; i < userCards.length; i++) {
		userCards[i].onclick = function(event) {
			userCardClickHandler(event);
		}
	}

	// Change max-width for .user
	var divUsers = document.querySelectorAll(".user");
	var newMaxWidth = divUsers[0].offsetWidth;

	for(var i = 0; i < divUsers.length; i++) {
		divUsers[i].style.maxWidth = (newMaxWidth - 10) + "px";
	}

	// Make div.sort visible
	document.querySelector("div.sort").style.visibility = "visible";

	hideLoadingScreen();
}

function userCardClickHandler(event) {
	let userNumber = undefined;
	for (element of event.path) {
		const classList = element.classList;
		if (!classList.length) continue;

		let foundClass = undefined;

		for (elementClass of classList) {
			if (elementClass.includes("user--")) {
				foundClass = elementClass;
				break;
			}
		}

		if (!foundClass) continue;

		userNumber = parseInt(foundClass.split("--")[1]);
		break;
	}

	if(userNumber === undefined) {
		throw("Something went wrong while trying to select user");
		return;
	}

	showInfo(usersList[userNumber]);
}

function showInfo(user) {
	let infoBlock = document.querySelector("div.info");
	infoBlock.style.opacity = 1;
	let userInfo = "";
	userInfo += '<p id="closeWindow" title="Close">X</p>';
	userInfo += '<img src="' + user["picture"]["large"] + '" alt="' + user.name.title + ' ' + user.name.last + '">';
	var location = user["location"]["street"] + ', ' + user["location"]["city"] + ", " + user["location"]["state"];
	userInfo += '<p><img class="icon" src="assets/icons/marker.png">' + location + '</p>';
	userInfo += '<p><img class="icon" src="assets/icons/email.png">' + user["email"] + '</p>';
	userInfo += '<p><img class="icon" src="assets/icons/phone.png">' + user["phone"] + '</p>';
	var userName = user["name"]["title"] + " " + user["name"]["first"] + " " + user["name"]["last"];
	userInfo += '<p><img class="icon" src="assets/icons/person.png">' + userName + '</p>';
	infoBlock.innerHTML = userInfo;

	const closeObjects = document.querySelectorAll("#closeWindow");
	for (closeObj of closeObjects) {
		closeObj.onclick = function() {
			infoBlock.style.visibility = "hidden";
			const wrapper = document.querySelector(".wrapper")
			wrapper.style.visibility = "hidden";
			wrapper.style.zIndex = "-1";
			infoBlock.style.opacity = 0;
			wrapper.style.opacity = 0;
		}
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