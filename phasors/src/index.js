import { PhasorsApp } from "./PhasorsApp.js";

window.customElements.define("phasors-app", PhasorsApp);

const app = new PhasorsApp();
document.body.appendChild(app);

app.addOscillator();
app.addOscillator();
