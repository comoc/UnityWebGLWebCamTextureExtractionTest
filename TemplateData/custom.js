var canvas;
var context;
var detector;

window.onload = function() {
	'use strict';
	canvas = document.getElementById('hidden_canvas');
	context = canvas.getContext('2d');
	detector = new AR.Detector();
};

var gameObjectName;
var methodNameSuccess;
var methodNameError;

function post(name, success, error, base64) {
	'use strict';
	gameObjectName = name;
	methodNameSuccess = success;
	methodNameError = error;

	var image = new Image();
	image.onload = function() {
		context.drawImage(image, 0, 0);
		var imagedata = context.getImageData(0, 0, image.width, image.height);
		var markers = detector.detect(imagedata);
		var jsonMarkers = JSON.stringify(markers);
		SendMessage(gameObjectName, methodNameSuccess, jsonMarkers);
		drawCorners(markers);
		drawId(markers);
	};
	image.src = base64;
}

function drawCorners(markers){
	'use strict';
	var corners, corner, i, j;

	context.lineWidth = 3;

	for (i = 0; i !== markers.length; ++ i){
		corners = markers[i].corners;

		context.strokeStyle = "red";
		context.beginPath();

		for (j = 0; j !== corners.length; ++ j){
			corner = corners[j];
			context.moveTo(corner.x, corner.y);
			corner = corners[(j + 1) % corners.length];
			context.lineTo(corner.x, corner.y);
		}

		context.stroke();
		context.closePath();

		context.strokeStyle = "green";
		context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
	}
}

function drawId(markers){
	'use strict';
	var corners, corner, x, y, i, j;

	context.strokeStyle = "blue";
	context.lineWidth = 1;

	for (i = 0; i !== markers.length; ++ i){
		corners = markers[i].corners;

		x = Infinity;
		y = Infinity;

		for (j = 0; j !== corners.length; ++ j){
			corner = corners[j];

			x = Math.min(x, corner.x);
			y = Math.min(y, corner.y);
		}

		context.strokeText(markers[i].id, x, y);
	}
}


