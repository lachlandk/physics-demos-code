import { OscillatorComponent } from "./OscillatorComponent.js";
import { ResultantOscillatorComponent } from "./ResultantOscillatorComponent.js";
import { core, Plot, Time } from "@lachlandk/pulsar";

export class PhasorsApp extends HTMLElement {
	constructor() {
		super();

		window.customElements.define("oscillator-component", OscillatorComponent);
		window.customElements.define("resultant-oscillator-component", ResultantOscillatorComponent);
		this.id = "app";
		this.animationsActive = false;
		this.activeOscillators = [];

		this.innerHTML = `
			<div id="oscillator-scroll-area"></div>
			<header id="header-container">
				<h1 id="title">Visualising Superposition with Phasors</h1>
				<button type="button" id="start-button">Play</button>
				<button type="button" id="pause-button" disabled>Pause</button>
				<button type="button" id="stop-button" disabled>Stop</button>
			</header>
		`;

		this.resultantOscillator = new ResultantOscillatorComponent(this);
		this.insertBefore(this.resultantOscillator, this.querySelector("#header-container"));
		this.oscillatorScrollArea = this.querySelector("#oscillator-scroll-area");

		this.startButton = this.querySelector("#start-button");
		this.pauseButton = this.querySelector("#pause-button");
		this.stopButton = this.querySelector("#stop-button");
		this.startButton.addEventListener("click", () => {
			Time.startAll();
			this.animationsActive = true;
			this.startButton.disabled = true;
			this.pauseButton.disabled = false;
			this.stopButton.disabled = false;
		});
		this.pauseButton.addEventListener("click", () => {
			Time.pauseAll();
			this.animationsActive = false;
			this.startButton.disabled = false;
			this.pauseButton.disabled = true;
			this.stopButton.disabled = false;
		});
		this.stopButton.addEventListener("click", () => {
			Time.stopAll();
			this.animationsActive = false;
			this.startButton.disabled = false;
			this.pauseButton.disabled = true;
			this.stopButton.disabled = true;
		});
	}

	addOscillator(...params) {
		const oscillator = new OscillatorComponent(this, this.activeOscillators.length, ...params);
		this.activeOscillators.push(oscillator);
		this.oscillatorScrollArea.appendChild(oscillator);
		this.resultantOscillator.updatePlots();
		if (this.resultantOscillator.phasor.data["phasor-x-component"].properties.visibility === true) {
			oscillator.phasor.data["phasor-x-component"].setVisibility(true);
		}
	}

	removeOscillator(oscillator) {
		this.activeOscillators.splice(oscillator.order, 1);
		delete core.activeCanvases[`phasor-${oscillator.order}`];
		delete core.activeCanvases[`wave-${oscillator.order}`];
		oscillator.remove();
		for (const osc of this.activeOscillators) {
			if (osc.order > oscillator.order ) {
				osc.order -= 1;
				osc.querySelector(".oscillator-title").innerText = `Oscillator ${osc.order + 1}`;
				Time.canvasTimeData[(2 * osc.order) + 4].id = `phasor-${osc.order}`;
				core.activeCanvases[`phasor-${osc.order + 1}`].setID(`phasor-${osc.order}`);
				Time.canvasTimeData[(2 * osc.order) + 5].id = `wave-${osc.order}`;
				core.activeCanvases[`wave-${osc.order + 1}`].setID(`wave-${osc.order}`);
			}
		}
		Time.canvasTimeData.splice((2 * oscillator.order) + 2, 2);
		this.resultantOscillator.updatePlots();
	}
}
