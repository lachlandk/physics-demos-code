import { Plot } from "@lachlandk/pulsar";

export class OscillatorComponent extends HTMLElement {
	static MIN_FREQ = 0.1;
	static MAX_FREQ = 2;
	static DEF_FREQ = 1;
	static MIN_AMP = 0.1;
	static MAX_AMP = 2;
	static DEF_AMP = 1;

	constructor(app, order, frequency = OscillatorComponent.DEF_FREQ, amplitude = OscillatorComponent.DEF_AMP, phase = 0) {
		super();

		this.app = app;
		this.order = order;
		this.frequency = frequency
		this.amplitude = amplitude
		this.phase = phase;

		this.innerHTML = `
			<div class="oscillator-controls">
				<h2 class="oscillator-title">Oscillator ${this.order + 1}</h2>
				<label class="oscillator-label">
					<input class="oscillator-slider frequency-input" type="range" min="${OscillatorComponent.MIN_FREQ}" max="${OscillatorComponent.MAX_FREQ}" step="0.01" value="${this.frequency}">
					Frequency: <span class="oscillator-label-value">${this.frequency}</span>Hz
				</label>
				<label class="oscillator-label">
					<input class="oscillator-slider amplitude-input" type="range" min="${OscillatorComponent.MIN_AMP}" max="${OscillatorComponent.MAX_AMP}" step="0.01" value="${this.amplitude}">
					Amplitude: <span class="oscillator-label-value">${this.amplitude}</span>m
				</label>
				<label class="oscillator-label">
					<input class="oscillator-slider phase-input" type="range" min="${-2 * Math.PI}" max="${2 * Math.PI}" step="0.01" value="${this.phase}">
					Phase shift: <span class="oscillator-label-value">${+(Math.round(+((this.phase/Math.PI)+"e+2"))+"e-2")}</span>pi
				</label>
			</div>
			<figure class="phasor"></figure>
			<figure class="wave">
				<div class="oscillator-button-bar">
					<button type="button" class="hide-button">Hide</button>
					<button type="button" class="duplicate-button">Duplicate</button>
					<button type="button" class="remove-button">Remove</button>
				</div>
			</figure>
		`;
		this.classList.add("oscillator-container");

		this.phasor = new Plot(`phasor-${this.order}`, undefined, {
			backgroundCSS: "lightseagreen",
			majorGridlines: false,
			minorGridlines: true,
			majorTicks: false,
			minorTicks: true,
			minorTickSize: 0.25,
			xLims: [-3, 3],
			yLims: [-3, 3]
		});
		this.phasor.addData("phasor-x-component", [
			[0, t => this.amplitude*Math.cos((2*Math.PI*this.frequency*t)+this.phase), t => this.amplitude*Math.cos((2*Math.PI*this.frequency*t)+this.phase)],
			[0, 0, (x, t) => this.amplitude*Math.sin((2*Math.PI*this.frequency*t)+this.phase)]
		], {
			traceColour: "red",
			markerStyle: "arrow",
			markerColour: "red",
			visibility: false
		});
		this.phasor.addData("phasor", [
			[0, t => this.amplitude*Math.cos((2*Math.PI*this.frequency*t)+this.phase)],
			[0, (x, t) => this.amplitude*Math.sin((2*Math.PI*this.frequency*t)+this.phase)]
		], {
			traceColour: "yellow",
			markerColour: "yellow",
			markerStyle: "arrow"
		});
		this.wave = new Plot(`wave-${this.order}`, undefined, {
			backgroundCSS: "lightseagreen",
			majorGridlines: false,
			minorGridlines: true,
			majorTicks: false,
			minorTicks: true,
			minorTickSize: 0.25,
			xLims: [-2, 10],
			yLims: [-3, 3]
		});
		this.wave.addData("wave", (x, t) => this.amplitude*Math.cos((2*Math.PI*this.frequency*(x-t))-this.phase), {
			traceColour: "yellow"
		});

		this.querySelector(`.frequency-input`).addEventListener("input", event => {
			this.frequency = parseFloat(event.target.value);
			this.updatePlots();
			this.app.resultantOscillator.updatePlots();
			event.target.parentElement.querySelector(".oscillator-label-value").innerText = event.target.value;
		});
		this.querySelector(`.amplitude-input`).addEventListener("input", event => {
			this.amplitude = parseFloat(event.target.value);
			this.updatePlots();
			this.app.resultantOscillator.updatePlots();
			event.target.parentElement.querySelector(".oscillator-label-value").innerText = event.target.value;
		});
		this.querySelector(`.phase-input`).addEventListener("input", event => {
			this.phase = parseFloat(event.target.value);
			this.updatePlots();
			this.app.resultantOscillator.updatePlots();
			event.target.parentElement.querySelector(".oscillator-label-value").innerText = +(Math.round(+((event.target.value/Math.PI)+"e+2"))+"e-2");
		});
		this.querySelector(`.hide-button`).addEventListener("click", event => {
			if (!this.classList.contains("hidden")) {
				this.hide();
				event.target.innerText = "Show";
			} else {
				this.show();
				event.target.innerText = "Hide";
			}
		});
		this.querySelector(`.remove-button`).addEventListener("click", () => {
			this.app.removeOscillator(this);
		});
		this.querySelector(`.duplicate-button`).addEventListener("click", () => {
			this.app.addOscillator(this.frequency, this.amplitude, this.phase);
		});
		this.phasor.show(this.querySelector(".phasor"));
		this.wave.show(this.querySelector(".wave"));
	}

	updatePlots() {
		if (!this.app.animationsActive) {
			this.phasor.updatePlottingData();
			this.wave.updatePlottingData();
		}
	}

	show() {
		this.classList.remove("hidden");
		this.phasor.data["phasor"].setVisibility(true);
		this.wave.data["wave"].setVisibility(true);
	}

	hide() {
		this.classList.add("hidden");
		this.phasor.data["phasor"].setVisibility(false);
		this.phasor.data["phasor-x-component"].setVisibility(false);
		this.wave.data["wave"].setVisibility(false);
	}
}
