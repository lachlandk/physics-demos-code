// TODO: replace date object with custom stopwatch so phase always starts at zero

function Phasor(id){
	// TODO: redo this whole thing, creating elements from scratch then putting them in the DOM
	this.id = id;
	this.phasor_canvas = document.getElementById(this.id + "-phasor"); // TODO: change to "phasor-1" etc.
	this.axes_canvas = document.getElementById(this.id + "-phasor-axes");
	this.dimensions = this.phasor_canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.phasor_canvas.height = this.dimensions;
	this.phasor_canvas.width = this.dimensions; // TODO: these 4 variables can be collapsed into 1 in future references
	this.axes_canvas.height = this.dimensions;
	this.axes_canvas.width = this.dimensions;
	this.phasor = this.phasor_canvas.getContext("2d");
	this.axes = this.axes_canvas.getContext("2d");
	this.phasor.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.axes.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.amplitudeLabel = document.getElementById(this.id + "-amplitude-label");
	this.frequencyLabel = document.getElementById(this.id + "-frequency-label");
	this.phase = 0; // TODO: implement

	this.amplitude = function () {
		let control = document.getElementById(this.id + "-amplitude-control");
		return (control !== null ? parseFloat(control.value) : undefined);
	};
	this.frequency = function () {
		let control = document.getElementById(this.id + "-frequency-control");
		return (control !== null ? parseFloat(control.value) : undefined);
	};


	this.drawAxes = function () {
		this.axes.save();
		this.axes.clearRect(0, 0, this.axes_canvas.width, this.axes_canvas.height);
		this.axes.translate((this.axes_canvas.width / 2) + 0.5, (this.axes_canvas.height / 2) + 0.5);
		this.axes.beginPath();
		this.axes.strokeStyle = "rgba(0, 0, 0, 1)";
		this.axes.lineWidth = 1;
		this.axes.moveTo(-(this.axes_canvas.width / 2), 0);
		this.axes.lineTo(this.axes_canvas.width, 0);
		this.axes.moveTo(0, -(this.axes_canvas.height / 2));
		this.axes.lineTo(0, this.axes_canvas.height);
		this.axes.stroke();
		this.axes.restore();
	};

	this.drawAxes(); // run function when init

	this.draw = function(){
		this.phasor.save();
		this.phasor.clearRect(0, 0, this.phasor_canvas.width, this.phasor_canvas.height);
		this.phasor.translate((this.phasor_canvas.width / 2) + 0.5, (this.phasor_canvas.height / 2) + 0.5);

		if (animate){
			let time = new Date();
			this.phase = 2*Math.PI*this.frequency()*time.getSeconds() + 2*Math.PI*(this.frequency()/1000)*time.getMilliseconds();
		} else {
			this.phase = 0;
		}

		// draw vector
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgb(50, 71, 255)";
		this.phasor.lineWidth = 3;
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(this.amplitude()*((this.phasor_canvas.width/2) / 2.1)*Math.cos(this.phase), -this.amplitude()*((this.phasor_canvas.width/2) / 2.1)*Math.sin(this.phase));
		this.phasor.stroke();

		this.phasor.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){ // updates animation TODO: split update function into update animation and update axes
		this.amplitudeLabel.innerHTML = "A = " + this.amplitude().toFixed(2);
		this.frequencyLabel.innerHTML = "f = " + this.frequency().toFixed(2);
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	};
}

function ResultantPhasor(osc_1, osc_2){
	Phasor.call(this, "resultant");
	this.osc_1 = osc_1;
	this.osc_2 = osc_2;

	this.amplitude = function(){ // resultant amplitude
		return this.osc_1.amplitude() + this.osc_2.amplitude();
	};
	this.frequency = function(){ // beat frequency
		return parseFloat(Math.abs(this.osc_1.frequency() - this.osc_2.frequency()).toPrecision(2));
	};


	this.draw = function(){
		this.phasor.save();
		this.phasor.clearRect(0, 0, this.phasor_canvas.width, this.phasor_canvas.height);
		this.phasor.translate((this.phasor_canvas.width / 2) + 0.5, (this.phasor_canvas.height / 2) + 0.5);

		let Ax = this.osc_1.amplitude()*((this.phasor_canvas.width/2) / 4.1)*Math.cos(this.osc_1.phase),
			Ay = -this.osc_1.amplitude()*((this.phasor_canvas.width/2) / 4.1)*Math.sin(this.osc_1.phase),
			Bx = this.osc_2.amplitude()*((this.phasor_canvas.width/2) / 4.1)*Math.cos(this.osc_2.phase),
			By = -this.osc_2.amplitude()*((this.phasor_canvas.width/2) / 4.1)*Math.sin(this.osc_2.phase);

		//draw resultant vector
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgba(102, 102, 102, 0.5)";
		this.phasor.lineWidth = 3;
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(Ax + Bx, Ay + By);
		this.phasor.stroke();

		// draw constituent vectors
		this.phasor.beginPath();
		this.phasor.strokeStyle = "rgb(50, 71, 255)";
		this.phasor.lineWidth = 3;
		this.phasor.lineJoin = "round";
		this.phasor.moveTo(0, 0);
		this.phasor.lineTo(Ax, Ay);
		this.phasor.lineTo(Ax + Bx, Ay + By);
		this.phasor.stroke();

		this.phasor.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){ // updates animation TODO: split update function into update animation and update axes
		this.amplitudeLabel.innerHTML = "maximum A = " + this.amplitude().toFixed(2);
		this.frequencyLabel.innerHTML = "beat frequency = " + this.frequency().toFixed(2);
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	};
}
