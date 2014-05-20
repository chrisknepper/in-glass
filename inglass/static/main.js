/* In-Glass Javascript */

window.onload = function() {

	var current_device = 0; //Index of the thermometer we are interested in, defaults to the first (0th) one

	//Event Listeners
	$("#nav_button").on('click', function(e) {
		e.preventDefault();
		$("#nav").toggleClass('visible');
	});

	$("#device_picker").on('click', function(e) {
		e.preventDefault();
		$("#device_list").toggleClass('visible');
	});

	$(".device_name").on('click', function(e) {
		e.preventDefault();
		current_device = $(e.target).data("device");
		$("#device_picker").text($(e.target).text());
		handleDevicePick();
	});

	if($("#settings").length) {
		var reading, reading_f, reading_c; //Put values from Ajax here
		var auto_timer; //A setInterval which calls getTemperature() at an arbitrary interval
		var temperature = 0; //The number we display, start at 0
		var MAX_TEMP, MIN_TEMP;
		var red = 220, green = 90, blue = 255; //Give initial weight to RGB background color values
		var display_el = document.querySelector("#temperature");
		var celsius = false;
		var unit_el = document.querySelector("#unit");

		if(localStorage.getItem('type') != null){
			var type = localStorage.getItem('type');
			if(type == 'Celsius'){
				celsius = true;
				$('#celsiusSelect').css('text-decoration','underline');
			}else if(type == "Fahrenheit"){
				celsius = false;
				$('#fahrenheitSelect').css('text-decoration','underline');
			}else{//Just a fall back
				celsius = false;
			}
		}


		$(".tempType").on('click', function(e){
			celsius = !celsius;
			getTemperature();
			var tempType = $(this).text();
			localStorage.setItem('type',tempType);
			$('#celsiusSelect').css('text-decoration','none');
			$('#fahrenheitSelect').css('text-decoration','none');
			if(celsius)
				$('#celsiusSelect').css('text-decoration','underline');
			else
				$('#fahrenheitSelect').css('text-decoration','underline');
			console.log(localStorage.getItem('type'));
		});

		$("#settings_button").on('click', function(e) {
			$("#settings").toggleClass('visible');
		});

		$("#update_enable").on('change', function(e) {
			if(e.target.checked) {
				var time_limit = $("#seconds_count").val();
				auto_timer = parseInt(time_limit) ? returnTimerObject(parseInt(time_limit)) : returnTimerObject();
				console.log("Auto-Updating Enabled");
			}
			else {
				if(typeof auto_timer !== null) {
					clearInterval(auto_timer);
					auto_timer = null;
				}
			}
		});

		function returnTimerObject(limit) {
			limit = limit || 30;
			return setInterval(function(){
				getTemperature();
			}, limit * 1000);
		}

		// CMS helped write this function
		function updateBackgroundColor() {
			if(celsius) {
				MAX_TEMP = 38, MIN_TEMP = 0;
				reading = reading_c;
				unit_el.innerHTML = "C";
			}
			else {
				MAX_TEMP = 100, MIN_TEMP = 32;
				reading = reading_f;
				unit_el.innerHTML = "F";
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
			temperature = 0;
			console.log("Fetching temperature");
			$.get("/json", function(d) {
				if(current_device in d.readings) {
					reading_f = parseInt(d.readings[current_device].f);
					reading_c = parseInt(d.readings[current_device].c);
					requestAnimationFrame(animate);		
				}
				else {
					console.error("Failed to get temperature from server");
				}
				
			});
		}

		getTemperature();
	}

	if($("#chart").length) {

		function generateDateURL(device, year, month, day) {
			return "/json/" + String(device) + "/" + String(year) + "/" + String(month) + "/" + String(day); 
		}

		function graphTemperature() {

			$("#chart").empty(); //Clear the chart from any previous graphings

			//Graphing Functionality
			var margin = {top: 20, right: 30, bottom: 30, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var chart = d3.select("#chart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			 	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var current = new Date();
			var year = current.getFullYear();
			var month = current.getMonth() + 1;
			var day = current.getDate();
			var url = generateDateURL(current_device, year, month, day);

			console.log(url);

			d3.json(url, function(error, json) {
				data = json.logs;
				x.domain(data.map(function(d) { return d.hour; }));
				var range = d3.extent(data, function(d) { return d.f; }); //Puts the min and max of the data set, respectively, into an array
				if(range[0] === range[1]) { //D3 won't show graph anything if the min and max are the same
					range[0] -= 10; //So let's deal with that
				}
				y.domain([range[0], range[1]]);
				chart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				chart.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				chart.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return x(d.hour); })
					.attr("y", function(d) { return y(d.f); })
					.attr("height", function(d) { return height - y(d.f); })
					.attr("width", x.rangeBand());
			});
		}

		graphTemperature();

	}

	//We do something different when the user picks a device from the list depending on the page we're on
	function handleDevicePick() {
		
		if($("#settings").length) { //If we're on the main (current temperature) page
			getTemperature();
		}
		else if($("#chart").length) { //If we're on the graph page
			graphTemperature();
		}
	}
}