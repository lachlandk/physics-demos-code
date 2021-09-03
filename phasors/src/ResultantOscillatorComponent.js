import { Plot } from "@lachlandk/pulsar";

export class ResultantOscillatorComponent extends HTMLElement {
	constructor(app) {
		super();

		this.app = app;

		this.innerHTML = `
			<div class="oscillator-controls">
				<h2 class="oscillator-title">Resultant Oscillator</h2>
				<button type="button" id="add-oscillator-button">Add Oscillator</button>
				<button type="button" id="show-x-components-button"><span>Show</span> x Components</button>
				<div class="inline-oscillator-controls">
					<button type="button" id="show-all-button">Show All</button>
					<button type="button" id="hide-all-button">Hide All</button>
				</div>
			</div>
			<figure id="resultant-phasor" class="phasor"></figure>
			<figure id="resultant-wave" class="wave"></figure>
		`;
		this.id = "resultant-oscillator";
		this.classList.add("oscillator-container");

		//[[0, t => 4*Math.cos(t), t => 4*Math.cos(t)+2*Math.cos(2*t), t => 4*Math.cos(t)+2*Math.cos(2*t)+Math.cos(3*t)], [0, (x, t) => 4*Math.sin(t), (x, t) => 4*Math.sin(t)+2*Math.sin(2*t), (x, t) => 4*Math.sin(t)+2*Math.sin(2*t)+Math.sin(3*t)]]

		this.phasor = new Plot("resultant-phasor", undefined, {
			backgroundCSS: "lightseagreen",
			majorGridlines: false,
			minorGridlines: true,
			majorTicks: false,
			minorTicks: true,
			minorTickSize: 0.25,
			xLims: [-5, 5],
			yLims: [-5, 5]
		});
		this.phasor.addData("phasor-x-component", [
			[0, t => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.cos((2*Math.PI*osc.frequency*t)+osc.phase), 0), t => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.cos((2*Math.PI*osc.frequency*t)+osc.phase), 0)],
			[0, 0, (x, t) => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.sin((2*Math.PI*osc.frequency*t)+osc.phase), 0)]
		], {
			traceColour: "red",
			markerStyle: "arrow",
			markerColour: "red",
			visibility: false
		});
		this.phasor.addData("resultant-phasor", [
			[0, t => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.cos((2*Math.PI*osc.frequency*t)+osc.phase), 0)],
			[0, (x, t) => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.sin((2*Math.PI*osc.frequency*t)+osc.phase), 0)]
		], {
			traceColour: "yellow",
			markerColour: "yellow",
			markerStyle: "arrow"
		})

		this.wave = new Plot("resultant-wave", {
			id: "resultant-phasor",
			data: (x, t) => this.app.activeOscillators.reduce((acc, osc) => acc + osc.amplitude*Math.cos((2*Math.PI*osc.frequency*(x-t))-osc.phase), 0),
			options: {
				traceColour: "yellow"
			}
		}, {
			backgroundCSS: "lightseagreen",
			majorGridlines: false,
			minorGridlines: true,
			majorTicks: false,
			minorTicks: true,
			minorTickSize: 0.25,
			xLims: [-2, 10],
			yLims: [-5, 5]
		});

		this.querySelector("#add-oscillator-button").addEventListener("click", () => this.app.addOscillator());
		this.querySelector("#show-all-button").addEventListener("click", () => {
			for (const oscillator of this.app.activeOscillators) {
				oscillator.show();
			}
		});
		// TODO: x-components button doesn't work together with show/hide all
		this.querySelector("#show-x-components-button").addEventListener("click", event => {
			if (event.target.querySelector("span").innerText === "Show") {
				event.target.querySelector("span").innerText = "Hide";
				this.phasor.data["phasor-x-component"].setVisibility(true);
				for (const oscillator of this.app.activeOscillators) {
					oscillator.phasor.data["phasor-x-component"].setVisibility(true);
				}
			} else {
				event.target.querySelector("span").innerText = "Show";
				this.phasor.data["phasor-x-component"].setVisibility(false);
				for (const oscillator of this.app.activeOscillators) {
					oscillator.phasor.data["phasor-x-component"].setVisibility(false);
				}
			}
		});
		this.querySelector("#hide-all-button").addEventListener("click", () => {
			for (const oscillator of this.app.activeOscillators) {
				oscillator.hide();
			}
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
}
