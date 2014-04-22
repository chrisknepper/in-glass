/* In-Glass Javascript */

window.onload = function() {
	var reading, reading_f, reading_c; //Put values from Ajax here
	var temperature = 0; //The number we display, start at 0
	var MAX_TEMP, MIN_TEMP;
	var red = 220, green = 90, blue = 255; //Give initial weight to RGB background color values
	var display_el = document.querySelector("#temperature");
	var celsius = false;
	var unit_el = document.querySelector("#unit");
	$("#unit").on('click', function() {
		celsius = !celsius;
		temperature = 0;
		requestAnimationFrame(animate);
	})

	getTemperature();

	// CMS helped write this function
	function updateBackgroundColor() {
		if(celsius) {
			MAX_TEMP = 38, MIN_TEMP = 0;
			reading = reading_c;
			unit_el.innerHTML = "C";
			unit_el.dataset.otherunit = "F";
		}
		else {
			MAX_TEMP = 100, MIN_TEMP = 32;
			reading = reading_f;
			unit_el.innerHTML = "F";
			unit_el.dataset.otherunit = "C";
		}
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

	function getTemperature() {
		$.get("/json", function(d) {
			reading_f = parseInt(d.readings[0].f);
			reading_c = parseInt(d.readings[0].c);
			requestAnimationFrame(animate);
		});
	}
}