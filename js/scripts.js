document.addEventListener('scroll', () => UpdatePerspectiveOrigin());

const main = document.getElementById("perspective-container");

function UpdatePerspectiveOrigin() {
	let scrollPercent = CalculateScrollPercentage(window.scrollY);

	main.style["perspectiveOrigin"] = "center " + scrollPercent + 10 + "%";
	main.style["webkitPerspectiveOriginY"] = scrollPercent + 10 + "%";
}

function CalculateScrollPercentage(scrollY) {
	return scrollY / document.body.scrollHeight * 100;
}