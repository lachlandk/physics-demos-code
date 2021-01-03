function Canvas(container){
	/*   -----------   This class contains the properties and methods of the background-canvas and the event-canvas   ----------   */

	/*   -----------   Creating the canvases and contexts   ----------   */

	let width = container.offsetWidth,
		height = container.offsetHeight,
		pixel_ratio = window.devicePixelRatio;
	this.background_canvas = document.getElementById("background-canvas");
	this.event_canvas = document.getElementById("event-canvas");
	this.event_canvas.height = height * pixel_ratio;
	this.event_canvas.width = width * pixel_ratio;
	this.background_canvas.height = height * pixel_ratio;
	this.background_canvas.width = width * pixel_ratio;
	this.background_context = this.background_canvas.getContext("2d");
	this.event_context = this.event_canvas.getContext("2d");
	this.background_context.scale(pixel_ratio, pixel_ratio);
	this.event_context.scale(pixel_ratio, pixel_ratio);

	/*   ----------  Event state properties and default conditions   -----------   */

	this.objectDragging = false;
	this.leftFocalPointDragging = false;
	this.rightFocalPointDragging = false;
	this.surfaceType = "convex-lens"; // default state
	this.focalLength = 200;
	this.object = {
		x: -400,
		y: -100,
	};
	this.image = {
		that: this,
		virtual: false,
		x: function(){
			let x = 1 / ((1 / this.that.focalLength) - (1 / (-this.that.object.x)));
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
		y: function(){
			let y = (this.x() * (-this.that.object.y)) / (-this.that.object.x);
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
		u: document.getElementById("object-distance"),
		v: document.getElementById("image-distance"),
		h: document.getElementById("object-size"),
		g: document.getElementById("image-size"),
		m: document.getElementById("linear-magnification"),
		type: document.getElementById("image-type")
	};

	this.parameters = {
		that: this,
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
		this.background_context.clearRect(0, 0, this.background_canvas.width, this.background_canvas.height);
		this.background_context.translate(this.background_canvas.width / 2, this.background_canvas.height / 2);

		this.background_context.beginPath(); // grid
		this.background_context.strokeStyle = "rgb(150, 150, 150, 0.5)";
		this.background_context.lineWidth = 1;
		currentX = 0;
		while (currentX > -this.background_canvas.width / 2){
			this.background_context.moveTo(currentX, this.background_canvas.height / 2);
			this.background_context.lineTo(currentX, -this.background_canvas.height / 2);
			currentX -= 100;
		}
		currentX = 0;
		while (currentX < this.background_canvas.width / 2){
			this.background_context.moveTo(currentX, this.background_canvas.height / 2);
			this.background_context.lineTo(currentX, -this.background_canvas.height / 2);
			currentX += 100;
		}
		currentY = 0;
		while (currentY > -this.background_canvas.height / 2){
			this.background_context.moveTo(-this.background_canvas.width / 2, currentY);
			this.background_context.lineTo(this.background_canvas.width / 2, currentY);
			currentY -= 100;
		}
		currentY = 0;
		while (currentY < this.background_canvas.height / 2){
			this.background_context.moveTo(-this.background_canvas.width / 2, currentY);
			this.background_context.lineTo(this.background_canvas.width / 2, currentY);
			currentY += 100;
		}
		this.background_context.stroke();

		this.background_context.beginPath(); // optical axis
		this.background_context.strokeStyle = "rgba(0, 0, 0, 1)";
		this.background_context.moveTo(-(this.background_canvas.width / 2), 0);
		this.background_context.lineTo((this.background_canvas.width / 2), 0);
		this.background_context.stroke();

		this.background_context.beginPath(); // lens
		this.background_context.lineWidth = 2;
		this.background_context.lineJoin = "round";
		this.background_context.lineCap = "round";
		switch (this.surfaceType) {
			case "convex-lens":
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 20);
				this.background_context.lineTo(-20, (this.background_canvas.height / 2) - 40); // bottom arrow
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 20);
				this.background_context.lineTo(20, (this.background_canvas.height / 2) - 40);
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 20);
				this.background_context.lineTo(0, -(this.background_canvas.height / 2) + 20); // central line
				this.background_context.lineTo(-20, -(this.background_canvas.height / 2) + 40); // top arrow
				this.background_context.moveTo(0, -(this.background_canvas.height / 2) + 20);
				this.background_context.lineTo(20, -(this.background_canvas.height / 2) + 40);
				this.background_context.stroke();
				break;
			case "concave-lens":
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 30);
				this.background_context.lineTo(-20, (this.background_canvas.height / 2) - 10); // bottom arrow
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 30);
				this.background_context.lineTo(20, (this.background_canvas.height / 2) - 10);
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 30);
				this.background_context.lineTo(0, -(this.background_canvas.height / 2) + 30); // central line
				this.background_context.lineTo(-20, -(this.background_canvas.height / 2) + 10); // top arrow
				this.background_context.moveTo(0, -(this.background_canvas.height / 2) + 30);
				this.background_context.lineTo(20, -(this.background_canvas.height / 2) + 10);
				this.background_context.stroke();
				break;
			case "concave-mirror":
				this.background_context.arc(-20, (this.background_canvas.height / 2) - 30, 20, 0, Math.PI/2);
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 30);
				this.background_context.lineTo(0, -(this.background_canvas.height / 2) + 30);
				this.background_context.arc(-20, -(this.background_canvas.height / 2) + 30, 20, 0, 3*Math.PI/2, true);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.background_canvas.height / 2) + 35;
				while (currentY < (this.background_canvas.height / 2) - 30){
					this.background_context.moveTo(0, currentY);
					this.background_context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.background_context.stroke();
				break;
			case "convex-mirror":
				this.background_context.arc(20, (this.background_canvas.height / 2) - 30, 20, Math.PI, Math.PI/2, true);
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 30);
				this.background_context.lineTo(0, -(this.background_canvas.height / 2) + 30);
				this.background_context.arc(20, -(this.background_canvas.height / 2) + 30, 20, Math.PI, 3*Math.PI/2);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.background_canvas.height / 2) + 45;
				while (currentY < (this.background_canvas.height / 2) - 20){
					this.background_context.moveTo(0, currentY);
					this.background_context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.background_context.stroke();
				break;
			case "plane-mirror":
				this.background_context.moveTo(0, (this.background_canvas.height / 2) - 20);
				this.background_context.lineTo(0, -(this.background_canvas.height / 2) + 20);
				this.background_context.stroke();
				this.background_context.beginPath();
				this.background_context.lineWidth = 1;
				currentY = -(this.background_canvas.height / 2) + 30;
				while (currentY < (this.background_canvas.height / 2) - 20){
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
		this.event_context.clearRect(0, 0, this.event_canvas.width, this.event_canvas.height);
		this.event_context.translate(this.event_canvas.width / 2, this.event_canvas.height / 2);

		this.event_context.lineWidth = 1;
		switch (this.surfaceType) {
			case "convex-lens":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.lineTo(this.event_canvas.width / 2, -((this.event_canvas.width / 2) - this.focalLength) * (this.object.y / this.focalLength));
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.object.x));
				this.event_context.stroke();

				if (Math.abs(this.image.y()) < (this.event_canvas.height / 2) - 25) { // bottom principle ray
					this.event_context.beginPath();
					this.event_context.moveTo(this.event_canvas.width / 2, this.image.y());
					this.event_context.lineTo(0, this.image.y());
					this.event_context.lineTo(this.object.x, this.object.y);
					this.event_context.stroke();
				}

				if (Math.abs(this.object.x) <= this.focalLength){
					this.event_context.setLineDash([8, 4]);

					if (Math.abs(this.image.y()) < (this.event_canvas.height / 2) - 25) { // top virtual ray
						this.event_context.beginPath();
						this.event_context.moveTo(0, this.image.y());
						this.event_context.lineTo(-this.event_canvas.width / 2, this.image.y());
						this.event_context.stroke();
					}

					this.event_context.beginPath(); // centre virtual ray
					this.event_context.moveTo(0, this.object.y);
					this.event_context.lineTo(-this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
					this.event_context.stroke();

					this.event_context.beginPath(); // bottom virtual ray
					this.event_context.moveTo(this.object.x, this.object.y);
					this.event_context.lineTo(-this.event_canvas.width / 2, ((-(this.event_canvas.width / 2) + this.object.x) * (this.object.y / this.object.x)) - this.object.y);
					this.event_context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "concave-lens":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.lineTo(this.event_canvas.width / 2, ((-this.event_canvas.width / 2) * (this.object.y / this.focalLength)) + this.object.y);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.image.y());
				this.event_context.lineTo(this.event_canvas.width / 2, this.image.y());
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.object.x));
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(this.focalLength, 0);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre virtual ray
				this.event_context.moveTo(this.image.x(), this.image.y());
				this.event_context.lineTo(0, this.image.y());
				this.event_context.stroke();

				this.image.virtual = true;
				break;
			case "concave-mirror":
				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.lineTo(-this.event_canvas.width / 2, -(this.event_canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
				this.event_context.stroke();

				if (Math.abs(this.image.y()) < (this.event_canvas.height / 2) - 25) { // bottom principle ray
					this.event_context.beginPath();
					this.event_context.moveTo(this.object.x, this.object.y);
					this.event_context.lineTo(0, this.image.y());
					this.event_context.lineTo(-this.event_canvas.width / 2, this.image.y());
					this.event_context.stroke();
				}

				if (Math.abs(2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength))) < (this.event_canvas.height / 2) - 25) {
					this.event_context.beginPath(); // top principle ray
					this.event_context.moveTo(-2 * this.focalLength, 0);
					this.event_context.lineTo(0, 2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength)));
					this.event_context.moveTo(-2 * this.focalLength, 0);
					this.event_context.lineTo(-(this.event_canvas.width / 2), -((this.event_canvas.width / 2) - 2 * this.focalLength) * (this.object.y / (this.object.x + 2 * this.focalLength)));
					this.event_context.stroke();
				}

				if (Math.abs(this.object.x) <= this.focalLength){
					this.event_context.setLineDash([8, 4]);

					if (Math.abs(this.image.y()) < (this.event_canvas.height / 2) - 25) { // top virtual ray
						this.event_context.beginPath();
						this.event_context.moveTo(this.image.x(), this.image.y());
						this.event_context.lineTo(0, this.image.y());
						this.event_context.stroke();
					}

					if (Math.abs(2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength))) < (this.event_canvas.height / 2) - 25) {
						this.event_context.beginPath(); // centre virtual ray
						if (Math.abs(this.image.x()) === Infinity){
							this.event_context.moveTo(0, 2*this.object.y);
							this.event_context.lineTo(this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.focalLength) + 2*this.object.y);
						} else {
							this.event_context.moveTo(this.image.x(), this.image.y());
							this.event_context.lineTo(0, 2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength)));
						}
						this.event_context.stroke();
					}

					this.event_context.beginPath(); // bottom virtual ray
					if (Math.abs(this.image.x()) === Infinity){
						this.event_context.moveTo(0, this.object.y);
						this.event_context.lineTo(this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
					} else {
						this.event_context.moveTo(this.image.x(), this.image.y());
						this.event_context.lineTo(0, this.object.y);
					}
					this.event_context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "convex-mirror":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.lineTo(-this.event_canvas.width / 2, ((-this.event_canvas.width / 2) * (this.object.y / this.focalLength)) + this.object.y);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, this.image.y());
				this.event_context.lineTo(-this.event_canvas.width / 2, this.image.y());
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, 0);
				this.event_context.lineTo(-this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.object.x));
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(-this.focalLength, 0);
				this.event_context.lineTo(0, this.object.y);
				this.event_context.stroke();

				this.event_context.beginPath(); // centre virtual ray
				this.event_context.moveTo(this.image.x(), this.image.y());
				this.event_context.lineTo(0, this.image.y());
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom virtual ray
				this.event_context.moveTo(this.image.x(), this.image.y());
				this.event_context.lineTo(0, 0);
				this.event_context.stroke();

				this.image.virtual = true;
				break;
			case "plane-mirror":
				this.event_context.beginPath(); // top principle ray
				this.event_context.moveTo(this.object.x, this.object.y);
				this.event_context.lineTo(0, 0);
				this.event_context.lineTo(-this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.object.x));
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom principle ray
				this.event_context.moveTo(this.object.x, 0);
				this.event_context.lineTo(0, -this.object.y);
				this.event_context.lineTo(-this.event_canvas.width / 2, (this.event_canvas.width / 2) * (this.object.y / this.object.x) - this.object.y);
				this.event_context.stroke();

				this.event_context.setLineDash([8, 4]);

				this.event_context.beginPath(); // top virtual ray
				this.event_context.moveTo(0, 0);
				this.event_context.lineTo(this.event_canvas.width / 2, -(this.event_canvas.width / 2) * (this.object.y / this.object.x));
				this.event_context.stroke();

				this.event_context.beginPath(); // bottom virtual ray
				this.event_context.moveTo(0, -this.object.y);
				this.event_context.lineTo(this.event_canvas.width / 2, -(this.event_canvas.width / 2) * (this.object.y / this.object.x) - this.object.y);
				this.event_context.stroke();

				this.image.virtual = true;
				break;
		}

		this.event_context.fillStyle = "rgba(0, 0, 0, 1)";
		this.event_context.textAlign = "center";
		this.event_context.font = "11px monospace";

		this.event_context.beginPath(); // focal points
		this.event_context.arc(-this.focalLength, 0, 5, 0, 2*Math.PI);
		this.event_context.arc(this.focalLength, 0, 5, 0, 2*Math.PI);
		this.event_context.fill();
		this.event_context.fillText("Focal Point", -this.focalLength, -10);
		this.event_context.fillText("Focal Point", this.focalLength, -10);

		if (this.surfaceType === "concave-mirror" || this.surfaceType === "convex-mirror"){
			this.event_context.beginPath(); // center of curvature
			this.event_context.arc(-2*this.focalLength, 0, 5, 0, 2*Math.PI);
			this.event_context.fill();
			this.event_context.fillText("Centre of Curvature", -2*this.focalLength, -10);
		}

		this.event_context.beginPath(); // object
		this.event_context.lineWidth = 1.75;
		this.event_context.fillText("Object", this.object.x, this.object.y - 10);
		this.event_context.setLineDash([0, 0]);
		this.event_context.moveTo(this.object.x, this.object.y);
		this.event_context.lineTo(this.object.x, 0);
		this.event_context.stroke();
		this.event_context.beginPath();
		this.event_context.arc(this.object.x, this.object.y, 5, 0, 2*Math.PI);
		this.event_context.fill();

		this.event_context.beginPath(); // image
		this.event_context.fillText("Image", this.image.x(), this.image.y() - 10);
		if (this.image.virtual){
			this.event_context.setLineDash([8, 4]);
			this.event_context.fillStyle = "rgba(255, 255, 255, 1)";
		}
		this.event_context.moveTo(this.image.x(), this.image.y());
		this.event_context.lineTo(this.image.x(), 0);
		this.event_context.stroke();
		this.event_context.beginPath();
		this.event_context.arc(this.image.x(), this.image.y(), 5, 0, 2*Math.PI);
		this.event_context.fill();
		this.event_context.setLineDash([0, 0]);
		this.event_context.lineWidth = 1;
		this.event_context.stroke();

		this.event_context.restore();
	};

	this.updateLabels = function(){
		this.parameterLabels.u.innerHTML = "Object distance: " + this.parameters.u();
		this.parameterLabels.v.innerHTML = "Image distance: " + this.parameters.v();
		this.parameterLabels.h.innerHTML = "Object size: " + this.parameters.h();
		this.parameterLabels.g.innerHTML = "Image size: " + this.parameters.g();
		this.parameterLabels.m.innerHTML = "Linear magnification: " + this.parameters.m();
		this.parameterLabels.type.innerHTML = "Image type: " + this.parameters.type();
	};

	this.eventUpdate = function(){
		this.drawRays();
		this.updateLabels();
	}
}
