function mouseDown(event){
	// this function handles the mouseDown event in its entirety
	const boundingRect = canvas.event_canvas.getBoundingClientRect(),
		mouseX = (event.clientX - boundingRect.left) * (canvas.width / boundingRect.width) - (canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.height / boundingRect.height) - (canvas.height / 2),
		objectX = canvas.object.x * canvas.grid_scale,
		objectY = canvas.object.y * canvas.grid_scale,
		leftFocalPoint = (canvas.focalLength > 0 ? -canvas.focalLength : canvas.focalLength) * canvas.grid_scale,
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
		mouseX = (event.clientX - boundingRect.left) * (canvas.width / boundingRect.width) - (canvas.width / 2),
		mouseY = (event.clientY - boundingRect.top) * (canvas.height / boundingRect.height) - (canvas.height / 2);
	let newX = mouseX - heldX,
		newY = mouseY - heldY;
	const gridX = Math.round(newX / canvas.grid_size) * canvas.grid_size,
		gridY = Math.round(newY / canvas.grid_size) * canvas.grid_size;

	if (canvas.objectDragging){
		const minX = -(canvas.width / 2) + 5,
			maxX = 0,
			maxY = -(canvas.height / 2) + 25,
			minY = (canvas.height / 2) - 25;

		if ((newX % canvas.grid_size > -10 || newX % canvas.grid_size < -canvas.grid_size + 10) && (Math.abs(newY) % canvas.grid_size < 10 || Math.abs(newY) % canvas.grid_size > canvas.grid_size - 10)){
			newX = gridX;
			newY = gridY;
		}
		newX = (newX < minX) ? minX : ((newX > maxX) ? maxX : newX); // if newX < minX, {minX} else {if newX > maxX, {maxX} else {new X}}
		newY = (newY > minY) ? minY : ((newY < maxY) ? maxY : newY);
		canvas.object.x = Math.round(newX / canvas.grid_scale);
		canvas.object.y = Math.round(newY / canvas.grid_scale);
		canvas.eventUpdate();
	}

	if (canvas.leftFocalPointDragging){
		const minX = -(canvas.width / 2) + 5,
			maxX = 0;

		if (newX % canvas.grid_size > -10 || newX % canvas.grid_size < -canvas.grid_size + 10){
			newX = gridX;
		}
		newX = (newX < minX) ? minX : ((newX > maxX) ? maxX : newX);

		const newFocalLength = Math.round(newX / canvas.grid_scale);
		switch (canvas.surfaceType) {
			case "convex-lens":
			case "concave-mirror":
				canvas.focalLength = -newFocalLength;
				break;
			case "concave-lens":
			case "convex-mirror":
				canvas.focalLength = newFocalLength;
				break;
		}
		canvas.eventUpdate();
	}

	if (canvas.rightFocalPointDragging){
		const minX = 0,
			maxX = (canvas.width / 2) - 5;

		if (newX % canvas.grid_size < 10 || newX % canvas.grid_size > canvas.grid_size - 10){
			newX = gridX;
		}
		newX = (newX < minX) ? minX : ((newX > maxX) ? maxX : newX);

		const newFocalLength = Math.round(newX / canvas.grid_scale);
		switch (canvas.surfaceType) {
			case "convex-lens":
			case "concave-mirror":
				canvas.focalLength = newFocalLength;
				break;
			case "concave-lens":
			case "convex-mirror":
				canvas.focalLength = -newFocalLength;
				break;
		}
		canvas.eventUpdate();
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
	switch (canvas.surfaceType) {
		case "convex-lens":
		case "concave-mirror":
			if (!isFinite(canvas.focalLength)){
				canvas.focalLength = 200;
			} else if (canvas.focalLength < 0){
				canvas.focalLength *= -1;
			}
			break;
		case "concave-lens":
		case "convex-mirror":
			if (!isFinite(canvas.focalLength)){
				canvas.focalLength = -200;
			} else if (canvas.focalLength > 0){
				canvas.focalLength *= -1;
			}
			break;
		case "plane-mirror":
			canvas.focalLength = Infinity;
			break;
	}
	canvas.eventUpdate();
}

const canvas = new Canvas()
let heldX,
	heldY;
canvas.event_canvas.addEventListener("mousedown", mouseDown);
window.addEventListener("resize", function() {
	canvas.setWidth(canvas.container.clientWidth);
	canvas.setHeight(canvas.container.clientHeight);
	canvas.grid_size = canvas.width / 12;
	canvas.grid_scale = canvas.grid_size / 100;
	canvas.drawBackground();
	canvas.drawRays();
});
updateSurfaceType();

document.getElementById("surface-type-control").addEventListener("input", updateSurfaceType);
