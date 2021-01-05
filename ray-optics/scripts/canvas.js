function Canvas(){
	/*   ----------   This class contains the properties and methods of the background-canvas and the event-canvas   ----------   */

	/*   -----------   Creating the canvases and contexts   ----------   */

	this.container = document.getElementById("canvas-container");
	this.background_canvas = document.getElementById("background-canvas");
	this.event_canvas = document.getElementById("event-canvas");
	this.background_context = this.background_canvas.getContext("2d");
	this.event_context = this.event_canvas.getContext("2d");

	this.setWidth = function(width) {
		this.width = width;
		this.event_canvas.width = width;
		this.background_canvas.width = width;
	}
	this.setHeight = function(height) {
		this.height = height;
		this.event_canvas.height = height;
		this.background_canvas.height = height;
	}
	this.setWidth(this.container.clientWidth);
	this.setHeight(this.container.clientHeight);

	/*   ----------  Event state properties and default conditions   -----------   */

	this.objectDragging = false;
	this.leftFocalPointDragging = false;
	this.rightFocalPointDragging = false;
	this.grid_size = this.width / 12 // 12 boxes along the width of the canvas
	this.grid_scale = this.grid_size / 100;
	this.surfaceType = "convex-lens"; // default state
	this.focalLength = 200;
	this.object = {
		x: -400,
		y: -100,
	};
	this.image = {
		that: this,
		virtual: false,
		x: function() {
			const x = 1 / ((1 / this.that.focalLength) - (1 / (-this.that.object.x)));
			switch (this.that.surfaceType) {
				case "convex-lens":
				case "concave-lens":
					return x;
				case "plane-mirror":
					return -this.that.object.x;
				case "concave-mirror":
				case "convex-mirror":
					return -x;
			}
		},
		y: function() {
			const y = (this.x() * (-this.that.object.y)) / (-this.that.object.x);
			switch (this.that.surfaceType) {
				case "convex-lens":
				case "concave-lens":
					return y;
				case "plane-mirror":
					return this.that.object.y;
				case "concave-mirror":
				case "convex-mirror":
					return -y;
			}
		}
	};

	/*   ----------   References for the labels and functions to calculate values for the labels   -----------   */

	this.parameterLabels = {
		f: document.getElementById("focal-length"),
		u: document.getElementById("object-distance"),
		v: document.getElementById("image-distance"),
		h: document.getElementById("object-size"),
		g: document.getElementById("image-size"),
		m: document.getElementById("linear-magnification"),
		type: document.getElementById("image-type")
	};

	this.parameters = {
		that: this,
		f: function(){return Math.round(this.that.focalLength)},
		u: function(){return Math.round(-this.that.object.x)},
		v: function(){return Math.round(this.that.image.x())},
		h: function(){return Math.round(-this.that.object.y)},
		g: function(){return Math.round(-this.that.image.y())},
		m: function(){return (this.that.image.y() / this.that.object.y).toPrecision(3)},
		type: function() {
			if (Math.abs(this.m()) === Infinity || isNaN(Math.abs(this.m()))) {
				return "No image";
			} else {
				return this.that.image.virtual ? "Virtual" : "Real";
			}
		}
	};

	/*   ----------   Drawing and updating methods   ----------   */

	this.drawBackground = function(){
		// handles drawing of the grid and lens
		let currentX, currentY;

		this.background_context.save();
		this.background_context.clearRect(0, 0, this.width, this.height);

		this.background_context.font = "1.2vw monospace"; // help text
		this.background_context.fillText("Drag the object or focal points to interact", 6 / window.devicePixelRatio, 16 / window.devicePixelRatio);
		this.background_context.fillText("with the simulation", 6 / window.devicePixelRatio, 36 / window.devicePixelRatio);

		this.background_context.translate(this.width / 2, this.height / 2);

		this.background_context.beginPath(); // grid
		this.background_context.strokeStyle = "rgb(150, 150, 150, 0.5)";
		this.background_context.lineWidth = 1;
		currentX = 0;
		while (currentX > -this.width / 2){
			this.background_context.moveTo(currentX, this.height / 2);
			this.background_context.lineTo(currentX, -this.height / 2);
			currentX -= this.grid_size;
		}
		currentX = 0;
		while (currentX < this.width / 2){
			this.background_context.moveTo(currentX, this.height / 2);
			this.background_context.lineTo(currentX, -this.height / 2);
			currentX += this.grid_size;
		}
		currentY = 0;
		while (currentY > -this.height / 2){
			this.background_context.moveTo(-this.width / 2, currentY);
			this.background_context.lineTo(this.width / 2, currentY);
			currentY -= this.grid_size;
		}
		currentY = 0;
		while (currentY < this.height / 2){
			this.background_context.moveTo(-this.width / 2, currentY);
			this.background_context.lineTo(this.width / 2, currentY);
			currentY += this.grid_size;
		}
		this.background_context.stroke();

		this.background_context.beginPath(); // optical axis
		this.background_context.strokeStyle = "rgba(0, 0, 0, 1)";
		this.background_context.moveTo(-(this.width / 2), 0);
		this.background_context.lineTo((this.width / 2), 0);
		this.background_context.stroke();

		this.background_context.beginPath(); // lens
		this.background_context.lineWidth = 2;
		this.background_context.lineJoin = "round";
		this.background_context.lineCap = "round";
		switch (this.surfaceType) {
			case "convex-lens":
				this.background_context.moveTo(0, (this.height / 2) - 20);
				this.background_context.lineTo(-20, (this.height / 2) - 40); // bottom arrow
				this.background_context.moveTo(0, (this.height / 2) - 20);
				this.background_context.lineTo(20, (this.height / 2) - 40);
				this.background_context.moveTo(0, (this.height / 2) - 20);
				this.background_context.lineTo(0, -(this.height / 2) + 20); // central line
				this.background_context.lineTo(-20, -(this.height / 2) + 40); // top arrow
				this.background_context.moveTo(0, -(this.height / 2) + 20);
				this.background_context.lineTo(20, -(this.height / 2) + 40);
				this.background_context.stroke();
				break;
			case "concave-lens":
				this.background_context.moveTo(0, (this.height / 2) - 30);
				this.background_context.lineTo(-20, (this.height / 2) - 10); // bottom arrow
				this.background_context.moveTo(0, (this.height / 2) - 30);
				this.background_context.lineTo(20, (this.height / 2) - 10);
				this.background_context.moveTo(0, (this.height / 2) - 30);
				this.background_context.lineTo(0, -(this.height / 2) + 30); // central line
				this.background_context.lineTo(-20, -(this.height / 2) + 10); // top arrow
				this.background_context.moveTo(0, -(this.height / 2) + 30);
				this.background_context.lineTo(20, -(this.height / 2) + 10);
				this.background_context.stroke();
				break;
			case "concave-mirror":
				this.background_context.arc(-20, (this.height / 2) - 30, 20, 0, Math.PI/2);
				this.background_context.moveTo(0, (this.height / 2) - 30);
				this.background_context.lineTo(0, -(this.height / 2) + 30);
				this.background_context.arc(-20, -(this.height / 2) + 30, 20, 0, 3*Math.PI/2, true);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.height / 2) + 35;
				while (currentY < (this.height / 2) - 30){
					this.background_context.moveTo(0, currentY);
					this.background_context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.background_context.stroke();
				break;
			case "convex-mirror":
				this.background_context.arc(20, (this.height / 2) - 30, 20, Math.PI, Math.PI/2, true);
				this.background_context.moveTo(0, (this.height / 2) - 30);
				this.background_context.lineTo(0, -(this.height / 2) + 30);
				this.background_context.arc(20, -(this.height / 2) + 30, 20, Math.PI, 3*Math.PI/2);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.height / 2) + 45;
				while (currentY < (this.height / 2) - 20){
					this.background_context.moveTo(0, currentY);
					this.background_context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.background_context.stroke();
				break;
			case "plane-mirror":
				this.background_context.moveTo(0, (this.height / 2) - 20);
				this.background_context.lineTo(0, -(this.height / 2) + 20);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.height / 2) + 30;
				while (currentY < (this.height / 2) - 20){
					this.background_context.moveTo(0, currentY);
					this.background_context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.background_context.stroke();
				break;
		}

		this.background_context.restore();
	};

	this.drawRays = function(){
		this.event_context.save();
		this.event_context.clearRect(0, 0, this.width, this.height);
		this.event_context.translate(this.width / 2, this.height / 2);

		this.event_context.lineWidth = 1;
		const objX = this.object.x * this.grid_scale,
			objY = this.object.y * this.grid_scale,
			imgX = this.image.x() * this.grid_scale,
			imgY = this.image.y() * this.grid_scale,
			focalLength = this.focalLength * this.grid_scale;
		switch (this.surfaceType) {
			case "convex-lens":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, objY);
				this.event_context.lineTo(this.width / 2, -((this.width / 2) - focalLength) * (objY / focalLength));
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(this.width / 2, (this.width / 2) * (objY / objX));
				this.event_context.stroke();

				if (Math.abs(imgY) < (this.height / 2) - 25) { // bottom principle ray
					this.event_context.beginPath();
					this.event_context.moveTo(this.width / 2, imgY);
					this.event_context.lineTo(0, imgY);
					this.event_context.lineTo(objX, objY);
					this.event_context.stroke();
				}

				if (Math.abs(objX) < focalLength){
					this.event_context.setLineDash([8, 4]);

					if (Math.abs(imgY) < (this.height / 2) - 25) { // top virtual ray
						this.event_context.beginPath();
						this.event_context.moveTo(0, imgY);
						this.event_context.lineTo(-this.width / 2, imgY);
						this.event_context.stroke();
					}

					this.event_context.beginPath(); // centre virtual ray
					this.event_context.moveTo(0, objY);
					this.event_context.lineTo(-this.width / 2, (this.width / 2) * (objY / focalLength) + objY);
					this.event_context.stroke();

					this.event_context.beginPath(); // bottom virtual ray
					this.event_context.moveTo(objX, objY);
					this.event_context.lineTo(-this.width / 2, ((-(this.width / 2) + objX) * (objY / objX)) - objY);
					this.event_context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "concave-lens":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, objY);
				this.event_context.lineTo(this.width / 2, ((-this.width / 2) * (objY / focalLength)) + objY);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, imgY);
				this.event_context.lineTo(this.width / 2, imgY);
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(this.width / 2, (this.width / 2) * (objY / objX));
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(focalLength, 0);
				this.event_context.lineTo(0, objY);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre virtual ray
				this.event_context.moveTo(imgX, imgY);
				this.event_context.lineTo(0, imgY);
				this.event_context.stroke();

				this.image.virtual = true;
				break;
			case "concave-mirror":
				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, objY);
				this.event_context.lineTo(-this.width / 2, -(this.width / 2) * (objY / focalLength) + objY);
				this.event_context.stroke();

				if (Math.abs(imgY) < (this.height / 2) - 25) { // bottom principle ray
					this.event_context.beginPath();
					this.event_context.moveTo(objX, objY);
					this.event_context.lineTo(0, imgY);
					this.event_context.lineTo(-this.width / 2, imgY);
					this.event_context.stroke();
				}

				if (Math.abs(2 * focalLength * (objY / (objX + 2 * focalLength))) < (this.height / 2) - 25) {
					this.event_context.beginPath(); // top principle ray
					this.event_context.moveTo(-2 * focalLength, 0);
					this.event_context.lineTo(0, 2 * focalLength * (objY / (objX + 2 * focalLength)));
					this.event_context.moveTo(-2 * focalLength, 0);
					this.event_context.lineTo(-(this.width / 2), -((this.width / 2) - 2 * focalLength) * (objY / (objX + 2 * focalLength)));
					this.event_context.stroke();
				}

				if (Math.abs(objX) < focalLength){
					this.event_context.setLineDash([8, 4]);

					if (Math.abs(imgY) < (this.height / 2) - 25) { // top virtual ray
						this.event_context.beginPath();
						this.event_context.moveTo(imgX, imgY);
						this.event_context.lineTo(0, imgY);
						this.event_context.stroke();
					}

					if (Math.abs(2 * focalLength * (objY / (objX + 2 * focalLength))) < (this.height / 2) - 25) {
						this.event_context.beginPath(); // centre virtual ray
						if (Math.abs(imgX) === Infinity){
							this.event_context.moveTo(0, 2*objY);
							this.event_context.lineTo(this.width / 2, (this.width / 2) * (objY / focalLength) + 2*objY);
						} else {
							this.event_context.moveTo(imgX, imgY);
							this.event_context.lineTo(0, 2 * focalLength * (objY / (objX + 2 * focalLength)));
						}
						this.event_context.stroke();
					}

					this.event_context.beginPath(); // bottom virtual ray
					if (Math.abs(imgX) === Infinity){
						this.event_context.moveTo(0, objY);
						this.event_context.lineTo(this.width / 2, (this.width / 2) * (objY / focalLength) + objY);
					} else {
						this.event_context.moveTo(imgX, imgY);
						this.event_context.lineTo(0, objY);
					}
					this.event_context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "convex-mirror":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, objY);
				this.event_context.lineTo(-this.width / 2, ((-this.width / 2) * (objY / focalLength)) + objY);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, imgY);
				this.event_context.lineTo(-this.width / 2, imgY);
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, 0);
				this.event_context.lineTo(-this.width / 2, (this.width / 2) * (objY / objX));
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(-focalLength, 0);
				this.event_context.lineTo(0, objY);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre virtual ray
				this.event_context.moveTo(imgX, imgY);
				this.event_context.lineTo(0, imgY);
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom virtual ray
				this.event_context.moveTo(imgX, imgY);
				this.event_context.lineTo(0, 0);
				this.event_context.stroke();

				this.image.virtual = true;
				break;
			case "plane-mirror":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(objX, objY);
				this.event_context.lineTo(0, 0);
				this.event_context.lineTo(-this.width / 2, (this.width / 2) * (objY / objX));
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(objX, 0);
				this.event_context.lineTo(0, -objY);
				this.event_context.lineTo(-this.width / 2, (this.width / 2) * (objY / objX) - objY);
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(0, 0);
				this.event_context.lineTo(this.width / 2, -(this.width / 2) * (objY / objX));
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom virtual ray
				this.event_context.moveTo(0, -objY);
				this.event_context.lineTo(this.width / 2, -(this.width / 2) * (objY / objX) - objY);
				this.event_context.stroke();

				this.image.virtual = true;
				break;
		}

		this.event_context.fillStyle = "rgba(0, 0, 0, 1)";
		this.event_context.textAlign = "center";
		this.event_context.font = "11px monospace";

		this.event_context.beginPath(); // focal points
		this.event_context.arc(-focalLength, 0, 5, 0, 2*Math.PI);
		this.event_context.arc(focalLength, 0, 5, 0, 2*Math.PI);
		this.event_context.fill();
		this.event_context.fillText("Focal Point", -focalLength, -10);
		this.event_context.fillText("Focal Point", focalLength, -10);

		if (this.surfaceType === "concave-mirror" || this.surfaceType === "convex-mirror"){
			this.event_context.beginPath(); // center of curvature
			this.event_context.arc(-2*focalLength, 0, 5, 0, 2*Math.PI);
			this.event_context.fill();
			this.event_context.fillText("Centre of Curvature", -2*focalLength, -10);
		}

		this.event_context.beginPath(); // object
		this.event_context.lineWidth = 1.75;
		this.event_context.fillText("Object", objX, objY - 10);
		this.event_context.setLineDash([0, 0]);
		this.event_context.moveTo(objX, objY);
		this.event_context.lineTo(objX, 0);
		this.event_context.stroke();
		this.event_context.beginPath();
		this.event_context.arc(objX, objY, 5, 0, 2*Math.PI);
		this.event_context.fill();

		this.event_context.beginPath(); // image
		this.event_context.fillText("Image", imgX, imgY - 10);
		if (this.image.virtual){
			this.event_context.setLineDash([8, 4]);
			this.event_context.fillStyle = "rgba(255, 255, 255, 1)";
		}
		this.event_context.moveTo(imgX, imgY);
		this.event_context.lineTo(imgX, 0);
		this.event_context.stroke();
		this.event_context.beginPath();
		this.event_context.arc(imgX, imgY, 5, 0, 2*Math.PI);
		this.event_context.fill();
		this.event_context.setLineDash([0, 0]);
		this.event_context.lineWidth = 1;
		this.event_context.stroke();

		this.event_context.restore();
	};

	this.updateLabels = function(){
		this.parameterLabels.f.innerHTML = ("Focal length: " + this.parameters.f()).replace(/Infinity/, "&infin;");
		this.parameterLabels.u.innerHTML = "Object distance: " + this.parameters.u();
		this.parameterLabels.v.innerHTML = ("Image distance: " + this.parameters.v()).replace(/Infinity/, "&infin;");
		this.parameterLabels.h.innerHTML = "Object size: " + this.parameters.h();
		this.parameterLabels.g.innerHTML = ("Image size: " + this.parameters.g()).replace(/Infinity/, "&infin;");
		this.parameterLabels.m.innerHTML = ("Linear magnification: " + this.parameters.m()).replace(/Infinity/, "&infin;");
		this.parameterLabels.type.innerHTML = "Image type: " + this.parameters.type().replace(/Infinity/, "&infin;");
	};

	this.eventUpdate = function(){
		this.drawRays();
		this.updateLabels();
	}
}
