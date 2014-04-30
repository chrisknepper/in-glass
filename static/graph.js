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
	canvas.style.position="absolute";
	canvas.style.top="0";
	canvas.style.left="0";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
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
			ctx.fillText(""+canvas.height-i,0,i);
	}

	//draw x axis
	for(var i=0;i<data.length;i+=10){
		var xPos = (canvas.width/data.length)*.5+((canvas.width/data.length)*i);
		ctx.fillText(data[i].hour+":"+data[i].minute,xPos,canvas.height);
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