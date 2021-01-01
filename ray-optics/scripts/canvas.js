function Canvas(){
	this.canvas = document.getElementById("canvas");
	this.canvas.height = this.canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.canvas.width = this.canvas.parentElement.offsetWidth * window.devicePixelRatio;
	this.canvas.style.border = "1px solid black";
	this.context = this.canvas.getContext("2d");
	this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.objectDragging = false;
	this.leftFocalPointDragging = false;
	this.rightFocalPointDragging = false;
	this.surfaceType = "convex-lens";
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

	this.drawLens = function(){
		let currentX, currentY; // for drawing purposes

		this.context.beginPath(); // optical axis
		this.context.strokeStyle = "rgba(0, 0, 0, 1)";
		this.context.lineWidth = 1;
		this.context.moveTo(-(this.canvas.width / 2), 0);
		this.context.lineTo((this.canvas.width / 2), 0);
		this.context.stroke();

		this.context.beginPath(); // grid
		this.context.strokeStyle = "rgb(150, 150, 150, 0.5)";
		currentX = 0;
		while (currentX > -this.canvas.width / 2){
			this.context.moveTo(currentX, this.canvas.height / 2);
			this.context.lineTo(currentX, -this.canvas.height / 2);
			currentX -= 100;
		}
		currentX = 0;
		while (currentX < this.canvas.width / 2){
			this.context.moveTo(currentX, this.canvas.height / 2);
			this.context.lineTo(currentX, -this.canvas.height / 2);
			currentX += 100;
		}
		currentY = 0;
		while (currentY > -this.canvas.height / 2){
			this.context.moveTo(-this.canvas.width / 2, currentY);
			this.context.lineTo(this.canvas.width / 2, currentY);
			currentY -= 100;
		}
		currentY = 0;
		while (currentY < this.canvas.height / 2){
			this.context.moveTo(-this.canvas.width / 2, currentY);
			this.context.lineTo(this.canvas.width / 2, currentY);
			currentY += 100;
		}
		this.context.stroke();

		this.context.beginPath(); // focal points
		this.context.fillStyle = "rgba(0, 0, 0, 1)";
		this.context.arc(-this.focalLength, 0, 5, 0, 2*Math.PI);
		this.context.arc(this.focalLength, 0, 5, 0, 2*Math.PI);
		this.context.fill();

		this.context.beginPath();
		this.context.strokeStyle = "rgba(0, 0, 0, 1)";
		this.context.lineWidth = 2;
		this.context.lineJoin = "round";
		this.context.lineCap = "round";
		switch (this.surfaceType) {
			case "convex-lens":
				this.context.moveTo(0, (this.canvas.height / 2) - 20);
				this.context.lineTo(-20, (this.canvas.height / 2) - 40); // bottom arrow
				this.context.moveTo(0, (this.canvas.height / 2) - 20);
				this.context.lineTo(20, (this.canvas.height / 2) - 40);
				this.context.moveTo(0, (this.canvas.height / 2) - 20);
				this.context.lineTo(0, -(this.canvas.height / 2) + 20); // central line
				this.context.lineTo(-20, -(this.canvas.height / 2) + 40); // top arrow
				this.context.moveTo(0, -(this.canvas.height / 2) + 20);
				this.context.lineTo(20, -(this.canvas.height / 2) + 40);
				this.context.stroke();
				break;
			case "concave-lens":
				this.context.moveTo(0, (this.canvas.height / 2) - 30);
				this.context.lineTo(-20, (this.canvas.height / 2) - 10); // bottom arrow
				this.context.moveTo(0, (this.canvas.height / 2) - 30);
				this.context.lineTo(20, (this.canvas.height / 2) - 10);
				this.context.moveTo(0, (this.canvas.height / 2) - 30);
				this.context.lineTo(0, -(this.canvas.height / 2) + 30); // central line
				this.context.lineTo(-20, -(this.canvas.height / 2) + 10); // top arrow
				this.context.moveTo(0, -(this.canvas.height / 2) + 30);
				this.context.lineTo(20, -(this.canvas.height / 2) + 10);
				this.context.stroke();
				break;
			case "concave-mirror":
				this.context.arc(-20, (this.canvas.height / 2) - 30, 20, 0, Math.PI/2);
				this.context.moveTo(0, (this.canvas.height / 2) - 30);
				this.context.lineTo(0, -(this.canvas.height / 2) + 30);
				this.context.arc(-20, -(this.canvas.height / 2) + 30, 20, 0, 3*Math.PI/2, true);
				this.context.stroke();
				this.context.beginPath();
				this.context.lineWidth = 1;
				currentY = -(this.canvas.height / 2) + 35;
				while (currentY < (this.canvas.height / 2) - 30){
					this.context.moveTo(0, currentY);
					this.context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.context.stroke();
				break;
			case "convex-mirror":
				this.context.arc(20, (this.canvas.height / 2) - 30, 20, Math.PI, Math.PI/2, true);
				this.context.moveTo(0, (this.canvas.height / 2) - 30);
				this.context.lineTo(0, -(this.canvas.height / 2) + 30);
				this.context.arc(20, -(this.canvas.height / 2) + 30, 20, Math.PI, 3*Math.PI/2);
				this.context.stroke();
				this.context.beginPath();
				this.context.lineWidth = 1;
				currentY = -(this.canvas.height / 2) + 45;
				while (currentY < (this.canvas.height / 2) - 20){
					this.context.moveTo(0, currentY);
					this.context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.context.stroke();
				break;
			case "plane-mirror":
				this.context.moveTo(0, (this.canvas.height / 2) - 20);
				this.context.lineTo(0, -(this.canvas.height / 2) + 20);
				this.context.stroke();
				this.context.beginPath();
				this.context.lineWidth = 1;
				currentY = -(this.canvas.height / 2) + 30;
				while (currentY < (this.canvas.height / 2) - 20){
					this.context.moveTo(0, currentY);
					this.context.lineTo(10, currentY - 10);
					currentY += 20;
				}
				this.context.stroke();
				break;
		}
	};

	this.draw = function(){
		this.context.save();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
		this.drawLens();

		this.context.fillStyle = "rgba(0, 0, 0, 1)";
		this.context.textAlign = "center";
		this.context.font = "11px monospace";
		this.context.fillText("Focal Point", -this.focalLength, -10);
		this.context.fillText("Focal Point", this.focalLength, -10);
		if (this.surfaceType === "concave-mirror" || this.surfaceType === "convex-mirror"){
			this.context.beginPath();
			this.context.arc(-2*this.focalLength, 0, 5, 0, 2*Math.PI);
			this.context.fill();
			this.context.fillText("Centre of Curvature", -2*this.focalLength, -10);
		}

		this.context.lineWidth = 1;
		switch (this.surfaceType) {
			case "convex-lens":
				this.context.beginPath(); // top principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.object.y);
				this.context.lineTo(this.canvas.width / 2, -((this.canvas.width / 2) - this.focalLength) * (this.object.y / this.focalLength));
				this.context.stroke();

				this.context.beginPath(); // centre principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.object.x));
				this.context.stroke();

				if (Math.abs(this.image.y()) < (this.canvas.height / 2) - 25) { // bottom principle ray
					this.context.beginPath();
					this.context.moveTo(this.canvas.width / 2, this.image.y());
					this.context.lineTo(0, this.image.y());
					this.context.lineTo(this.object.x, this.object.y);
					this.context.stroke();
				}

				if (Math.abs(this.object.x) <= this.focalLength){
					this.context.setLineDash([8, 4]);

					if (Math.abs(this.image.y()) < (this.canvas.height / 2) - 25) { // top virtual ray
						this.context.beginPath();
						this.context.moveTo(0, this.image.y());
						this.context.lineTo(-this.canvas.width / 2, this.image.y());
						this.context.stroke();
					}

					this.context.beginPath(); // centre virtual ray
					this.context.moveTo(0, this.object.y);
					this.context.lineTo(-this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
					this.context.stroke();

					this.context.beginPath(); // bottom virtual ray
					this.context.moveTo(this.object.x, this.object.y);
					this.context.lineTo(-this.canvas.width / 2, ((-(this.canvas.width / 2) + this.object.x) * (this.object.y / this.object.x)) - this.object.y);
					this.context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "concave-lens":
				this.context.beginPath(); // top principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.object.y);
				this.context.lineTo(this.canvas.width / 2, ((-this.canvas.width / 2) * (this.object.y / this.focalLength)) + this.object.y);
				this.context.stroke();

				this.context.beginPath(); // centre principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.image.y());
				this.context.lineTo(this.canvas.width / 2, this.image.y());
				this.context.stroke();

				this.context.beginPath(); // bottom principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.object.x));
				this.context.stroke();

				this.context.setLineDash([8, 4]);

				this.context.beginPath(); // top virtual ray
				this.context.moveTo(this.focalLength, 0);
				this.context.lineTo(0, this.object.y);
				this.context.stroke();

				this.context.beginPath(); // centre virtual ray
				this.context.moveTo(this.image.x(), this.image.y());
				this.context.lineTo(0, this.image.y());
				this.context.stroke();

				this.image.virtual = true;
				break;
			case "concave-mirror":
				this.context.beginPath(); // centre principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.object.y);
				this.context.lineTo(-this.canvas.width / 2, -(this.canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
				this.context.stroke();

				if (Math.abs(this.image.y()) < (this.canvas.height / 2) - 25) { // bottom principle ray
					this.context.beginPath();
					this.context.moveTo(this.object.x, this.object.y);
					this.context.lineTo(0, this.image.y());
					this.context.lineTo(-this.canvas.width / 2, this.image.y());
					this.context.stroke();
				}

				if (Math.abs(2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength))) < (this.canvas.height / 2) - 25) {
					this.context.beginPath(); // top principle ray
					this.context.moveTo(-2 * this.focalLength, 0);
					this.context.lineTo(0, 2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength)));
					this.context.moveTo(-2 * this.focalLength, 0);
					this.context.lineTo(-(this.canvas.width / 2), -((this.canvas.width / 2) - 2 * this.focalLength) * (this.object.y / (this.object.x + 2 * this.focalLength)));
					this.context.stroke();
				}

				if (Math.abs(this.object.x) <= this.focalLength){
					this.context.setLineDash([8, 4]);

					if (Math.abs(this.image.y()) < (this.canvas.height / 2) - 25) { // top virtual ray
						this.context.beginPath();
						this.context.moveTo(this.image.x(), this.image.y());
						this.context.lineTo(0, this.image.y());
						this.context.stroke();
					}

					if (Math.abs(2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength))) < (this.canvas.height / 2) - 25) {
						this.context.beginPath(); // centre virtual ray
						if (Math.abs(this.image.x()) === Infinity){
							this.context.moveTo(0, 2*this.object.y);
							this.context.lineTo(this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.focalLength) + 2*this.object.y);
						} else {
							this.context.moveTo(this.image.x(), this.image.y());
							this.context.lineTo(0, 2 * this.focalLength * (this.object.y / (this.object.x + 2 * this.focalLength)));
						}
						this.context.stroke();
					}

					this.context.beginPath(); // bottom virtual ray
					if (Math.abs(this.image.x()) === Infinity){
						this.context.moveTo(0, this.object.y);
						this.context.lineTo(this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.focalLength) + this.object.y);
					} else {
						this.context.moveTo(this.image.x(), this.image.y());
						this.context.lineTo(0, this.object.y);
					}
					this.context.stroke();

					this.image.virtual = true;
				} else {
					this.image.virtual = false;
				}
				break;
			case "convex-mirror":
				this.context.beginPath(); // top principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.object.y);
				this.context.lineTo(-this.canvas.width / 2, ((-this.canvas.width / 2) * (this.object.y / this.focalLength)) + this.object.y);
				this.context.stroke();

				this.context.beginPath(); // centre principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, this.image.y());
				this.context.lineTo(-this.canvas.width / 2, this.image.y());
				this.context.stroke();

				this.context.beginPath(); // bottom principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, 0);
				this.context.lineTo(-this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.object.x));
				this.context.stroke();

				this.context.setLineDash([8, 4]);

				this.context.beginPath(); // top virtual ray
				this.context.moveTo(-this.focalLength, 0);
				this.context.lineTo(0, this.object.y);
				this.context.stroke();

				this.context.beginPath(); // centre virtual ray
				this.context.moveTo(this.image.x(), this.image.y());
				this.context.lineTo(0, this.image.y());
				this.context.stroke();

				this.context.beginPath(); // bottom virtual ray
				this.context.moveTo(this.image.x(), this.image.y());
				this.context.lineTo(0, 0);
				this.context.stroke();

				this.image.virtual = true;
				break;
			case "plane-mirror":
				this.context.beginPath(); // top principle ray
				this.context.moveTo(this.object.x, this.object.y);
				this.context.lineTo(0, 0);
				this.context.lineTo(-this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.object.x));
				this.context.stroke();

				this.context.beginPath(); // bottom principle ray
				this.context.moveTo(this.object.x, 0);
				this.context.lineTo(0, -this.object.y);
				this.context.lineTo(-this.canvas.width / 2, (this.canvas.width / 2) * (this.object.y / this.object.x) - this.object.y);
				this.context.stroke();

				this.context.setLineDash([8, 4]);

				this.context.beginPath(); // top virtual ray
				this.context.moveTo(0, 0);
				this.context.lineTo(this.canvas.width / 2, -(this.canvas.width / 2) * (this.object.y / this.object.x));
				this.context.stroke();

				this.context.beginPath(); // bottom virtual ray
				this.context.moveTo(0, -this.object.y);
				this.context.lineTo(this.canvas.width / 2, -(this.canvas.width / 2) * (this.object.y / this.object.x) - this.object.y);
				this.context.stroke();

				this.image.virtual = true;
				break;
		}

		this.context.beginPath(); // object
		this.context.lineWidth = 1.75;
		this.context.fillText("Object", this.object.x, this.object.y - 10);
		this.context.setLineDash([0, 0]);
		this.context.moveTo(this.object.x, this.object.y);
		this.context.lineTo(this.object.x, 0);
		this.context.stroke();
		this.context.beginPath();
		this.context.arc(this.object.x, this.object.y, 5, 0, 2*Math.PI);
		this.context.fill();

		this.context.beginPath(); // image
		this.context.fillText("Image", this.image.x(), this.image.y() - 10);
		if (this.image.virtual){
			this.context.setLineDash([8, 4]);
			this.context.fillStyle = "rgba(255, 255, 255, 1)";
		}
		this.context.moveTo(this.image.x(), this.image.y());
		this.context.lineTo(this.image.x(), 0);
		this.context.stroke();
		this.context.beginPath();
		this.context.arc(this.image.x(), this.image.y(), 5, 0, 2*Math.PI);
		this.context.fill();
		this.context.setLineDash([0, 0]);
		this.context.lineWidth = 1;
		this.context.stroke();

		this.context.restore();
	};

	this.updateLabels = function(){
		this.parameterLabels.u.innerHTML = "Object distance: " + this.parameters.u();
		this.parameterLabels.v.innerHTML = "Image distance: " + this.parameters.v();
		this.parameterLabels.h.innerHTML = "Object size: " + this.parameters.h();
		this.parameterLabels.g.innerHTML = "Image size: " + this.parameters.g();
		this.parameterLabels.m.innerHTML = "Linear magnification: " + this.parameters.m();
		this.parameterLabels.type.innerHTML = "Image type: " + this.parameters.type();
	};

	this.update = function(){
		this.draw();
		this.updateLabels();
	}
}
