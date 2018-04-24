// I plan to add the document ready check here.

/* 
	Adding event listeners to the document that execute the 
	UpdateLayout function when a user scrolls or resizes 
	their browser window.
*/
document.addEventListener('scroll', () => UpdateLayout());
window.addEventListener('resize', () => UpdateLayout());

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

/* 
	This is the function that the event listeners execute.
	It actually just fires two other functions, but I split
	them off because it is good practice to give functions
	single purposes. It's a similar way of thinking to atomic design.
*/
function UpdateLayout(){
	console.log("yep")
	UpdatePerspectiveOrigin();
	UpdateFigureVerticalPositions();
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

		I added an extra 10% so that the least skewed content is 10% down the page.
	*/
	perspectiveContainer.style["perspectiveOrigin"] = "center " + scrollPercent + 10 + "%";
	perspectiveContainer.style["webkitPerspectiveOriginY"] = scrollPercent + 10 + "%";
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

/* 
	I call this function in the UpdatePerspectiveOrigin function.
	Unlike the other functions, it takes a parameter (scrollY),
	and returns a value.
*/
function CalculateScrollPercentage(scrollY) {
	// document.body.scrollHeight is the full height of the body element.
	let pageHeight = document.body.scrollHeight;

	// This calculates the ratio of the scroll position to the page height.
	let scrollToPageHeightRatio = scrollY / pageHeight;

	// Turns the ratio into a percent
	let ratioToPercentage = scrollToPageHeightRatio * 100;

	// Returns the calculated value to wherever this function is called.
	return ratioToPercentage;

	// This is a shorthand way to do the same thing.
	// return scrollY / document.body.scrollHeight * 100;
}