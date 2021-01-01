function mouseDown(event){
	let boundingRect = canvas.canvas.getBoundingClientRect(),
		mouseX = (event.clientX - boundingRect.left) * (canvas.canvas.width / boundingRect.width) - (canvas.canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.canvas.height / boundingRect.height) - (canvas.canvas.height / 2),
		objectX = canvas.object.x,
		objectY = canvas.object.y,
		leftFocalPoint = canvas.focalLength > 0 ? -canvas.focalLength : canvas.focalLength,
		rightFocalPoint = -leftFocalPoint;

	function hitDetect(pointX, pointY, type){
		if (function(){
			let dx = mouseX - pointX,
				dy = mouseY - pointY;
			return ((dx**2 + dy**2) <= 100);
		}()){
			heldX = mouseX - pointX;
			heldY = mouseY - pointY;
			switch (type) {
				case "object":
					canvas.objectDragging = true;
					break;
				case "leftFocalPoint":
					canvas.leftFocalPointDragging = true;
					break;
				case "rightFocalPoint":
					canvas.rightFocalPointDragging = true;
					break;
			}
			window.addEventListener("mousemove", mouseDrag);
		}
	}

	hitDetect(objectX, objectY, "object");
	hitDetect(leftFocalPoint, 0, "leftFocalPoint");
	hitDetect(rightFocalPoint, 0, "rightFocalPoint");

	canvas.canvas.removeEventListener("mousedown", mouseDown);
	window.addEventListener("mouseup", mouseUp);
	if(event.preventDefault){
		event.preventDefault();
	}
}

// TODO: add pointer mouse when mouse over object
// TODO: touch functionality, make handles bigger for ease of use on touch devices
// TODO: add possibility to change image type from close to far away

function mouseDrag(event){
	let boundingRect = canvas.canvas.getBoundingClientRect(),
		mouseX = (event.clientX - boundingRect.left) * (canvas.canvas.width / boundingRect.width) - (canvas.canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.canvas.height / boundingRect.height) - (canvas.canvas.height / 2),
		newX = mouseX - heldX,
		newY = mouseY - heldY,
		gridX = Math.round(newX / 100) * 100,
		gridY = Math.round(newY / 100) * 100;

	if (canvas.objectDragging){
		let minX = -(canvas.canvas.width / 2) + 5,
			maxX = 0,
			maxY = -(canvas.canvas.height / 2) + 25,
			minY = (canvas.canvas.height / 2) - 25;

		if ((newX % 100 > -10 || newX % 100 < -90) && (Math.abs(newY) % 100 < 10 || Math.abs(newY) % 100 > 90)){
			newX = gridX;
			newY = gridY;
		}
		newX = (newX < minX) ? minX : ((newX > maxX) ? maxX : newX); // if newX < minX, {minX} else {if newX > maxX, {maxX} else {new X}}
		newY = (newY > minY) ? minY : ((newY < maxY) ? maxY : newY);
		canvas.object.x = newX;
		canvas.object.y = newY;
		canvas.update();
	}

	function setFocalPoint(point){
		if (canvas.surfaceType === "convex-lens" || canvas.surfaceType === "concave-mirror"){
			document.getElementById("focal-length-control").value = -Math.round(point);
		}
		if (canvas.surfaceType === "concave-lens" || canvas.surfaceType === "convex-mirror"){
			document.getElementById("focal-length-control").value = Math.round(point);
		}
		update();
	}

	if (canvas.leftFocalPointDragging){
		if (newX % 100 > -10 || newX % 100 < -90){
			newX = gridX;
		}
		setFocalPoint(newX);
	}

	if (canvas.rightFocalPointDragging){
		if (newX % 100 < 10 || newX % 100 > 90){
			newX = gridX;
		}
		setFocalPoint(-newX);
	}
}

function mouseUp(){
	canvas.canvas.addEventListener("mousedown", mouseDown);
	window.removeEventListener("mouseup", mouseUp);
	canvas.objectDragging = false;
	canvas.leftFocalPointDragging = false;
	canvas.rightFocalPointDragging = false;
	window.removeEventListener("mousemove", mouseDrag);
}

function updateSurfaceType(){
	canvas.surfaceType = document.getElementById("surface-type-control").value;
	let focalLengthControl = document.getElementById("focal-length-control");
	switch (canvas.surfaceType) {
		case "convex-lens":
			focalLengthControl.disabled = false;
			focalLengthControl.min = 50;
			focalLengthControl.max = 300;
			focalLengthControl.value = 200;
			break;
		case "concave-lens":
			focalLengthControl.disabled = false;
			focalLengthControl.min = -300;
			focalLengthControl.max = -50;
			focalLengthControl.value = -200;
			break;
		case "concave-mirror":
			focalLengthControl.disabled = false;
			focalLengthControl.min = 50;
			focalLengthControl.max = 300;
			focalLengthControl.value = 200;
			break;
		case "convex-mirror":
			focalLengthControl.disabled = false;
			focalLengthControl.min = -300;
			focalLengthControl.max = -50;
			focalLengthControl.value = -200;
			break;
		case "plane-mirror":
			focalLengthControl.disabled = true;
			break;
	}
	update();
}

function update(){
	let newFocalLength = (canvas.surfaceType !== "plane-mirror") ? document.getElementById("focal-length-control").value : Infinity;
	canvas.focalLength = newFocalLength;
	document.getElementById("focal-length-label").innerHTML = "Focal Length: " + ((newFocalLength.length > 2) ? newFocalLength : newFocalLength + "&nbsp");
	canvas.update();
}

let canvas = new Canvas(),
	heldX,
	heldY;
canvas.canvas.addEventListener("mousedown", mouseDown);
window.addEventListener("resize", function(){
	canvas.canvas.width = canvas.canvas.parentElement.offsetWidth * window.devicePixelRatio;
	canvas.canvas.height = canvas.canvas.parentElement.offsetHeight * window.devicePixelRatio;
	canvas.context.scale(window.devicePixelRatio, window.devicePixelRatio);
	canvas.update();
});
updateSurfaceType();
