let osc_1_phasor = new Phasor("osc-1"),
	osc_2_phasor = new Phasor("osc-2"),
	resultant_phasor = new ResultantPhasor(osc_1_phasor, osc_2_phasor),
	osc_1_wave = new Wave("osc-1", osc_1_phasor),
	osc_2_wave = new Wave("osc-2", osc_2_phasor),
	resultant_wave = new ResultantWave();

function osc_1_update(){
	osc_1_phasor.update();
	resultant_phasor.update();
	osc_1_wave.update();
	resultant_wave.update();
}

function osc_2_update(){
	osc_2_phasor.update();
	resultant_phasor.update();
	osc_2_wave.update();
	resultant_wave.update();
}

osc_1_update();
osc_2_update();
let animate = false;

function startAnimations(){
	animate = true;
	osc_1_phasor.update();
	osc_2_phasor.update();
	resultant_phasor.update();
	osc_1_wave.update();
	osc_2_wave.update();
	resultant_wave.update();
	document.getElementById("start-button").disabled = true;
	document.getElementById("osc-1-frequency-control").disabled = true;
	document.getElementById("osc-1-amplitude-control").disabled = true;
	document.getElementById("osc-2-frequency-control").disabled = true;
	document.getElementById("osc-2-amplitude-control").disabled = true;
	document.getElementById("stop-button").disabled = false;
}

function cancelAnimations(){
	animate = false;
	document.getElementById("start-button").disabled = false;
	document.getElementById("osc-1-frequency-control").disabled = false;
	document.getElementById("osc-1-amplitude-control").disabled = false;
	document.getElementById("osc-2-frequency-control").disabled = false;
	document.getElementById("osc-2-amplitude-control").disabled = false;
	document.getElementById("stop-button").disabled = true;
}

let phasors = [
		osc_1_phasor,
		osc_2_phasor,
		resultant_phasor
	],
	waves = [
		osc_1_wave,
		osc_2_wave,
		resultant_wave
	];

window.addEventListener("resize", function(){
	phasors.forEach(function(phasor){
		phasor.dimensions = phasor.phasor_canvas.parentElement.offsetHeight * window.devicePixelRatio;
		phasor.phasor_canvas.height = phasor.dimensions;
		phasor.phasor_canvas.width = phasor.dimensions;
		phasor.axes_canvas.height = phasor.dimensions;
		phasor.axes_canvas.width = phasor.dimensions;
		phasor.phasor.scale(window.devicePixelRatio, window.devicePixelRatio);
		phasor.axes.scale(window.devicePixelRatio, window.devicePixelRatio);
		phasor.drawAxes();
		phasor.update();
	});
	waves.forEach(function(wave){
		wave.wave_canvas.width = wave.wave_canvas.parentElement.offsetWidth * window.devicePixelRatio;
		wave.wave_canvas.height = wave.wave_canvas.parentElement.offsetHeight * window.devicePixelRatio;
		wave.axes_canvas.width = wave.axes_canvas.parentElement.offsetWidth * window.devicePixelRatio;
		wave.axes_canvas.height = wave.axes_canvas.parentElement.offsetHeight * window.devicePixelRatio;
		wave.wave.scale(window.devicePixelRatio, window.devicePixelRatio);
		wave.axes.scale(window.devicePixelRatio, window.devicePixelRatio);
		wave.drawAxes();
		wave.update();
	})
});
