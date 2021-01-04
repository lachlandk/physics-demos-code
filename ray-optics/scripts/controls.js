function mouseDown(event){
	// this function handles the mouseDown event in its entirety
	const boundingRect = canvas.event_canvas.getBoundingClientRect(),
		mouseX = (event.clientX - boundingRect.left) * (canvas.event_canvas.width / boundingRect.width) - (canvas.event_canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.event_canvas.height / boundingRect.height) - (canvas.event_canvas.height / 2),
		objectX = canvas.object.x,
		objectY = canvas.object.y,
		leftFocalPoint = canvas.focalLength > 0 ? -canvas.focalLength : canvas.focalLength,
		rightFocalPoint = -leftFocalPoint;

	function hitDetect(pointX, pointY, type){
		// if the clicked point is in range of point of interest, set corresponding dragging property to true
		if (function(){
			const dx = mouseX - pointX,
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

	// check which object was clicked
	hitDetect(objectX, objectY, "object");
	hitDetect(leftFocalPoint, 0, "leftFocalPoint");
	hitDetect(rightFocalPoint, 0, "rightFocalPoint");

	canvas.event_canvas.removeEventListener("mousedown", mouseDown);
	window.addEventListener("mouseup", mouseUp);
}

// TODO: add pointer mouse when mouse over object
// TODO: touch functionality, make handles bigger for ease of use on touch devices

function mouseDrag(event){
	// this function runs when the mouse is moved while holding down LMB
	const boundingRect = canvas.event_canvas.getBoundingClientRect(),
		mouseX = (event.clientX - boundingRect.left) * (canvas.event_canvas.width / boundingRect.width) - (canvas.event_canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.event_canvas.height / boundingRect.height) - (canvas.event_canvas.height / 2);
	let newX = mouseX - heldX,
		newY = mouseY - heldY;
	const gridX = Math.round(newX / 100) * 100,
		gridY = Math.round(newY / 100) * 100;

	if (canvas.objectDragging){
		const minX = -(canvas.event_canvas.width / 2) + 5,
			maxX = 0,
			maxY = -(canvas.event_canvas.height / 2) + 25,
			minY = (canvas.event_canvas.height / 2) - 25;

		if ((newX % 100 > -10 || newX % 100 < -90) && (Math.abs(newY) % 100 < 10 || Math.abs(newY) % 100 > 90)){
			newX = gridX;
			newY = gridY;
		}
		newX = (newX < minX) ? minX : ((newX > maxX) ? maxX : newX); // if newX < minX, {minX} else {if newX > maxX, {maxX} else {new X}}
		newY = (newY > minY) ? minY : ((newY < maxY) ? maxY : newY);
		canvas.object.x = newX;
		canvas.object.y = newY;
		canvas.eventUpdate();
	}

	function setFocalPoint(point){
		// update the focal length slider when the point is moved
		if (canvas.surfaceType === "convex-lens" || canvas.surfaceType === "concave-mirror"){
			document.getElementById("focal-length-control").value = -Math.round(point);
		}
		if (canvas.surfaceType === "concave-lens" || canvas.surfaceType === "convex-mirror"){
			document.getElementById("focal-length-control").value = Math.round(point);
		}
		updateFocalLength();
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
	// cancel the mousemove event when no longer holding LMB
	canvas.event_canvas.addEventListener("mousedown", mouseDown);
	window.removeEventListener("mouseup", mouseUp);
	canvas.objectDragging = false;
	canvas.leftFocalPointDragging = false;
	canvas.rightFocalPointDragging = false;
	window.removeEventListener("mousemove", mouseDrag);
}

function updateSurfaceType(){
	canvas.surfaceType = document.getElementById("surface-type-control").value;
	canvas.drawBackground();
	const focalLengthControl = document.getElementById("focal-length-control");
	switch (canvas.surfaceType) { // default parameters
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
	updateFocalLength();
}

function updateFocalLength(){
	const newFocalLength = (canvas.surfaceType !== "plane-mirror") ? document.getElementById("focal-length-control").value : Infinity;
	canvas.focalLength = newFocalLength;
	document.getElementById("focal-length-label").innerHTML = ("Focal Length: " + ((newFocalLength.length > 2) ? newFocalLength : newFocalLength + "&nbsp")).replace(/Infinity/, "&infin;");
	canvas.eventUpdate();
}

const canvas_container = document.getElementById("canvas-container")
const canvas = new Canvas(canvas_container)
let heldX,
	heldY;
canvas.event_canvas.addEventListener("mousedown", mouseDown);
window.addEventListener("resize", function(){ // TODO move to canvas.js and fix zoom issue
	const width = canvas_container.offsetWidth,
		height = canvas_container.offsetHeight,
		pixel_ratio = window.devicePixelRatio;
	canvas.event_canvas.width = width * pixel_ratio;
	canvas.event_canvas.height = height * pixel_ratio;
	canvas.event_context.scale(pixel_ratio, pixel_ratio);
	canvas.background_canvas.width = width * pixel_ratio;
	canvas.background_canvas.height = height * pixel_ratio;
	canvas.background_context.scale(pixel_ratio, pixel_ratio);
	canvas.drawBackground();
	canvas.drawRays();
});
updateSurfaceType();

document.getElementById("surface-type-control").addEventListener("input", updateSurfaceType);
document.getElementById("focal-length-control").addEventListener("input", updateFocalLength);
