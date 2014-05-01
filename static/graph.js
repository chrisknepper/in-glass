$.getJSON("/json/0/2014/4/29", function(data){
	var dataArray = [];

	$.each(data.logs, function(key, val){
		dataArray.push(val);
	});

	var canvas=document.querySelector("canvas");
	setupCanvas(canvas);
	draw(canvas, dataArray);
});

function setupCanvas(canvas){
	canvas.width = 1024;
	canvas.height = 768;
}

function draw(canvas, data){
	var ctx = canvas.getContext("2d");

	//draw background
	ctx.fillStyle = "#555555";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	//draw lines
	ctx.beginPath();
	ctx.moveTo(20+((canvas.width/data.length)*.5),canvas.height-data[0].f);
	for(var i=0;i<data.length;i++){
		//calculate X pos based on number of data points
		var xPos = (canvas.width/data.length)*.5+((canvas.width/data.length)*i);
		var yPos = canvas.height-data[i].f;

		ctx.strokeStyle = "#AAAAAA";
		ctx.lineTo(xPos, yPos);
	}
	ctx.stroke();
	ctx.closePath();

	//draw points
	for(var i=0;i<data.length;i++){
		//calculate X pos based on number of data points
		var xPos = (canvas.width/data.length)*.5+((canvas.width/data.length)*i);
		var yPos = canvas.height-data[i].f;
		var r = 2;

		ctx.fillStyle = "#5555DD";
		ctx.beginPath();
		ctx.arc(xPos,yPos,r,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
	}

	//draw y axis
	ctx.fillStyle="#AAAAAA";
	for(var i=0;i<canvas.height;i+=25){
		ctx.fillText(canvas.height-i,2,i);
	}

	//draw x axis
	for(var i=0;i<data.length;i+=Math.floor(data.length/10)){
		var xPos = (canvas.width/data.length)*.5+((canvas.width/data.length)*i);

		var xString = "";
		var text;

		if(data[i].hour>12){
			xString+=(data[i].hour-12);
			text = "pm";
		} else {
			xString+=(data[i].hour);
			text="am";
		}

		if(data[i].minute.toString().length>1){
			xString+=":";
		} else {
			xString+=":0";
		}

		xString+=data[i].minute+text;

		ctx.fillText(xString,xPos,canvas.height-2);
	}
}

//this needs to be implemented*********************************************************************************
//*************************************************************************************************************
//*************************************************************************************************************
function mapValue(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
//*************************************************************************************************************
//*************************************************************************************************************
//*************************************************************************************************************