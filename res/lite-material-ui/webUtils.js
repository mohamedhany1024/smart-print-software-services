let currentScreen = "main";
let currentTab;
let ghosts;

function openScreen(screen) {
	setTimeout(()=> { 
		var screens = document.getElementsByClassName("screen")
	var screenId = screen;
	
	var screenIds;
	document.getElementById(currentScreen).classList.add("screen--closing");
	
	document.getElementById(currentScreen).classList.add("screen--ghost");
	document.getElementById(screen).classList.add("screen--ghost");
	document.getElementById(screen).style.zIndex = 5;
	
	currentScreen = screen;
	document.getElementById(screenId).style.display = "block";
	

	setTimeout(()=> {
		for(i=0; i < screens.length; i++ ) {
			screenIds = screens[i].id;
			if(screenIds != screenId) {
				document.getElementById(screenIds).style.display = "none";
			}
		}
		document.getElementById(screen).style.zIndex = 1;
		ghosts = document.querySelectorAll(".screen--ghost");
		for (j=0; j<ghosts.length; j++) {
			//console.log("as: " + ghosts[j]);
			ghosts[j].classList.remove("screen--ghost");
			ghosts[j].classList.remove("screen--closing");
		}
	}, 300);
	}, 350);
}

function closeScreen(screen) {
	document.getElementById(screen).style.display = "none";
}

function openDialogue(dId) {
	document.getElementById(dId).style.display = "flex";
	//document.getElementById(currentScreen).style.filter = ("blur(12px)")
}

function closeDialogue(dId) {
	document.getElementById(dId).style.display = "none";
	//document.getElementById(currentScreen).style.filter = ("blur(0)")
}

function switchTab(idd, dId) {
	var tabs = document.getElementsByClassName("tabPage");
	currentTab = idd;
	for(i=0; i<tabs.length; i++) {
		if (tabs[i].id != currentTab) {
			tabs[i].style.display = "none";
		}
	}
	document.getElementById(currentTab).style.display = "block";
	var tabOptions = document.getElementsByClassName("tabOption");
	for (i = 0; i<tabOptions.length; i++) {
		if (tabOptions[i].id != dId) {
			//tabOptions[i].style.borderBottom = "";
			//tabOptions[i].style.color = "rgb(192, 191, 188)";
			tabOptions[i].classList.remove("tabOption--Active");
		}
	}
	//document.getElementById(dId).style.borderBottom = "2px solid white";
	//document.getElementById(dId).style.color = "rgba(255, 255, 255, 255)";
	document.getElementById(dId).classList.add("tabOption--Active");
}

function pushToast(text, duration) {
	document.getElementById(currentScreen).innerHTML+= '<div class="toast" id="tmpToast"><p>'+text+'</p></div>';
	//document.getElementById("tmpToast").classList.add("toast--active");
	setTimeout(()=> {
		//document.getElementById("tmpToast").style.display = "none";
		document.getElementById("tmpToast").classList.toggle("toast--inactive");
		setTimeout(()=> {
			document.getElementById("tmpToast").remove();
		}, 400);
	}, duration);
}

function changeProperty(propertyName, propertyValue) {
	document.querySelector(':root').style.setProperty(propertyName, propertyValue);
}

function main() {
	document.getElementById("main").style.display = "block";
	switchTab(document.querySelector('.tabPage').id, document.querySelector('.tabOption').id);
}

window.onload = main;
