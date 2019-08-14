// Link to API
var link = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

var width = document.documentElement.clientWidth; // Page Width
var numColumns = numOfCols(width); // Number of Columns

window.onresize = function(event) {
	width = event.target.innerWidth;
	numColumns = numOfCols(width);
	updateContent();
}

var sort = "without"; // Initial value
var select = document.querySelector("select#sort");
select.onchange = function(event) { // Add Event Listener
	sort = event.target.value; // New Value

	if(sort == "alphabetically") {
		usersList.sort(function(a, b){
			if(a["name"]["last"] < b["name"]["last"])
				return -1;
			else if(a["name"]["last"] > b["name"]["last"]) 
				return 1;
			else if(a["name"]["first"] < b["name"]["first"])
				return -1;
			return 1;
		})
	}	else if (sort == "reverse") {
		usersList.reverse();
	}
	updateContent();
};

var usersList = [];
ajax_get(link, function(data) { // Load Users List
	for(var i = 0; i < data["results"].length; i++) {
		var user = data["results"][i];
		usersList[usersList.length] = user;
	}
	updateContent();
});


function ajax_get(url, callback) {
	// Создаём новый объект XMLHttpRequest
	var xmlhttp = new XMLHttpRequest();
	// Добавляем Event Listener, который вызовет callback function
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { // Если код ответа сервера не 200, то это ошибка
		try {
			var data = JSON.parse(xmlhttp.responseText);
		} catch(err) {
			console.log(err.message + " in " + xmlhttp.responseText);
			return;
		}
		callback(data);
		}
	};
	// Конфигурируем асинхронный GET-запрос на URL
	xmlhttp.open("GET", url, true);
	// Отсылаем запрос
	xmlhttp.send();
}

function updateContent() {
	var html = '<div class="row">';
	usersList.forEach(function(user, i) {
		if(i % numColumns == 0 && i != 0) {
			html += '</div><div class="row">';
		}
		var user_html = '<div class="user" title="Show More Info">';
		user_html += ('<img src="' + user["picture"]["medium"] + '">');
		user_html += ('<p class="name">' + user["name"]["title"] + " " + user["name"]["first"] + " " + user["name"]["last"] + '</p>');
		user_html += '</div>';
		html += user_html;
	});
	html += "</div>";
	document.querySelector("div.users").innerHTML = html;
	document.querySelector("h1").innerHTML = "Пользователи";

	// Click Event Listener
	var userDivs = document.querySelectorAll("div.user");
	for(var i = 0; i < userDivs.length; i++) {
		userDivs[i].onclick = function(event) {
			document.querySelector(".wrapper").setAttribute("visibility", "visible");
			document.querySelector(".info").setAttribute("visibility", "visible");
			document.querySelector(".wrapper").style.zIndex = "1";
			clickHandler(event);
		}
	}
}

function clickHandler(event) {
	if(event.target.className == "name") {
		var imgUrl = event.target.previousSibling.currentSrc;
		var name = event.target.innerText;
	} else {
		var imgUrl = event.target.currentSrc;
		var name = event.target.nextSibling.innerText;
	}
	for(let user of usersList) {
		if(imgUrl == user.picture.medium) {
			if(name == user.name.title + " " + user.name.first + " " + user.name.last) {
				showInfo(user);
				break;
			}
		}
	}
}

function showInfo(user) {
	var infoBlock = document.querySelector("div.info");
	infoBlock.style.opacity = 1;
	var userInfo = "";
	userInfo += '<p id="closeWindow" title="Close">X</p>';
	userInfo += '<img src="' + user["picture"]["large"] + '">';
	var location = user["location"]["street"] + ', ' + user["location"]["city"] + ", " + user["location"]["state"];
	userInfo += '<p><img class="icon" src="assets/icons/marker.png">' + location + '</p>';
	userInfo += '<p><img class="icon" src="assets/icons/email.png">' + user["email"] + '</p>';
	userInfo += '<p><img class="icon" src="assets/icons/phone.png">' + user["phone"] + '</p>';
	var userName = user["name"]["title"] + " " + user["name"]["first"] + " " + user["name"]["last"];
	userInfo += '<p><img class="icon" src="assets/icons/person.png">' + userName + '</p>';
	infoBlock.innerHTML = userInfo;

	document.querySelector("p#closeWindow").onclick = function() {
		infoBlock.style.zIndex = "-1";
		infoBlock.setAttribute("visibility", "hidden");
		document.querySelector(".wrapper").setAttribute("visibility", "hidden");
		document.querySelector(".wrapper").style.zIndex = "-1";
		infoBlock.style.opacity = 0;
	}
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