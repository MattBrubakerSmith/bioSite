// I plan to add the document ready check here.

/* 
	Adding event listeners to the document that execute the 
	UpdateLayout function when a user scrolls or resizes 
	their browser window.
*/
document.addEventListener('scroll', () => UpdateLayout());
window.addEventListener('resize', () => UpdateLayout());

/* 
	The min-width of the browser window, in pixels, 
	where the scroll and resize events should fire.
	The page layout changes significantly at 900px.
*/
let eventListenerBreakpoint = 900;

// Locates the perspective-container element and assigns it a JS variable.
let perspectiveContainer = document.getElementById("perspective-container");

/*
	I laid out the HTML in a different way to make the
	3D perspective affect the main part of my site. Because of 
	this, I have to use JS magic to vertically align the
	correct figure to it's corresponding article.

	I set the figure position styles here to show that you can, 
	but I will probably move them to the CSS later.
*/
let manFigure = document.getElementById("man-section-figure");
let manSection = document.getElementById("man");
manFigure.style.position = "absolute";

let careerFigure = document.getElementById("career-section-figure");
let careerSection = document.getElementById("career");
careerFigure.style.position = "absolute";

let philosophyFigure = document.getElementById("philosophy-section-figure");
let philosophySection = document.getElementById("philosophy");
philosophyFigure.style.position = "absolute";

// WEEK 8 NEW STUFF!
/*
	I decided to go a little crazy and make it so any figure on the page can be viewed
	in a modal when it is clicked.
*/

// Gets the figure modal, the close button, and all of the figures on the page.
let figureModal = document.getElementById("figure-modal");
let figureModalCloseButton = document.getElementById("figure-modal-close-button");
let figures = document.getElementsByTagName("figure");

// Loops through all of the figures and adds a click event listener
for(let i = 0; i < figures.length; i++) {
	// Sends a clone of the figure node (element) to the showFigureModal function
	figures[i].addEventListener("click", () => showFigureModal(figures[i].cloneNode(true)));
}

// Adds close event to the modal close button
figureModalCloseButton.addEventListener("click", () => closeFigureModal());
/* 
	Adds same close event to the modal itself, so technically you can click anywhere
	to close it. I prefer to have both a button and a click anywhere catch all here
	because it allows users to intuit either solution for closing the modal and they both work.
*/
figureModal.addEventListener("click", () => closeFigureModal());

// Initialize a variable to hold the current figure in the modal
let currentFigure;

/* 
	Shows modal! This function takes a DOM node (HTML element) as a parameter.
	In this case, the node I am sending it is the clone of whatever figure
	the user clicks on.
*/
function showFigureModal(figure) {
	// Makes the figure visible and in flex mode.
	figureModal.style.display = "flex";

	// Prevents the user from scrolling the page. I switch it back upon modal close.
	document.body.style.overflow = "hidden";

	// If there is already a figure in the modal, remove it.
	if(currentFigure && currentFigure.parentNode == figureModal) {
		figureModal.removeChild(currentFigure);
	}

	// Puts the cloned figure element inside the figureModal element.
	figureModal.appendChild(figure);

	// Removes the id attribute to ensure the clone is generic
	figure.removeAttribute("id");

	/* 
		Removes the media query classes, if they exist, so if the user 
		resizes the window with a modal open, the figure won't potentially disappear.
	*/
	figure.classList.remove("small-displays-only");
	figure.classList.remove("larger-displays-only");

	/* 
		Resets the cursor: pointer attribute to make the mouse cursor default on hover,
		rather than the pointer hand.
	*/
	figure.style.cursor = "auto";

	// If this figure was absolutely position, it resets it to default.
	figure.style.position = "static";

	// (Re)defines currentFigure
	currentFigure = figure;

	// Initialize positioning
	UpdateFigureModalPositions();
}

// Closes modal!
function closeFigureModal() {

	// Makes the modal disappear
	figureModal.style.display = "none";

	// Allows the user to scroll the page again
	document.body.style.overflow = "initial";
	
	// Removes the figure, if it exists and figureModal is its parent node
	if(currentFigure && currentFigure.parentNode == figureModal) {
		figureModal.removeChild(currentFigure);
	}
}

// Fire initial layout update
UpdateLayout();

/* 
	This is the function that the event listeners execute.
	It actually just fires two other functions, but I split
	them off because it is good practice to give functions
	single purposes. It's a similar way of thinking to atomic design.
*/
function UpdateLayout(){
	// Only fire these functions if the browser window is 901px or more.
	if(window.innerWidth > eventListenerBreakpoint)
	{
		UpdatePerspectiveOrigin();
		UpdateFigureVerticalPositions();
	}
	// Updates modal
	UpdateFigureModalPositions();
}

/* 
	The UpdatePerspectiveOrigin function updates the 
	perspective-origin CSS property on the perspective-container.
	It is hard to explain, but this is the most magical
	function in this file. It allows me to create the illusion
	that the user is moving up and down in a physical space
	when they scroll the document.

	I also fire it when the page resizes, because that effects
	scroll positions as well.
*/
function UpdatePerspectiveOrigin() {
	// See the CalculateScorePercentage function below to see what I am doing here.
	let scrollPercent = CalculateScrollPercentage(window.scrollY);

	/* 
		Updates the perspective-container perspective-origin style
		for both perspective-origin and -webkit-perspective-origin.
	*/
	perspectiveContainer.style["perspectiveOrigin"] = "center " + scrollPercent + "%";
	perspectiveContainer.style["webkitPerspectiveOriginY"] = scrollPercent + "%";
}

/* 
	This function updates the figures' top CSS property
	to match it's corresponding article.

	It might not be necessary to fire it on page scroll,
	but it needs to fire on page resize.

	I let it fire on both just to make sure it stays in the right place.
*/
function UpdateFigureVerticalPositions() { 
	manFigure.style.top = manSection.offsetTop + "px";
	careerFigure.style.top = careerSection.offsetTop + "px";
	philosophyFigure.style.top = philosophySection.offsetTop + "px";
}

// This fires on page scroll and window resize to keep the modal in the correct position.
function UpdateFigureModalPositions() {

	// Sets the top of the modal to the top of the browser window.
	figureModal.style.top = window.scrollY + "px";

	// If the currentFigure exists...
	if(currentFigure) {
		// Gets the distance between the right side of the figure and the edge of the browser window.
		let closeButtonXOffset = window.innerWidth - currentFigure.getBoundingClientRect().right;

		// Updates the modal close button margin-right so it is perfectly aligned with the right edge of the figure.
		figureModalCloseButton.style.marginRight = closeButtonXOffset + "px";
	}
}

/* 
	I call this function in the UpdatePerspectiveOrigin function.
	Unlike the other functions, it takes a parameter (scrollY),
	and returns a value.
*/
function CalculateScrollPercentage(scrollY) {
	// document.body.scrollHeight is the full height of the body element.
	let pageHeight = document.body.scrollHeight;

	/* 
		By making the offset half the height of the browser window, I guarantee that the most
		readable text is just above the center of the page, regardless of the user's browser height.
	*/
	let offsetY = window.innerHeight / 2.7;

	// This calculates the ratio of the scroll position (plus an offset) to the page height
	let scrollToPageHeightRatio = (scrollY + offsetY) / pageHeight;

	// Turns the ratio into a percent
	let ratioToPercentage = scrollToPageHeightRatio * 100;

	// Returns the calculated value to wherever this function is called.
	return ratioToPercentage;

	// This is a shorthand way to do the same thing.
	// return scrollY / document.body.scrollHeight * 100;
}

