function Wave(id, phasor){
	this.id = id;
	this.wave_canvas = document.getElementById(id + "-wave");
	this.axes_canvas = document.getElementById(id + "-wave-axes");
	this.wave_canvas.width = this.wave_canvas.parentElement.offsetWidth * window.devicePixelRatio;
	this.wave_canvas.height = this.wave_canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.axes_canvas.width = this.axes_canvas.parentElement.offsetWidth * window.devicePixelRatio;
	this.axes_canvas.height = this.axes_canvas.parentElement.offsetHeight * window.devicePixelRatio;
	this.wave = this.wave_canvas.getContext("2d");
	this.axes = this.axes_canvas.getContext("2d");
	this.wave.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.axes.scale(window.devicePixelRatio, window.devicePixelRatio);
	this.phase = 0;
	if (phasor !== null){
		this.A = phasor.amplitude;
		this.f = phasor.frequency;
	}

	this.drawAxes = function(){
		this.axes.save();
		this.axes.clearRect(0, 0, this.axes_canvas.width, this.axes_canvas.height);
		this.axes.translate(30.5, (this.axes_canvas.height / 2) + 0.5);
		this.axes.beginPath();
		this.axes.strokeStyle = "rgba(0, 0, 0, 1)";
		this.axes.lineWidth = 1;
		this.axes.moveTo(-30, 0);
		this.axes.lineTo(this.axes_canvas.width - 30, 0);
		this.axes.moveTo(0, -(this.axes_canvas.height / 2));
		this.axes.lineTo(0, this.axes_canvas.height);
		this.axes.stroke();
		this.axes.restore();
	};

	this.drawAxes();


	this.draw = function(){
		this.wave.save();
		this.wave.clearRect(0, 0, this.wave_canvas.width, this.wave_canvas.height);
		this.wave.translate(30.5, (this.wave_canvas.height / 2) + 0.5);

		if (animate){
			let time = new Date();
			this.phase = 2*Math.PI*this.f()*time.getSeconds() + 2*Math.PI*(this.f()/1000)*time.getMilliseconds();
		} else {
			this.phase = 0;
		}

		// draw wave
		this.wave.beginPath();
		this.wave.strokeStyle = "rgb(50,71,255)";
		this.wave.lineWidth = 2;
		this.wave.moveTo(0, -this.A()*((this.wave_canvas.height/2) / 2.1)*Math.cos(this.phase));
		for (let i=0; i<100; i++){
			this.wave.lineTo((i/100)*(this.wave_canvas.width - 30), -this.A()*((this.wave_canvas.height/2) / 2.1)*Math.cos(this.f()*(i/100)*(4*Math.PI) - this.phase))
		}
		this.wave.stroke();

		this.wave.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	}
}

function ResultantWave(){
	Wave.call(this, "resultant", null);
	this.A1 = osc_1_phasor.amplitude();
	this.A2 = osc_2_phasor.amplitude();
	this.f1 = osc_1_phasor.frequency();
	this.f2 = osc_2_phasor.frequency();

	this.draw = function(){
		this.wave.save();
		this.wave.clearRect(0, 0, this.wave_canvas.width, this.wave_canvas.height);
		this.wave.translate(30.5, (this.wave_canvas.height / 2) + 0.5);

		// draw resultant wave
		this.wave.beginPath();
		this.wave.strokeStyle = "rgb(50,71,255)";
		this.wave.lineWidth = 2;
		this.wave.moveTo(0, -(this.A1*((this.wave_canvas.height/2) / 4.1)*Math.cos(osc_1_wave.phase) + this.A2*((this.wave_canvas.height/2) / 4.1)*Math.cos(osc_2_wave.phase)));
		for (let i=0; i<100; i++){
			this.wave.lineTo((i/100)*(this.wave_canvas.width - 30), -(this.A1*((this.wave_canvas.height/2) / 4.1)*Math.cos(this.f1*(i/100)*(4*Math.PI) - osc_1_wave.phase) + this.A2*((this.wave_canvas.height/2) / 4.1)*Math.cos(this.f2*(i/100)*(4*Math.PI) - osc_2_wave.phase)))
		}
		this.wave.stroke();

		this.wave.restore();

		if (animate){
			this.update();
		}
	};


	this.update = function(){
		this.A1 = osc_1_phasor.amplitude();
		this.A2 = osc_2_phasor.amplitude();
		this.f1 = osc_1_phasor.frequency();
		this.f2 = osc_2_phasor.frequency();
		let _this = this;
		window.requestAnimationFrame(function(){
			_this.draw();
		});
	}
}
