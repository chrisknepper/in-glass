/* In-Glass Javascript */

window.onload = function() {
	var reading = 70; //Dummy values for reading from TEMPer, we should fetch this with Ajax
	var temperature = 0; //Display number, start at 0
	var red = 220, green = 90, blue = 255; //Give initial weight to RGB background color values
	var display_el = document.querySelector("#temperature");
	display_el.innerHTML = temperature;

	// CMS helped write this function
	function updateBackgroundColor() {
		var MAX_TEMP = 100, MIN_TEMP = 32;
		var tmp_pct = (temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
		// Red and blue are inversely related
		var new_red = red * tmp_pct;
		var new_blue = new_blue = blue * (1 - tmp_pct);
		var new_green = (1 - (Math.abs(tmp_pct, 1 - tmp_pct))) * green;

		var new_color = "rgba(" + parseInt(new_red) + "," + parseInt(new_green) + "," + parseInt(new_blue) + "," + "1)";
		document.body.style.background = new_color;
	}

	function animate() {
		//Nicely faaaade the background every frame
		//This doesn't work if a CSS transition is applied to the body
		updateBackgroundColor();
		display_el.innerHTML = temperature;
		if (temperature < reading) {
			temperature = temperature + 1;
			requestAnimationFrame(animate);
		}
	}

	requestAnimationFrame(animate);
}