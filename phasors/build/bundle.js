/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/Defaults.js":
/*!*****************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/Defaults.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Defaults": () => (/* binding */ Defaults)
/* harmony export */ });
// TODO: this module needs tests
class defaults {
    constructor() {
        this.values = {
            ResponsiveCanvas: {
                origin: { x: 0, y: 0 },
                backgroundCSS: ""
            },
            ResponsivePlot2D: {
                origin: { x: 0, y: 0 },
                backgroundCSS: "",
                majorTicks: { x: true, y: true },
                minorTicks: { x: false, y: false },
                majorTickSize: { x: 5, y: 5 },
                minorTickSize: { x: 1, y: 1 },
                majorGridlines: { x: true, y: true },
                minorGridlines: { x: false, y: false },
                majorGridSize: { x: 5, y: 5 },
                minorGridSize: { x: 1, y: 1 },
                xLims: [0, 10],
                yLims: [-10, 0]
            },
            ResponsivePlot2DTrace: {
                traceColour: "blue",
                traceStyle: "solid",
                traceWidth: 3,
                markerColour: "blue",
                markerStyle: "none",
                markerSize: 1,
                visibility: true,
                parameterRange: [0, 1]
            }
        };
        // static setDefault(proto: {[property: string]: unknown}, property: string, value: unknown) {
        //     proto[property] = value;
        // }
    }
    create(...protos) {
        return Object.assign({}, ...Array.from(protos, (proto) => this.values[proto]));
    }
    mergeOptions(instance, type, options) {
        for (const option of Object.keys(options)) {
            if (option in this.values[type]) {
                const setterFunc = instance[`set${option.charAt(0).toUpperCase()}${option.slice(1)}`];
                if (setterFunc !== undefined) {
                    setterFunc.call(instance, ...(Array.isArray(options[option]) ? options[option] : [options[option]]));
                }
            }
        }
    }
}
const Defaults = new defaults();


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/Plot.js":
/*!*************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/Plot.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Plot": () => (/* binding */ Plot)
/* harmony export */ });
/* harmony import */ var _plotting_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./plotting/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2D.js");
/* harmony import */ var _core_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js");


class Plot extends _plotting_index_js__WEBPACK_IMPORTED_MODULE_0__.ResponsivePlot2D {
    /**
     * Returns an object containing the active instances of {@link Plot `Plot`}.
     */
    static activePlots() {
        const activePlots = {};
        for (const canvasID of Object.keys(_core_index_js__WEBPACK_IMPORTED_MODULE_1__.activeCanvases)) {
            if (_core_index_js__WEBPACK_IMPORTED_MODULE_1__.activeCanvases[canvasID] instanceof Plot) {
                activePlots[canvasID] = _core_index_js__WEBPACK_IMPORTED_MODULE_1__.activeCanvases[canvasID];
            }
        }
        return activePlots;
    }
    /**
     * @param id - The ID of the plot object. Must be unique.
     * @param data - The data to be plotted. The structure of the object follows the exact same pattern as the signature of {@link ResponsivePlot2D.plot `plot()`}.
     * @param data.id - The ID for the trace. This ID will be the key for the relevant entry in the {@link ResponsivePlot2D.data `data`} property of the plot object.
     * @param data.data - The data to be plotted. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param data.object - The options for the data. See the {@link ResponsivePlot2D.plot `plot()`} method documentation for more details.
     * @param options - Options for the plot.
     */
    constructor(id, data, options = {}) {
        super(id, options);
        if (data !== undefined) {
            this.addData(data.id, data.data, data.options);
        }
    }
}


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/ResponsiveCanvas.js":
/*!******************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/core/ResponsiveCanvas.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResponsiveCanvas": () => (/* binding */ ResponsiveCanvas)
/* harmony export */ });
/* harmony import */ var _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/propertySetters.js");
/* harmony import */ var _activeCanvases_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./activeCanvases.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js");
/* harmony import */ var _Defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Defaults.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/Defaults.js");
/* harmony import */ var _TimeEvolutionController_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TimeEvolutionController.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/TimeEvolutionController.js");




/**
 * Class representing the base canvas object which all other Pulsar canvas objects inherit from.
 * This class is not meant to be instantiated directly by a user, mainly because it is not very useful by itself.
 * However, it does provide a lot of useful functionality which is used by subclasses.
 * A `ResponsiveCanvas` instance has two drawing surfaces, a background and a foreground.
 * These drawing surfaces can be added to the HTML page as canvas elements by calling `show`.
 * These canvases will then fill the container element, and even change their size when the container element is resized.
 * The coordinate origin of a ResponsiveCanvas can be changed with `setOrigin`, and it can be drawn on and animated
 * by passing a drawing function to `setBackground` or `setForeground`. Read-only properties and methods beginning with
 * an underscore should not be changed/called, otherwise they may cause unpredictable behaviour.
 */
class ResponsiveCanvas {
    /**
     * @param id The ID of the canvas object.
     * @param options  Optional parameters.
     */
    constructor(id, options = {}) {
        /**
         * The unique ID for the canvas object.
         */
        this.id = "";
        /**
         *
         */
        this.properties = _Defaults_js__WEBPACK_IMPORTED_MODULE_0__.Defaults.create("ResponsiveCanvas");
        this.currentTimeValue = 0;
        // TODO: add child objects to options to allow more options
        const canvasContainer = document.createElement("div");
        canvasContainer.style.display = "grid";
        canvasContainer.style.width = "100%";
        canvasContainer.style.height = "100%";
        const backgroundCanvas = document.createElement("canvas");
        backgroundCanvas.style.gridArea = "1 / 1";
        const foregroundCanvas = document.createElement("canvas");
        foregroundCanvas.style.gridArea = "1 / 1";
        canvasContainer.appendChild(backgroundCanvas);
        canvasContainer.appendChild(foregroundCanvas);
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.resizeEventListener(entry);
                this.updateBackground();
                this.updateForeground();
            }
        });
        resizeObserver.observe(canvasContainer);
        this._displayData = {
            width: 0,
            height: 0,
            originArgCache: null,
            parentElement: null,
            resizeObserver: resizeObserver,
            canvasContainer: canvasContainer,
            backgroundCanvas: backgroundCanvas,
            foregroundCanvas: foregroundCanvas,
            background: backgroundCanvas.getContext("2d"),
            foreground: foregroundCanvas.getContext("2d"),
            backgroundFunction: () => { },
            foregroundFunction: () => { }
        };
        _TimeEvolutionController_js__WEBPACK_IMPORTED_MODULE_1__.Time.addObject(id);
        this.setID(id);
        _Defaults_js__WEBPACK_IMPORTED_MODULE_0__.Defaults.mergeOptions(this, "ResponsiveCanvas", options);
    }
    resizeEventListener(entry) {
        this._displayData.width = entry.target.clientWidth;
        this._displayData.height = entry.target.clientHeight;
        this._displayData.backgroundCanvas.width = this._displayData.width;
        this._displayData.backgroundCanvas.height = this._displayData.height;
        this._displayData.foregroundCanvas.width = this._displayData.width;
        this._displayData.foregroundCanvas.height = this._displayData.height;
        if (this._displayData.originArgCache !== null) {
            this.setOrigin(this._displayData.originArgCache);
        }
        this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y); // because changing the size of a canvas resets it
        this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
    }
    /**
      * Updates the background.
      */
    updateBackground() {
        this._displayData.background.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
        this._displayData.backgroundFunction(this._displayData.background);
    }
    /**
      * Updates the foreground.
      */
    updateForeground() {
        this._displayData.foreground.clearRect(-this.properties.origin.x, -this.properties.origin.y, this._displayData.width, this._displayData.height);
        this._displayData.foregroundFunction(this._displayData.foreground, this.currentTimeValue);
    }
    /**
     * Sets the drawing function for the background canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * @param drawingFunction The function which draws the background.
     */
    setBackground(drawingFunction) {
        this._displayData.backgroundFunction = drawingFunction;
        this.updateBackground();
    }
    /**
     * Sets the drawing function for the foreground canvas to `drawingFunction` and updates the canvas.
     * The argument `drawingFunction` should be a function which takes one or two arguments of its own, the first being the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D `CanvasRenderingContext2D`} for the background,
     * and the second (which is optional) being the current time evolution value for the canvas object (in seconds).
     * The second argument need only specified if the drawing function contains animations which depend on the current
     * time value.
     * @param drawingFunction The function which draws the foreground.
     */
    setForeground(drawingFunction) {
        this._displayData.foregroundFunction = drawingFunction;
        this.updateForeground();
    }
    /**
     * Sets the origin of both canvases to the point2D specified (in pixels).
     * Two values may be passed for `x` then `y`, or one value may be passed to set the origins of both axes to the same value.
     * The string `"centre"` may also be passed to conveniently set the origin to the middle of the canvas.
     * Note that for the HTML5 canvas the origin is in the top-left corner by default and the x-axis points rightwards,
     * while the y-axis points downwards.
     * @param point
     */
    setOrigin(...point) {
        if (point.length === 1 && point[0] === "centre") {
            _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setAxesProperty(this, "origin", "number", Math.round(this._displayData.width / 2), Math.round(this._displayData.height / 2));
            this._displayData.originArgCache = point[0];
        }
        else {
            _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setAxesProperty(this, "origin", "number", ...point);
            this._displayData.originArgCache = null;
        }
        this._displayData.background.resetTransform();
        this._displayData.background.translate(this.properties.origin.x, this.properties.origin.y);
        this.updateBackground();
        this._displayData.foreground.resetTransform();
        this._displayData.foreground.translate(this.properties.origin.x, this.properties.origin.y);
        this.updateForeground();
    }
    /**
     * Sets the ID of the canvas object to the value specified,
     * which cannot be the same as another existing canvas object.
     * If the canvas object is active on an HTML page, all of its elements will have their `ID`s updated.
     * @param id New ID for the canvas object.
     */
    setID(id) {
        if (_activeCanvases_js__WEBPACK_IMPORTED_MODULE_3__.activeCanvases[id] === undefined) {
            delete _activeCanvases_js__WEBPACK_IMPORTED_MODULE_3__.activeCanvases[this.id];
            _TimeEvolutionController_js__WEBPACK_IMPORTED_MODULE_1__.Time.canvasTimeData.find(object => object.id === id).id = id;
            this.id = id;
            _activeCanvases_js__WEBPACK_IMPORTED_MODULE_3__.activeCanvases[this.id] = this;
        }
        else {
            throw `Error creating ResponsiveCanvas object: Object with ID "${id}" already exists.`;
        }
    }
    /**
     * Sets the `background` CSS property of the background canvas to the string passed in.
     * This can be used to set the background for the canvas object to a plain colour, gradient pattern or image
     * (by default the background is transparent).
     * @param cssString A valid string for the CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background `background`} property.
     */
    setBackgroundCSS(cssString) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "backgroundCSS", "string", cssString);
        this._displayData.backgroundCanvas.style.background = cssString;
    }
    // /**
    //  * Starts or resumes the time evolution of the foreground.
    //  */
    // startTime() {}
    // /**
    //  * Pauses the time evolution of the foreground.
    //  */
    // pauseTime() {}
    // /**
    //  * Stops the time evolution of the foreground and resets the current timestamp to 0.
    //  */
    // stopTime() {}
    /**
     * Display the canvas object in an HTML element.
     * @param element
     */
    show(element) {
        if (element instanceof Element) {
            this._displayData.parentElement = element;
        }
        else {
            this._displayData.parentElement = document.querySelector(element);
        }
        if (this._displayData.parentElement !== null) {
            this._displayData.parentElement.appendChild(this._displayData.canvasContainer);
            this._displayData.width = this._displayData.canvasContainer.clientWidth;
            this._displayData.height = this._displayData.canvasContainer.clientHeight;
            if (this._displayData.originArgCache !== null) {
                this.setOrigin(this._displayData.originArgCache);
            }
            this.setBackgroundCSS(this.properties.backgroundCSS); // TODO: shouldn't have to call this again
        }
        else {
            throw `HTMLElement with querySelector "${element}" could not be found.`;
        }
    }
    hide() {
        if (this._displayData.parentElement !== null) {
            this._displayData.parentElement.removeChild(this._displayData.canvasContainer);
            this._displayData.parentElement = null;
        }
    }
}


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/TimeEvolutionController.js":
/*!*************************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/core/TimeEvolutionController.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Time": () => (/* binding */ Time)
/* harmony export */ });
/* harmony import */ var _activeCanvases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./activeCanvases.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js");
// TODO: this module needs tests

class TimeEvolutionController {
    constructor() {
        this.canvasTimeData = [];
        this.globalLoopActive = false;
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
    }
    startAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = true;
        }
        this.startTimestamp = performance.now();
        this.globalLoopActive = true;
        window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
    }
    pauseAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = false;
        }
        this.offsetTimestamp = this.offsetTimestamp + performance.now() - this.startTimestamp;
    }
    stopAll() {
        for (const object of this.canvasTimeData) {
            object.timeEvolutionActive = false;
            _activeCanvases_js__WEBPACK_IMPORTED_MODULE_0__.activeCanvases[object.id].currentTimeValue = 0;
            _activeCanvases_js__WEBPACK_IMPORTED_MODULE_0__.activeCanvases[object.id].updateForeground();
        }
        this.startTimestamp = 0;
        this.offsetTimestamp = 0;
        this.globalLoopActive = false;
    }
    updateObjects(currentTimestamp) {
        if (this.globalLoopActive) {
            let atLeastOneActiveCanvas = false;
            for (const object of this.canvasTimeData) {
                if (object.timeEvolutionActive) {
                    atLeastOneActiveCanvas = true;
                    _activeCanvases_js__WEBPACK_IMPORTED_MODULE_0__.activeCanvases[object.id].currentTimeValue = (this.offsetTimestamp + currentTimestamp - this.startTimestamp) / 1000;
                    _activeCanvases_js__WEBPACK_IMPORTED_MODULE_0__.activeCanvases[object.id].updateForeground();
                }
            }
            if (atLeastOneActiveCanvas) {
                window.requestAnimationFrame(timestamp => this.updateObjects(timestamp));
            }
            else {
                this.globalLoopActive = false;
            }
        }
    }
    addObject(id, sync = true) {
        if (this.canvasTimeData.find(object => object.id === id) === undefined) {
            this.canvasTimeData.push({
                id: id,
                timeEvolutionActive: sync,
            });
        }
        else {
            throw `Error: Time data for canvas object with ID "${id}" already exists.`;
        }
    }
}
const Time = new TimeEvolutionController();


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js":
/*!****************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "activeCanvases": () => (/* binding */ activeCanvases)
/* harmony export */ });
/**
 * Object containing the active canvas objects with their ID as the keys. It is used
 * internally by other objects.
 */
const activeCanvases = {};


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/generators.js":
/*!***************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/generators.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "continuousFunctionGenerator": () => (/* binding */ continuousFunctionGenerator),
/* harmony export */   "parametricFunctionGenerator": () => (/* binding */ parametricFunctionGenerator),
/* harmony export */   "discreteMapGenerator": () => (/* binding */ discreteMapGenerator),
/* harmony export */   "discreteFunctionGenerator": () => (/* binding */ discreteFunctionGenerator)
/* harmony export */ });
function continuousFunctionGenerator(func) {
    return function* (t, xLims, yLims, step) {
        // TODO: discontinuities
        let x = xLims[0];
        let y = (x) => func(x, t);
        while (x <= xLims[1]) {
            while (true) { // while y is out of range or undefined
                if (x > xLims[1]) { // if x is out of range, break without yielding previous point2D
                    break;
                }
                else if (y(x) <= yLims[1] && y(x) >= yLims[0] && !Number.isNaN(y(x))) { // if y is in range, yield the previous point2D and break
                    yield [x - step, y(x - step)];
                    break;
                }
                else { // else increment x
                    x += step;
                }
            }
            while (true) { // while y in in range and defined
                yield [x, y(x)];
                if (x > xLims[1] || y(x) > yLims[1] || y(x) < yLims[0] || Number.isNaN(y(x))) { // if x or y is out of range, yield current point2D and break
                    break;
                }
                else { // else increment x
                    x += step;
                }
            }
        }
    };
}
function parametricFunctionGenerator(data) {
    return function* (t, xLims, yLims, step, paramLims) {
        let x = (p) => data[0](p, t);
        let y = (p) => data[1](p, t);
        let p = paramLims[0];
        while (p <= paramLims[1]) {
            yield [x(p), y(p)];
            p += step;
        }
        yield [x(p), y(p)];
    };
}
function discreteMapGenerator(data) {
    return function* (t) {
        // TODO: add support for NaN
        for (const x of data[0]) {
            yield [x, data[1](x, t)];
        }
    };
}
function discreteFunctionGenerator(data) {
    return function* (t) {
        // TODO: add support for NaN
        for (let i = 0; i < data[0].length; i++) {
            const xValue = typeof data[0][i] === "function" ? data[0][i](t) : data[0][i];
            const yValue = typeof data[1][i] === "function" ? data[1][i](xValue, t) : data[1][i];
            yield [xValue, yValue];
        }
    };
}


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/propertySetters.js":
/*!********************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/propertySetters.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "propertySetters": () => (/* binding */ propertySetters)
/* harmony export */ });
const propertySetters = {
    setAxesProperty(instance, property, expectedType, ...values) {
        if (values.length === 1 && typeof values[0] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[0]
            };
        }
        else if (values.length === 2 && typeof values[0] === expectedType && typeof values[1] === expectedType) {
            instance.properties[property] = {
                x: values[0],
                y: values[1]
            };
        }
        else {
            throw `Error setting axes property ${property}: Unexpected value ${values}.`;
        }
    },
    setSingleProperty(instance, property, expectedType, value) {
        if (typeof value === expectedType) {
            instance.properties[property] = value;
        }
        else {
            throw `Error setting single property ${property}: Unexpected type "${value}".`;
        }
    },
    setArrayProperty(instance, property, expectedType, values, length) {
        if (!Array.isArray(values)) {
            throw `Error setting array property ${property}: "${values}" is not an array.`;
        }
        else if (values.length !== length) {
            throw `Error setting array property ${property}: "${values}" is not of length ${length}`;
        }
        else {
            for (const value of values) {
                if (typeof value !== expectedType) {
                    throw `Error setting array property ${property}: "Unexpected type "${value}" in array.`;
                }
            }
            instance.properties[property] = values;
        }
    },
    setChoiceProperty(instance, property, expectedType, value, choices) {
        if (typeof value === expectedType) {
            let validChoice = false;
            for (const choice of choices) {
                if (value === choice) {
                    instance.properties[property] = value;
                    validChoice = true;
                }
            }
            if (!validChoice) {
                throw `Error setting choice property ${property}: Invalid choice "${value}".`;
            }
        }
        else {
            throw `Error setting choice property ${property}: Unexpected type "${value}".`;
        }
    }
};


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/index.js":
/*!**************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "core": () => (/* binding */ core)
/* harmony export */ });
/* unused harmony export plotting */
/* harmony import */ var _core_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/ResponsiveCanvas.js");
/* harmony import */ var _core_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/activeCanvases.js");
/* harmony import */ var _plotting_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plotting/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2D.js");
/* harmony import */ var _plotting_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plotting/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2DTrace.js");
/**
 * @licence
 * Pulsar.js - A javascript data visualisation framework
 * Copyright (C) 2021  Lachlan Dufort-Kennett
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const core = {
    ResponsiveCanvas: _core_index_js__WEBPACK_IMPORTED_MODULE_0__.ResponsiveCanvas,
    activeCanvases: _core_index_js__WEBPACK_IMPORTED_MODULE_1__.activeCanvases
};

const plotting = {
    ResponsivePlot2D: _plotting_index_js__WEBPACK_IMPORTED_MODULE_2__.ResponsivePlot2D,
    ResponsivePlot2DTrace: _plotting_index_js__WEBPACK_IMPORTED_MODULE_3__.ResponsivePlot2DTrace
};





/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2D.js":
/*!**********************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2D.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResponsivePlot2D": () => (/* binding */ ResponsivePlot2D)
/* harmony export */ });
/* harmony import */ var _core_ResponsiveCanvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/ResponsiveCanvas.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/ResponsiveCanvas.js");
/* harmony import */ var _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/propertySetters.js");
/* harmony import */ var _ResponsivePlot2DTrace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ResponsivePlot2DTrace.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2DTrace.js");
/* harmony import */ var _Defaults_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Defaults.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/Defaults.js");




/**
 * This class is the base class for all Pulsar plot objects. It extends {@link ResponsiveCanvas `ResponsiveCanvas`}.
 * A `ResponsivePlot2D` object can be created by calling the constructor, but the preferred method is to use the
 * {@link Plot `Plot`} class. `ResponsivePlot2D` objects behave similarly to a `ResponsiveCanvas`.
 * They have a background, which contains the axes and gridlines, and a foreground, which contains the plot data.
 * The ticks and gridlines can be toggled and the intervals between them can be changed.
 * Data is added to the plot using the {@link ResponsivePlot2D.addData `addData()`} method.
 * Read-only properties and methods beginning with an underscore should not be changed/called, otherwise they
 * may cause unpredictable behaviour.
 */
class ResponsivePlot2D extends _core_ResponsiveCanvas_js__WEBPACK_IMPORTED_MODULE_0__.ResponsiveCanvas {
    /**
     * @param id The unique ID of the plot object.
     * @param options Optional parameters.
     */
    constructor(id, options = {}) {
        super(id, options);
        this.properties = _Defaults_js__WEBPACK_IMPORTED_MODULE_1__.Defaults.create("ResponsiveCanvas", "ResponsivePlot2D");
        this.gridScale = { x: 0, y: 0 };
        /**
         * Contains the data trace objects for the plot instance.
         * The objects can be accessed using the trace ID as the key.
         */
        this.data = {};
        _Defaults_js__WEBPACK_IMPORTED_MODULE_1__.Defaults.mergeOptions(this, "ResponsivePlot2D", options);
        this.setBackground(context => {
            const drawGridSet = (majorOrMinor, xy, ticksOrGridlines, width, lineStart, lineEnd) => {
                const offset = width % 2 === 0 ? 0 : 0.5;
                const intervalSize = this.properties[`${majorOrMinor + (ticksOrGridlines === "Ticks" ? "TickSize" : "GridSize")}`][xy];
                context.lineWidth = width;
                if (this.properties[`${majorOrMinor}${ticksOrGridlines}`][xy]) {
                    context.beginPath();
                    let currentValue = -Math.floor(this.properties.origin[xy] / (intervalSize * this.gridScale[xy])) * intervalSize * this.gridScale[xy];
                    if (xy === "x") {
                        while (currentValue < this._displayData.width - this.properties.origin.x) {
                            context.moveTo(currentValue + offset, lineStart);
                            context.lineTo(currentValue + offset, lineEnd);
                            currentValue += this.gridScale.x * intervalSize;
                        }
                    }
                    else if (xy === "y") {
                        while (currentValue < this._displayData.height - this.properties.origin.y) {
                            context.moveTo(lineStart, currentValue + offset);
                            context.lineTo(lineEnd, currentValue + offset);
                            currentValue += this.gridScale.y * intervalSize;
                        }
                    }
                    context.stroke();
                }
            };
            context.lineCap = "square";
            context.strokeStyle = "rgb(0, 0, 0)";
            drawGridSet("minor", "x", "Gridlines", 1, -this.properties.origin.y, this._displayData.height - this.properties.origin.y);
            drawGridSet("minor", "y", "Gridlines", 1, -this.properties.origin.x, this._displayData.width - this.properties.origin.x);
            drawGridSet("major", "x", "Gridlines", 2, -this.properties.origin.y, this._displayData.height - this.properties.origin.y);
            drawGridSet("major", "y", "Gridlines", 2, -this.properties.origin.x, this._displayData.width - this.properties.origin.x);
            drawGridSet("minor", "x", "Ticks", 1, -3, 3);
            drawGridSet("minor", "y", "Ticks", 1, -3, 3);
            drawGridSet("major", "x", "Ticks", 2, -6, 6);
            drawGridSet("major", "y", "Ticks", 2, -6, 6);
            context.beginPath();
            context.lineWidth = 3;
            context.moveTo(0.5, -this.properties.origin.y);
            context.lineTo(0.5, this._displayData.height - this.properties.origin.y);
            context.moveTo(-this.properties.origin.x, 0.5);
            context.lineTo(this._displayData.width - this.properties.origin.x, 0.5);
            context.stroke();
        });
    }
    resizeEventListener(entry) {
        super.resizeEventListener(entry);
        this.setXLims(...this.properties.xLims);
        this.setYLims(...this.properties.yLims);
    }
    /**
      * Updates the foreground function.
      */
    updatePlottingData() {
        this.setForeground((context, timeValue) => {
            for (const datasetID of Object.keys(this.data)) {
                if (this.data[datasetID].properties.visibility) {
                    const dataset = this.data[datasetID];
                    if (dataset.properties.traceStyle !== "none") {
                        context.strokeStyle = dataset.properties.traceColour;
                        context.lineWidth = dataset.properties.traceWidth;
                        context.lineJoin = "round";
                        switch (dataset.properties.traceStyle) {
                            case "solid":
                                context.setLineDash([]);
                                break;
                            case "dotted":
                                context.setLineDash([3, 3]);
                                break;
                            case "dashed":
                                context.setLineDash([10, 10]);
                                break;
                            case "dashdot":
                                context.setLineDash([15, 3, 3, 3]);
                                break;
                        }
                        const dataGenerator = dataset.data(timeValue, this.properties.xLims, this.properties.yLims, 0.01, dataset.properties.parameterRange);
                        context.beginPath();
                        for (const currentPoint of dataGenerator) {
                            if (!Number.isSafeInteger(Math.round(currentPoint[1]))) {
                                currentPoint[1] = currentPoint[1] > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
                            }
                            context.lineTo(currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y);
                        }
                        context.stroke();
                    }
                    if (dataset.properties.markerStyle !== "none") {
                        const markerSize = dataset.properties.markerSize;
                        context.strokeStyle = dataset.properties.markerColour;
                        context.fillStyle = dataset.properties.markerColour;
                        context.lineWidth = 2 * markerSize;
                        const drawMarker = (() => {
                            switch (dataset.properties.markerStyle) {
                                case "circle":
                                    return (context, x, y) => {
                                        context.arc(x, y, 5 * markerSize, 0, 2 * Math.PI);
                                        context.fill();
                                    };
                                case "plus":
                                    return (context, x, y) => {
                                        context.moveTo(x, y + 5 * markerSize);
                                        context.lineTo(x, y - 5 * markerSize);
                                        context.moveTo(x + 5 * markerSize, y);
                                        context.lineTo(x - 5 * markerSize, y);
                                        context.stroke();
                                    };
                                case "cross":
                                    return (context, x, y) => {
                                        context.moveTo(x + 5 * markerSize, y + 5 * markerSize);
                                        context.lineTo(x - 5 * markerSize, y - 5 * markerSize);
                                        context.moveTo(x - 5 * markerSize, y + 5 * markerSize);
                                        context.lineTo(x + 5 * markerSize, y - 5 * markerSize);
                                        context.stroke();
                                    };
                                case "arrow":
                                    return (context, x, y, theta) => {
                                        if (!isNaN(theta)) {
                                            context.translate(x, y);
                                            context.rotate(-theta - Math.PI / 2);
                                            context.moveTo(0, -7 * markerSize);
                                            context.lineTo(-5 * markerSize, 7 * markerSize);
                                            context.lineTo(5 * markerSize, 7 * markerSize);
                                            context.lineTo(0, -7 * markerSize);
                                            context.fill();
                                            context.rotate(theta + Math.PI / 2);
                                            context.translate(-x, -y);
                                        }
                                    };
                            }
                        })();
                        const dataGenerator = dataset.data(timeValue, this.properties.xLims, this.properties.yLims, 0.001, dataset.properties.parameterRange);
                        let lastPoint = [NaN, NaN];
                        for (const currentPoint of dataGenerator) {
                            context.beginPath();
                            const point = [currentPoint[0] * this.gridScale.x, -currentPoint[1] * this.gridScale.y];
                            const angle = Math.atan2(point[1] - lastPoint[1], -point[0] + lastPoint[0]);
                            drawMarker(context, ...point, angle); // TODO: fix this (typescript thinks drawMarker can be null (because the defaults aren't typed))
                            lastPoint = point;
                        }
                    }
                }
            }
        });
    }
    /**
     * Adds a data trace to the plot. The trace must be given a unique ID, so that it can be added to the
     * {@link ResponsivePlot2D.data `data`} property of the plot object.
     * There are several ways that data can be added, which can be divided into **continuous** and **discrete** data.
     * These different methods are described by what to pass for the `data` argument.
     * @param id Unique ID for the trace.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    addData(id, data, options = {}) {
        if (this.data[id] === undefined) {
            this.data[id] = new _ResponsivePlot2DTrace_js__WEBPACK_IMPORTED_MODULE_2__.ResponsivePlot2DTrace(this, data, options);
            this.updatePlottingData();
        }
        else {
            throw `Error setting plot data: trace with ID ${id} already exists on current plot, call removeData() to remove.`;
        }
    }
    /**
     * Removes a trace from the plot.
     * @param trace ID of the trace to be removed.
     */
    removeData(trace) {
        delete this.data[trace];
        this.updatePlottingData();
    }
    setOrigin(...point) {
        super.setOrigin(...point);
        if (this._displayData.parentElement !== null && this.gridScale.x > 0 && this.gridScale.y > 0) {
            this.properties.xLims = [-this.properties.origin.x / this.gridScale.x, (this._displayData.width - this.properties.origin.x) / this.gridScale.x];
            this.properties.yLims = [-(this._displayData.height - this.properties.origin.y) / this.gridScale.y, this.properties.origin.y / this.gridScale.y];
            this.updatePlottingData();
        }
    }
    /**
     * Toggles the major ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorTicks(...choices) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "majorTicks", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Toggles the minor ticks. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorTicks(...choices) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "minorTicks", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the major ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorTickSize(...sizes) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "majorTickSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the minor ticks (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorTickSize(...sizes) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "minorTickSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Toggles the major gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMajorGridlines(...choices) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "majorGridlines", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Toggles the minor gridlines. Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param choices Either one or two booleans.
     */
    setMinorGridlines(...choices) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "minorGridlines", "boolean", ...choices);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the major gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMajorGridSize(...sizes) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "majorGridSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Sets the spacing of the minor gridlines (in grid units). Two values may be passed for `x` then `y`, or just a single value for both axes.
     * @param sizes Either one or two numbers.
     */
    setMinorGridSize(...sizes) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setAxesProperty(this, "minorGridSize", "number", ...sizes);
        this.updateBackground();
    }
    /**
     * Changes the range of `x` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `x`.
     * @param max The maximum value of `x`.
     */
    setXLims(min, max) {
        if (max >= min) {
            _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setArrayProperty(this, "xLims", "number", [min, max], 2);
            this.gridScale.x = this._displayData.width / Math.abs(this.properties.xLims[0] - this.properties.xLims[1]);
            this.setOrigin(-this.properties.xLims[0] * this.gridScale.x, this.properties.origin.y);
            this.updatePlottingData();
        }
        else {
            throw `Error setting xLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    /**
     * Changes the range of `y` values to be shown on the plot by moving the origin and altering the grid scale.
     * @param min The minimum value of `y`.
     * @param max The maximum value of `y`.
     */
    setYLims(min, max) {
        if (max >= min) {
            _helpers_index_js__WEBPACK_IMPORTED_MODULE_3__.propertySetters.setArrayProperty(this, "yLims", "number", [min, max], 2);
            this.gridScale.y = this._displayData.height / Math.abs(this.properties.yLims[0] - this.properties.yLims[1]);
            this.setOrigin(this.properties.origin.x, this.properties.yLims[1] * this.gridScale.y);
            this.updatePlottingData();
        }
        else {
            throw `Error setting yLims: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
    show(element) {
        super.show(element);
        this.setXLims(...this.properties.xLims);
        this.setYLims(...this.properties.yLims);
    }
}


/***/ }),

/***/ "../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2DTrace.js":
/*!***************************************************************************************!*\
  !*** ../node_modules/@lachlandk/pulsar/dist/pulsar/plotting/ResponsivePlot2DTrace.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResponsivePlot2DTrace": () => (/* binding */ ResponsivePlot2DTrace)
/* harmony export */ });
/* harmony import */ var _helpers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/generators.js");
/* harmony import */ var _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/index.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/helpers/propertySetters.js");
/* harmony import */ var _Defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Defaults.js */ "../node_modules/@lachlandk/pulsar/dist/pulsar/Defaults.js");
// TODO: this module needs tests


/**
 *  This plot represents a trace on a {@link ResponsivePlot2D `ResponsivePlot2D`}.
 */
class ResponsivePlot2DTrace {
    /**
     * @param plot The parent plot.
     * @param data Data to be plotted.
     * @param options Optional parameters.
     */
    constructor(plot, data, options = {}) {
        this.properties = _Defaults_js__WEBPACK_IMPORTED_MODULE_0__.Defaults.create("ResponsivePlot2DTrace");
        this.plot = plot; // TODO: remove necessity for this with events?
        _Defaults_js__WEBPACK_IMPORTED_MODULE_0__.Defaults.mergeOptions(this, "ResponsivePlot2DTrace", options);
        if (Array.isArray(data) && data.length === 2) {
            if (Array.isArray(data[0])) {
                if (Array.isArray(data[1])) { // discrete points
                    if (data[0].length !== data[1].length) {
                        throw "Error setting plot data: Lengths of data arrays are not equal.";
                    }
                    for (let i = 0; i < data[0].length; i++) {
                        const xValue = typeof data[0][i] === "function" ? data[0][i](0) : data[0][i];
                        const yValue = typeof data[1][i] === "function" ? data[1][i](0, 0) : data[1][i];
                        if (typeof xValue !== "number" || typeof yValue !== "number") {
                            throw "Error setting plot data: Data arrays contain types which are not numbers.";
                        }
                    }
                    this.data = (0,_helpers_index_js__WEBPACK_IMPORTED_MODULE_1__.discreteFunctionGenerator)(data);
                }
                else if (typeof data[1] === "function") { // discrete map
                    if (typeof data[1](0, 0) !== "number") {
                        throw "Error setting plot data: Plot function does not return numbers.";
                    }
                    for (let i = 0; i < data[0].length; i++) {
                        if (typeof data[0][i] !== "number") {
                            throw "Error setting plot data: Data array contains types which are not numbers.";
                        }
                    }
                    this.data = (0,_helpers_index_js__WEBPACK_IMPORTED_MODULE_1__.discreteMapGenerator)(data);
                }
            }
            else if (typeof data[0] === "function" && typeof data[1] === "function") { // parametric function
                if (typeof data[0](0, 0) !== "number" || typeof data[1](0, 0) !== "number") {
                    throw "Error setting plot data: Plot function does not return numbers.";
                }
                this.data = (0,_helpers_index_js__WEBPACK_IMPORTED_MODULE_1__.parametricFunctionGenerator)(data);
            }
        }
        else if (typeof data === "function") { // continuous function
            if (typeof data(0, 0) !== "number") {
                throw "Error setting plot data: Plot function does not return numbers.";
            }
            this.data = (0,_helpers_index_js__WEBPACK_IMPORTED_MODULE_1__.continuousFunctionGenerator)(data);
        }
        else {
            throw `Error setting plot data: Unrecognised data signature ${data}.`;
        }
    }
    /**
     * Sets the colour of the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param colour The name of the colour.
     */
    setTraceColour(colour) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "traceColour", "string", colour);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the style of the specified trace. Possible styles are: `solid`, `dotted`, `dashed`, `dashdot`, or `none`.
     * @param style The name of the style.
     */
    setTraceStyle(style) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setChoiceProperty(this, "traceStyle", "string", style, ["solid", "dotted", "dashed", "dashdot", "none"]);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the width of the specified trace (in pixels).
     * @param width The width of the trace in pixels.
     */
    setTraceWidth(width) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "traceWidth", "number", width);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the colour of the markers on the specified trace. The specified colour must be one of the browser-recognised colours.
     * @param colour The name of the colour.
     */
    setMarkerColour(colour) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "markerColour", "string", colour);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the style of the markers the specified trace. Possible styles are: `circle`, `plus`, `cross`, `arrow`, or `none`.
     * @param style The name of the style.
     */
    setMarkerStyle(style) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setChoiceProperty(this, "markerStyle", "string", style, ["circle", "plus", "cross", "arrow", "none"]);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the width of the markers on the specified trace (in pixels).
     * @param size The size of the markers in pixels.
     */
    setMarkerSize(size) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "markerSize", "number", size);
        this.plot.updatePlottingData();
    }
    /**
     * Toggles the visibility of the specified trace.
     * @param value Set to `true` for the trace to be visible, `false` for it to be hidden.
     */
    setVisibility(value) {
        _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setSingleProperty(this, "visibility", "boolean", value);
        this.plot.updatePlottingData();
    }
    /**
     * Sets the range of values over which a parameter should be plotted.
     * This property has no effect at all if the function plotted does not have a free parameter.
     * @param min The minimum value of the free parameter.
     * @param max The maximum value of the free parameter.
     */
    setParameterRange(min, max) {
        if (max >= min) {
            _helpers_index_js__WEBPACK_IMPORTED_MODULE_2__.propertySetters.setArrayProperty(this, "parameterRange", "number", [min, max], 2);
            this.plot.updatePlottingData();
        }
        else {
            throw `Error setting parameterRange: Lower limit cannot be higher than or equal to higher limit.`;
        }
    }
}


/***/ }),

/***/ "./src/OscillatorComponent.js":
/*!************************************!*\
  !*** ./src/OscillatorComponent.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OscillatorComponent": () => (/* binding */ OscillatorComponent)
/* harmony export */ });
/* harmony import */ var _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lachlandk/pulsar */ "../node_modules/@lachlandk/pulsar/dist/pulsar/Plot.js");


class OscillatorComponent extends HTMLElement {
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

		this.phasor = new _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__.Plot(`phasor-${this.order}`, undefined, {
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
		this.wave = new _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__.Plot(`wave-${this.order}`, undefined, {
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


/***/ }),

/***/ "./src/PhasorsApp.js":
/*!***************************!*\
  !*** ./src/PhasorsApp.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhasorsApp": () => (/* binding */ PhasorsApp)
/* harmony export */ });
/* harmony import */ var _OscillatorComponent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OscillatorComponent.js */ "./src/OscillatorComponent.js");
/* harmony import */ var _ResultantOscillatorComponent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResultantOscillatorComponent.js */ "./src/ResultantOscillatorComponent.js");
/* harmony import */ var _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lachlandk/pulsar */ "../node_modules/@lachlandk/pulsar/dist/pulsar/core/TimeEvolutionController.js");
/* harmony import */ var _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lachlandk/pulsar */ "../node_modules/@lachlandk/pulsar/dist/pulsar/index.js");




class PhasorsApp extends HTMLElement {
	constructor() {
		super();

		window.customElements.define("oscillator-component", _OscillatorComponent_js__WEBPACK_IMPORTED_MODULE_0__.OscillatorComponent);
		window.customElements.define("resultant-oscillator-component", _ResultantOscillatorComponent_js__WEBPACK_IMPORTED_MODULE_1__.ResultantOscillatorComponent);
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

		this.resultantOscillator = new _ResultantOscillatorComponent_js__WEBPACK_IMPORTED_MODULE_1__.ResultantOscillatorComponent(this);
		this.insertBefore(this.resultantOscillator, this.querySelector("#header-container"));
		this.oscillatorScrollArea = this.querySelector("#oscillator-scroll-area");

		this.startButton = this.querySelector("#start-button");
		this.pauseButton = this.querySelector("#pause-button");
		this.stopButton = this.querySelector("#stop-button");
		this.startButton.addEventListener("click", () => {
			_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.startAll();
			this.animationsActive = true;
			this.startButton.disabled = true;
			this.pauseButton.disabled = false;
			this.stopButton.disabled = false;
		});
		this.pauseButton.addEventListener("click", () => {
			_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.pauseAll();
			this.animationsActive = false;
			this.startButton.disabled = false;
			this.pauseButton.disabled = true;
			this.stopButton.disabled = false;
		});
		this.stopButton.addEventListener("click", () => {
			_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.stopAll();
			this.animationsActive = false;
			this.startButton.disabled = false;
			this.pauseButton.disabled = true;
			this.stopButton.disabled = true;
		});
	}

	addOscillator(...params) {
		const oscillator = new _OscillatorComponent_js__WEBPACK_IMPORTED_MODULE_0__.OscillatorComponent(this, this.activeOscillators.length, ...params);
		this.activeOscillators.push(oscillator);
		this.oscillatorScrollArea.appendChild(oscillator);
		this.resultantOscillator.updatePlots();
		if (this.resultantOscillator.phasor.data["phasor-x-component"].properties.visibility === true) {
			oscillator.phasor.data["phasor-x-component"].setVisibility(true);
		}
	}

	removeOscillator(oscillator) {
		this.activeOscillators.splice(oscillator.order, 1);
		delete _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_3__.core.activeCanvases[`phasor-${oscillator.order}`];
		delete _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_3__.core.activeCanvases[`wave-${oscillator.order}`];
		oscillator.remove();
		for (const osc of this.activeOscillators) {
			if (osc.order > oscillator.order ) {
				osc.order -= 1;
				osc.querySelector(".oscillator-title").innerText = `Oscillator ${osc.order + 1}`;
				_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.canvasTimeData[(2 * osc.order) + 4].id = `phasor-${osc.order}`;
				_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_3__.core.activeCanvases[`phasor-${osc.order + 1}`].setID(`phasor-${osc.order}`);
				_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.canvasTimeData[(2 * osc.order) + 5].id = `wave-${osc.order}`;
				_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_3__.core.activeCanvases[`wave-${osc.order + 1}`].setID(`wave-${osc.order}`);
			}
		}
		_lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_2__.Time.canvasTimeData.splice((2 * oscillator.order) + 2, 2);
		this.resultantOscillator.updatePlots();
	}
}


/***/ }),

/***/ "./src/ResultantOscillatorComponent.js":
/*!*********************************************!*\
  !*** ./src/ResultantOscillatorComponent.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResultantOscillatorComponent": () => (/* binding */ ResultantOscillatorComponent)
/* harmony export */ });
/* harmony import */ var _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lachlandk/pulsar */ "../node_modules/@lachlandk/pulsar/dist/pulsar/Plot.js");


class ResultantOscillatorComponent extends HTMLElement {
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

		this.phasor = new _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__.Plot("resultant-phasor", undefined, {
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

		this.wave = new _lachlandk_pulsar__WEBPACK_IMPORTED_MODULE_0__.Plot("resultant-wave", {
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/* harmony import */ var _PhasorsApp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PhasorsApp.js */ "./src/PhasorsApp.js");


window.customElements.define("phasors-app", _PhasorsApp_js__WEBPACK_IMPORTED_MODULE_0__.PhasorsApp);

const app = new _PhasorsApp_js__WEBPACK_IMPORTED_MODULE_0__.PhasorsApp();
document.body.appendChild(app);

app.addOscillator();
app.addOscillator();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9waGFzb3JzLy4uL25vZGVfbW9kdWxlcy9AbGFjaGxhbmRrL3B1bHNhci9kaXN0L3B1bHNhci9EZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9waGFzb3JzLy4uL25vZGVfbW9kdWxlcy9AbGFjaGxhbmRrL3B1bHNhci9kaXN0L3B1bHNhci9QbG90LmpzIiwid2VicGFjazovL3BoYXNvcnMvLi4vbm9kZV9tb2R1bGVzL0BsYWNobGFuZGsvcHVsc2FyL2Rpc3QvcHVsc2FyL2NvcmUvUmVzcG9uc2l2ZUNhbnZhcy5qcyIsIndlYnBhY2s6Ly9waGFzb3JzLy4uL25vZGVfbW9kdWxlcy9AbGFjaGxhbmRrL3B1bHNhci9kaXN0L3B1bHNhci9jb3JlL1RpbWVFdm9sdXRpb25Db250cm9sbGVyLmpzIiwid2VicGFjazovL3BoYXNvcnMvLi4vbm9kZV9tb2R1bGVzL0BsYWNobGFuZGsvcHVsc2FyL2Rpc3QvcHVsc2FyL2NvcmUvYWN0aXZlQ2FudmFzZXMuanMiLCJ3ZWJwYWNrOi8vcGhhc29ycy8uLi9ub2RlX21vZHVsZXMvQGxhY2hsYW5kay9wdWxzYXIvZGlzdC9wdWxzYXIvaGVscGVycy9nZW5lcmF0b3JzLmpzIiwid2VicGFjazovL3BoYXNvcnMvLi4vbm9kZV9tb2R1bGVzL0BsYWNobGFuZGsvcHVsc2FyL2Rpc3QvcHVsc2FyL2hlbHBlcnMvcHJvcGVydHlTZXR0ZXJzLmpzIiwid2VicGFjazovL3BoYXNvcnMvLi4vbm9kZV9tb2R1bGVzL0BsYWNobGFuZGsvcHVsc2FyL2Rpc3QvcHVsc2FyL2luZGV4LmpzIiwid2VicGFjazovL3BoYXNvcnMvLi4vbm9kZV9tb2R1bGVzL0BsYWNobGFuZGsvcHVsc2FyL2Rpc3QvcHVsc2FyL3Bsb3R0aW5nL1Jlc3BvbnNpdmVQbG90MkQuanMiLCJ3ZWJwYWNrOi8vcGhhc29ycy8uLi9ub2RlX21vZHVsZXMvQGxhY2hsYW5kay9wdWxzYXIvZGlzdC9wdWxzYXIvcGxvdHRpbmcvUmVzcG9uc2l2ZVBsb3QyRFRyYWNlLmpzIiwid2VicGFjazovL3BoYXNvcnMvLi9zcmMvT3NjaWxsYXRvckNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly9waGFzb3JzLy4vc3JjL1BoYXNvcnNBcHAuanMiLCJ3ZWJwYWNrOi8vcGhhc29ycy8uL3NyYy9SZXN1bHRhbnRPc2NpbGxhdG9yQ29tcG9uZW50LmpzIiwid2VicGFjazovL3BoYXNvcnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGhhc29ycy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGhhc29ycy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BoYXNvcnMvLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsYUFBYTtBQUN0QztBQUNBLGFBQWE7QUFDYjtBQUNBLHlCQUF5QixhQUFhO0FBQ3RDO0FBQ0EsNkJBQTZCLG1CQUFtQjtBQUNoRCw2QkFBNkIscUJBQXFCO0FBQ2xELGdDQUFnQyxhQUFhO0FBQzdDLGdDQUFnQyxhQUFhO0FBQzdDLGlDQUFpQyxtQkFBbUI7QUFDcEQsaUNBQWlDLHFCQUFxQjtBQUN0RCxnQ0FBZ0MsYUFBYTtBQUM3QyxnQ0FBZ0MsYUFBYTtBQUM3QztBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsNEJBQTRCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELCtCQUErQixFQUFFLGdCQUFnQjtBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRnRDtBQUNOO0FBQzFDLG1CQUFtQixnRUFBZ0I7QUFDMUM7QUFDQSw2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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDNUdBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7Ozs7Ozs7QUNBNkM7O0FBRTdDLDRDQUE0QyxzREFBVTs7QUFFdEQsZ0JBQWdCLHNEQUFVO0FBQzFCOztBQUVBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETzogdGhpcyBtb2R1bGUgbmVlZHMgdGVzdHNcbmNsYXNzIGRlZmF1bHRzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB7XG4gICAgICAgICAgICBSZXNwb25zaXZlQ2FudmFzOiB7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ1NTOiBcIlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzcG9uc2l2ZVBsb3QyRDoge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogeyB4OiAwLCB5OiAwIH0sXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENTUzogXCJcIixcbiAgICAgICAgICAgICAgICBtYWpvclRpY2tzOiB7IHg6IHRydWUsIHk6IHRydWUgfSxcbiAgICAgICAgICAgICAgICBtaW5vclRpY2tzOiB7IHg6IGZhbHNlLCB5OiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgIG1ham9yVGlja1NpemU6IHsgeDogNSwgeTogNSB9LFxuICAgICAgICAgICAgICAgIG1pbm9yVGlja1NpemU6IHsgeDogMSwgeTogMSB9LFxuICAgICAgICAgICAgICAgIG1ham9yR3JpZGxpbmVzOiB7IHg6IHRydWUsIHk6IHRydWUgfSxcbiAgICAgICAgICAgICAgICBtaW5vckdyaWRsaW5lczogeyB4OiBmYWxzZSwgeTogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICBtYWpvckdyaWRTaXplOiB7IHg6IDUsIHk6IDUgfSxcbiAgICAgICAgICAgICAgICBtaW5vckdyaWRTaXplOiB7IHg6IDEsIHk6IDEgfSxcbiAgICAgICAgICAgICAgICB4TGltczogWzAsIDEwXSxcbiAgICAgICAgICAgICAgICB5TGltczogWy0xMCwgMF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNwb25zaXZlUGxvdDJEVHJhY2U6IHtcbiAgICAgICAgICAgICAgICB0cmFjZUNvbG91cjogXCJibHVlXCIsXG4gICAgICAgICAgICAgICAgdHJhY2VTdHlsZTogXCJzb2xpZFwiLFxuICAgICAgICAgICAgICAgIHRyYWNlV2lkdGg6IDMsXG4gICAgICAgICAgICAgICAgbWFya2VyQ29sb3VyOiBcImJsdWVcIixcbiAgICAgICAgICAgICAgICBtYXJrZXJTdHlsZTogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgbWFya2VyU2l6ZTogMSxcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlclJhbmdlOiBbMCwgMV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gc3RhdGljIHNldERlZmF1bHQocHJvdG86IHtbcHJvcGVydHk6IHN0cmluZ106IHVua25vd259LCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICAvLyAgICAgcHJvdG9bcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIC8vIH1cbiAgICB9XG4gICAgY3JlYXRlKC4uLnByb3Rvcykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgLi4uQXJyYXkuZnJvbShwcm90b3MsIChwcm90bykgPT4gdGhpcy52YWx1ZXNbcHJvdG9dKSk7XG4gICAgfVxuICAgIG1lcmdlT3B0aW9ucyhpbnN0YW5jZSwgdHlwZSwgb3B0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBPYmplY3Qua2V5cyhvcHRpb25zKSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbiBpbiB0aGlzLnZhbHVlc1t0eXBlXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNldHRlckZ1bmMgPSBpbnN0YW5jZVtgc2V0JHtvcHRpb24uY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtvcHRpb24uc2xpY2UoMSl9YF07XG4gICAgICAgICAgICAgICAgaWYgKHNldHRlckZ1bmMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0ZXJGdW5jLmNhbGwoaW5zdGFuY2UsIC4uLihBcnJheS5pc0FycmF5KG9wdGlvbnNbb3B0aW9uXSkgPyBvcHRpb25zW29wdGlvbl0gOiBbb3B0aW9uc1tvcHRpb25dXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBEZWZhdWx0cyA9IG5ldyBkZWZhdWx0cygpO1xuIiwiaW1wb3J0IHsgUmVzcG9uc2l2ZVBsb3QyRCB9IGZyb20gXCIuL3Bsb3R0aW5nL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBhY3RpdmVDYW52YXNlcyB9IGZyb20gXCIuL2NvcmUvaW5kZXguanNcIjtcbmV4cG9ydCBjbGFzcyBQbG90IGV4dGVuZHMgUmVzcG9uc2l2ZVBsb3QyRCB7XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgYWN0aXZlIGluc3RhbmNlcyBvZiB7QGxpbmsgUGxvdCBgUGxvdGB9LlxuICAgICAqL1xuICAgIHN0YXRpYyBhY3RpdmVQbG90cygpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlUGxvdHMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBjYW52YXNJRCBvZiBPYmplY3Qua2V5cyhhY3RpdmVDYW52YXNlcykpIHtcbiAgICAgICAgICAgIGlmIChhY3RpdmVDYW52YXNlc1tjYW52YXNJRF0gaW5zdGFuY2VvZiBQbG90KSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlUGxvdHNbY2FudmFzSURdID0gYWN0aXZlQ2FudmFzZXNbY2FudmFzSURdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY3RpdmVQbG90cztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkIC0gVGhlIElEIG9mIHRoZSBwbG90IG9iamVjdC4gTXVzdCBiZSB1bmlxdWUuXG4gICAgICogQHBhcmFtIGRhdGEgLSBUaGUgZGF0YSB0byBiZSBwbG90dGVkLiBUaGUgc3RydWN0dXJlIG9mIHRoZSBvYmplY3QgZm9sbG93cyB0aGUgZXhhY3Qgc2FtZSBwYXR0ZXJuIGFzIHRoZSBzaWduYXR1cmUgb2Yge0BsaW5rIFJlc3BvbnNpdmVQbG90MkQucGxvdCBgcGxvdCgpYH0uXG4gICAgICogQHBhcmFtIGRhdGEuaWQgLSBUaGUgSUQgZm9yIHRoZSB0cmFjZS4gVGhpcyBJRCB3aWxsIGJlIHRoZSBrZXkgZm9yIHRoZSByZWxldmFudCBlbnRyeSBpbiB0aGUge0BsaW5rIFJlc3BvbnNpdmVQbG90MkQuZGF0YSBgZGF0YWB9IHByb3BlcnR5IG9mIHRoZSBwbG90IG9iamVjdC5cbiAgICAgKiBAcGFyYW0gZGF0YS5kYXRhIC0gVGhlIGRhdGEgdG8gYmUgcGxvdHRlZC4gU2VlIHRoZSB7QGxpbmsgUmVzcG9uc2l2ZVBsb3QyRC5wbG90IGBwbG90KClgfSBtZXRob2QgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAqIEBwYXJhbSBkYXRhLm9iamVjdCAtIFRoZSBvcHRpb25zIGZvciB0aGUgZGF0YS4gU2VlIHRoZSB7QGxpbmsgUmVzcG9uc2l2ZVBsb3QyRC5wbG90IGBwbG90KClgfSBtZXRob2QgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIHBsb3QuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaWQsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcihpZCwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkRGF0YShkYXRhLmlkLCBkYXRhLmRhdGEsIGRhdGEub3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBwcm9wZXJ0eVNldHRlcnMgfSBmcm9tIFwiLi4vaGVscGVycy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgYWN0aXZlQ2FudmFzZXMgfSBmcm9tIFwiLi9hY3RpdmVDYW52YXNlcy5qc1wiO1xuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vRGVmYXVsdHMuanNcIjtcbmltcG9ydCB7IFRpbWUgfSBmcm9tIFwiLi9UaW1lRXZvbHV0aW9uQ29udHJvbGxlci5qc1wiO1xuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGJhc2UgY2FudmFzIG9iamVjdCB3aGljaCBhbGwgb3RoZXIgUHVsc2FyIGNhbnZhcyBvYmplY3RzIGluaGVyaXQgZnJvbS5cbiAqIFRoaXMgY2xhc3MgaXMgbm90IG1lYW50IHRvIGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseSBieSBhIHVzZXIsIG1haW5seSBiZWNhdXNlIGl0IGlzIG5vdCB2ZXJ5IHVzZWZ1bCBieSBpdHNlbGYuXG4gKiBIb3dldmVyLCBpdCBkb2VzIHByb3ZpZGUgYSBsb3Qgb2YgdXNlZnVsIGZ1bmN0aW9uYWxpdHkgd2hpY2ggaXMgdXNlZCBieSBzdWJjbGFzc2VzLlxuICogQSBgUmVzcG9uc2l2ZUNhbnZhc2AgaW5zdGFuY2UgaGFzIHR3byBkcmF3aW5nIHN1cmZhY2VzLCBhIGJhY2tncm91bmQgYW5kIGEgZm9yZWdyb3VuZC5cbiAqIFRoZXNlIGRyYXdpbmcgc3VyZmFjZXMgY2FuIGJlIGFkZGVkIHRvIHRoZSBIVE1MIHBhZ2UgYXMgY2FudmFzIGVsZW1lbnRzIGJ5IGNhbGxpbmcgYHNob3dgLlxuICogVGhlc2UgY2FudmFzZXMgd2lsbCB0aGVuIGZpbGwgdGhlIGNvbnRhaW5lciBlbGVtZW50LCBhbmQgZXZlbiBjaGFuZ2UgdGhlaXIgc2l6ZSB3aGVuIHRoZSBjb250YWluZXIgZWxlbWVudCBpcyByZXNpemVkLlxuICogVGhlIGNvb3JkaW5hdGUgb3JpZ2luIG9mIGEgUmVzcG9uc2l2ZUNhbnZhcyBjYW4gYmUgY2hhbmdlZCB3aXRoIGBzZXRPcmlnaW5gLCBhbmQgaXQgY2FuIGJlIGRyYXduIG9uIGFuZCBhbmltYXRlZFxuICogYnkgcGFzc2luZyBhIGRyYXdpbmcgZnVuY3Rpb24gdG8gYHNldEJhY2tncm91bmRgIG9yIGBzZXRGb3JlZ3JvdW5kYC4gUmVhZC1vbmx5IHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgYmVnaW5uaW5nIHdpdGhcbiAqIGFuIHVuZGVyc2NvcmUgc2hvdWxkIG5vdCBiZSBjaGFuZ2VkL2NhbGxlZCwgb3RoZXJ3aXNlIHRoZXkgbWF5IGNhdXNlIHVucHJlZGljdGFibGUgYmVoYXZpb3VyLlxuICovXG5leHBvcnQgY2xhc3MgUmVzcG9uc2l2ZUNhbnZhcyB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkIFRoZSBJRCBvZiB0aGUgY2FudmFzIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAgT3B0aW9uYWwgcGFyYW1ldGVycy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdW5pcXVlIElEIGZvciB0aGUgY2FudmFzIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaWQgPSBcIlwiO1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IERlZmF1bHRzLmNyZWF0ZShcIlJlc3BvbnNpdmVDYW52YXNcIik7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVWYWx1ZSA9IDA7XG4gICAgICAgIC8vIFRPRE86IGFkZCBjaGlsZCBvYmplY3RzIHRvIG9wdGlvbnMgdG8gYWxsb3cgbW9yZSBvcHRpb25zXG4gICAgICAgIGNvbnN0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNhbnZhc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJncmlkXCI7XG4gICAgICAgIGNhbnZhc0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICBjYW52YXNDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIGNvbnN0IGJhY2tncm91bmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICBiYWNrZ3JvdW5kQ2FudmFzLnN0eWxlLmdyaWRBcmVhID0gXCIxIC8gMVwiO1xuICAgICAgICBjb25zdCBmb3JlZ3JvdW5kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgZm9yZWdyb3VuZENhbnZhcy5zdHlsZS5ncmlkQXJlYSA9IFwiMSAvIDFcIjtcbiAgICAgICAgY2FudmFzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJhY2tncm91bmRDYW52YXMpO1xuICAgICAgICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQoZm9yZWdyb3VuZENhbnZhcyk7XG4gICAgICAgIGNvbnN0IHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVFdmVudExpc3RlbmVyKGVudHJ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZvcmVncm91bmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoY2FudmFzQ29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5fZGlzcGxheURhdGEgPSB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIG9yaWdpbkFyZ0NhY2hlOiBudWxsLFxuICAgICAgICAgICAgcGFyZW50RWxlbWVudDogbnVsbCxcbiAgICAgICAgICAgIHJlc2l6ZU9ic2VydmVyOiByZXNpemVPYnNlcnZlcixcbiAgICAgICAgICAgIGNhbnZhc0NvbnRhaW5lcjogY2FudmFzQ29udGFpbmVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZENhbnZhczogYmFja2dyb3VuZENhbnZhcyxcbiAgICAgICAgICAgIGZvcmVncm91bmRDYW52YXM6IGZvcmVncm91bmRDYW52YXMsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBiYWNrZ3JvdW5kQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKSxcbiAgICAgICAgICAgIGZvcmVncm91bmQ6IGZvcmVncm91bmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxuICAgICAgICAgICAgYmFja2dyb3VuZEZ1bmN0aW9uOiAoKSA9PiB7IH0sXG4gICAgICAgICAgICBmb3JlZ3JvdW5kRnVuY3Rpb246ICgpID0+IHsgfVxuICAgICAgICB9O1xuICAgICAgICBUaW1lLmFkZE9iamVjdChpZCk7XG4gICAgICAgIHRoaXMuc2V0SUQoaWQpO1xuICAgICAgICBEZWZhdWx0cy5tZXJnZU9wdGlvbnModGhpcywgXCJSZXNwb25zaXZlQ2FudmFzXCIsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXNpemVFdmVudExpc3RlbmVyKGVudHJ5KSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoID0gZW50cnkudGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5oZWlnaHQgPSBlbnRyeS50YXJnZXQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5iYWNrZ3JvdW5kQ2FudmFzLndpZHRoID0gdGhpcy5fZGlzcGxheURhdGEud2lkdGg7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmJhY2tncm91bmRDYW52YXMuaGVpZ2h0ID0gdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0O1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5mb3JlZ3JvdW5kQ2FudmFzLndpZHRoID0gdGhpcy5fZGlzcGxheURhdGEud2lkdGg7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmZvcmVncm91bmRDYW52YXMuaGVpZ2h0ID0gdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0O1xuICAgICAgICBpZiAodGhpcy5fZGlzcGxheURhdGEub3JpZ2luQXJnQ2FjaGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luKHRoaXMuX2Rpc3BsYXlEYXRhLm9yaWdpbkFyZ0NhY2hlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5iYWNrZ3JvdW5kLnRyYW5zbGF0ZSh0aGlzLnByb3BlcnRpZXMub3JpZ2luLngsIHRoaXMucHJvcGVydGllcy5vcmlnaW4ueSk7IC8vIGJlY2F1c2UgY2hhbmdpbmcgdGhlIHNpemUgb2YgYSBjYW52YXMgcmVzZXRzIGl0XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmZvcmVncm91bmQudHJhbnNsYXRlKHRoaXMucHJvcGVydGllcy5vcmlnaW4ueCwgdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICAqIFVwZGF0ZXMgdGhlIGJhY2tncm91bmQuXG4gICAgICAqL1xuICAgIHVwZGF0ZUJhY2tncm91bmQoKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmJhY2tncm91bmQuY2xlYXJSZWN0KC10aGlzLnByb3BlcnRpZXMub3JpZ2luLngsIC10aGlzLnByb3BlcnRpZXMub3JpZ2luLnksIHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoLCB0aGlzLl9kaXNwbGF5RGF0YS5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5iYWNrZ3JvdW5kRnVuY3Rpb24odGhpcy5fZGlzcGxheURhdGEuYmFja2dyb3VuZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAgKiBVcGRhdGVzIHRoZSBmb3JlZ3JvdW5kLlxuICAgICAgKi9cbiAgICB1cGRhdGVGb3JlZ3JvdW5kKCkge1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5mb3JlZ3JvdW5kLmNsZWFyUmVjdCgtdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54LCAtdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55LCB0aGlzLl9kaXNwbGF5RGF0YS53aWR0aCwgdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fZGlzcGxheURhdGEuZm9yZWdyb3VuZEZ1bmN0aW9uKHRoaXMuX2Rpc3BsYXlEYXRhLmZvcmVncm91bmQsIHRoaXMuY3VycmVudFRpbWVWYWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gZm9yIHRoZSBiYWNrZ3JvdW5kIGNhbnZhcyB0byBgZHJhd2luZ0Z1bmN0aW9uYCBhbmQgdXBkYXRlcyB0aGUgY2FudmFzLlxuICAgICAqIFRoZSBhcmd1bWVudCBgZHJhd2luZ0Z1bmN0aW9uYCBzaG91bGQgYmUgYSBmdW5jdGlvbiB3aGljaCB0YWtlcyBvbmUgb3IgdHdvIGFyZ3VtZW50cyBvZiBpdHMgb3duLCB0aGUgZmlyc3QgYmVpbmcgdGhlXG4gICAgICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgYENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRGB9IGZvciB0aGUgYmFja2dyb3VuZCxcbiAgICAgKiBhbmQgdGhlIHNlY29uZCAod2hpY2ggaXMgb3B0aW9uYWwpIGJlaW5nIHRoZSBjdXJyZW50IHRpbWUgZXZvbHV0aW9uIHZhbHVlIGZvciB0aGUgY2FudmFzIG9iamVjdCAoaW4gc2Vjb25kcykuXG4gICAgICogQHBhcmFtIGRyYXdpbmdGdW5jdGlvbiBUaGUgZnVuY3Rpb24gd2hpY2ggZHJhd3MgdGhlIGJhY2tncm91bmQuXG4gICAgICovXG4gICAgc2V0QmFja2dyb3VuZChkcmF3aW5nRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fZGlzcGxheURhdGEuYmFja2dyb3VuZEZ1bmN0aW9uID0gZHJhd2luZ0Z1bmN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgZHJhd2luZyBmdW5jdGlvbiBmb3IgdGhlIGZvcmVncm91bmQgY2FudmFzIHRvIGBkcmF3aW5nRnVuY3Rpb25gIGFuZCB1cGRhdGVzIHRoZSBjYW52YXMuXG4gICAgICogVGhlIGFyZ3VtZW50IGBkcmF3aW5nRnVuY3Rpb25gIHNob3VsZCBiZSBhIGZ1bmN0aW9uIHdoaWNoIHRha2VzIG9uZSBvciB0d28gYXJndW1lbnRzIG9mIGl0cyBvd24sIHRoZSBmaXJzdCBiZWluZyB0aGVcbiAgICAgKiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEYH0gZm9yIHRoZSBiYWNrZ3JvdW5kLFxuICAgICAqIGFuZCB0aGUgc2Vjb25kICh3aGljaCBpcyBvcHRpb25hbCkgYmVpbmcgdGhlIGN1cnJlbnQgdGltZSBldm9sdXRpb24gdmFsdWUgZm9yIHRoZSBjYW52YXMgb2JqZWN0IChpbiBzZWNvbmRzKS5cbiAgICAgKiBUaGUgc2Vjb25kIGFyZ3VtZW50IG5lZWQgb25seSBzcGVjaWZpZWQgaWYgdGhlIGRyYXdpbmcgZnVuY3Rpb24gY29udGFpbnMgYW5pbWF0aW9ucyB3aGljaCBkZXBlbmQgb24gdGhlIGN1cnJlbnRcbiAgICAgKiB0aW1lIHZhbHVlLlxuICAgICAqIEBwYXJhbSBkcmF3aW5nRnVuY3Rpb24gVGhlIGZ1bmN0aW9uIHdoaWNoIGRyYXdzIHRoZSBmb3JlZ3JvdW5kLlxuICAgICAqL1xuICAgIHNldEZvcmVncm91bmQoZHJhd2luZ0Z1bmN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmZvcmVncm91bmRGdW5jdGlvbiA9IGRyYXdpbmdGdW5jdGlvbjtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JlZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG9yaWdpbiBvZiBib3RoIGNhbnZhc2VzIHRvIHRoZSBwb2ludDJEIHNwZWNpZmllZCAoaW4gcGl4ZWxzKS5cbiAgICAgKiBUd28gdmFsdWVzIG1heSBiZSBwYXNzZWQgZm9yIGB4YCB0aGVuIGB5YCwgb3Igb25lIHZhbHVlIG1heSBiZSBwYXNzZWQgdG8gc2V0IHRoZSBvcmlnaW5zIG9mIGJvdGggYXhlcyB0byB0aGUgc2FtZSB2YWx1ZS5cbiAgICAgKiBUaGUgc3RyaW5nIGBcImNlbnRyZVwiYCBtYXkgYWxzbyBiZSBwYXNzZWQgdG8gY29udmVuaWVudGx5IHNldCB0aGUgb3JpZ2luIHRvIHRoZSBtaWRkbGUgb2YgdGhlIGNhbnZhcy5cbiAgICAgKiBOb3RlIHRoYXQgZm9yIHRoZSBIVE1MNSBjYW52YXMgdGhlIG9yaWdpbiBpcyBpbiB0aGUgdG9wLWxlZnQgY29ybmVyIGJ5IGRlZmF1bHQgYW5kIHRoZSB4LWF4aXMgcG9pbnRzIHJpZ2h0d2FyZHMsXG4gICAgICogd2hpbGUgdGhlIHktYXhpcyBwb2ludHMgZG93bndhcmRzLlxuICAgICAqIEBwYXJhbSBwb2ludFxuICAgICAqL1xuICAgIHNldE9yaWdpbiguLi5wb2ludCkge1xuICAgICAgICBpZiAocG9pbnQubGVuZ3RoID09PSAxICYmIHBvaW50WzBdID09PSBcImNlbnRyZVwiKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0QXhlc1Byb3BlcnR5KHRoaXMsIFwib3JpZ2luXCIsIFwibnVtYmVyXCIsIE1hdGgucm91bmQodGhpcy5fZGlzcGxheURhdGEud2lkdGggLyAyKSwgTWF0aC5yb3VuZCh0aGlzLl9kaXNwbGF5RGF0YS5oZWlnaHQgLyAyKSk7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5vcmlnaW5BcmdDYWNoZSA9IHBvaW50WzBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldEF4ZXNQcm9wZXJ0eSh0aGlzLCBcIm9yaWdpblwiLCBcIm51bWJlclwiLCAuLi5wb2ludCk7XG4gICAgICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5vcmlnaW5BcmdDYWNoZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlzcGxheURhdGEuYmFja2dyb3VuZC5yZXNldFRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5iYWNrZ3JvdW5kLnRyYW5zbGF0ZSh0aGlzLnByb3BlcnRpZXMub3JpZ2luLngsIHRoaXMucHJvcGVydGllcy5vcmlnaW4ueSk7XG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZCgpO1xuICAgICAgICB0aGlzLl9kaXNwbGF5RGF0YS5mb3JlZ3JvdW5kLnJlc2V0VHJhbnNmb3JtKCk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmZvcmVncm91bmQudHJhbnNsYXRlKHRoaXMucHJvcGVydGllcy5vcmlnaW4ueCwgdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KTtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JlZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIElEIG9mIHRoZSBjYW52YXMgb2JqZWN0IHRvIHRoZSB2YWx1ZSBzcGVjaWZpZWQsXG4gICAgICogd2hpY2ggY2Fubm90IGJlIHRoZSBzYW1lIGFzIGFub3RoZXIgZXhpc3RpbmcgY2FudmFzIG9iamVjdC5cbiAgICAgKiBJZiB0aGUgY2FudmFzIG9iamVjdCBpcyBhY3RpdmUgb24gYW4gSFRNTCBwYWdlLCBhbGwgb2YgaXRzIGVsZW1lbnRzIHdpbGwgaGF2ZSB0aGVpciBgSURgcyB1cGRhdGVkLlxuICAgICAqIEBwYXJhbSBpZCBOZXcgSUQgZm9yIHRoZSBjYW52YXMgb2JqZWN0LlxuICAgICAqL1xuICAgIHNldElEKGlkKSB7XG4gICAgICAgIGlmIChhY3RpdmVDYW52YXNlc1tpZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGVsZXRlIGFjdGl2ZUNhbnZhc2VzW3RoaXMuaWRdO1xuICAgICAgICAgICAgVGltZS5jYW52YXNUaW1lRGF0YS5maW5kKG9iamVjdCA9PiBvYmplY3QuaWQgPT09IGlkKS5pZCA9IGlkO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICAgICAgYWN0aXZlQ2FudmFzZXNbdGhpcy5pZF0gPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgYEVycm9yIGNyZWF0aW5nIFJlc3BvbnNpdmVDYW52YXMgb2JqZWN0OiBPYmplY3Qgd2l0aCBJRCBcIiR7aWR9XCIgYWxyZWFkeSBleGlzdHMuYDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBgYmFja2dyb3VuZGAgQ1NTIHByb3BlcnR5IG9mIHRoZSBiYWNrZ3JvdW5kIGNhbnZhcyB0byB0aGUgc3RyaW5nIHBhc3NlZCBpbi5cbiAgICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHNldCB0aGUgYmFja2dyb3VuZCBmb3IgdGhlIGNhbnZhcyBvYmplY3QgdG8gYSBwbGFpbiBjb2xvdXIsIGdyYWRpZW50IHBhdHRlcm4gb3IgaW1hZ2VcbiAgICAgKiAoYnkgZGVmYXVsdCB0aGUgYmFja2dyb3VuZCBpcyB0cmFuc3BhcmVudCkuXG4gICAgICogQHBhcmFtIGNzc1N0cmluZyBBIHZhbGlkIHN0cmluZyBmb3IgdGhlIENTUyB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL2JhY2tncm91bmQgYGJhY2tncm91bmRgfSBwcm9wZXJ0eS5cbiAgICAgKi9cbiAgICBzZXRCYWNrZ3JvdW5kQ1NTKGNzc1N0cmluZykge1xuICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0U2luZ2xlUHJvcGVydHkodGhpcywgXCJiYWNrZ3JvdW5kQ1NTXCIsIFwic3RyaW5nXCIsIGNzc1N0cmluZyk7XG4gICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLmJhY2tncm91bmRDYW52YXMuc3R5bGUuYmFja2dyb3VuZCA9IGNzc1N0cmluZztcbiAgICB9XG4gICAgLy8gLyoqXG4gICAgLy8gICogU3RhcnRzIG9yIHJlc3VtZXMgdGhlIHRpbWUgZXZvbHV0aW9uIG9mIHRoZSBmb3JlZ3JvdW5kLlxuICAgIC8vICAqL1xuICAgIC8vIHN0YXJ0VGltZSgpIHt9XG4gICAgLy8gLyoqXG4gICAgLy8gICogUGF1c2VzIHRoZSB0aW1lIGV2b2x1dGlvbiBvZiB0aGUgZm9yZWdyb3VuZC5cbiAgICAvLyAgKi9cbiAgICAvLyBwYXVzZVRpbWUoKSB7fVxuICAgIC8vIC8qKlxuICAgIC8vICAqIFN0b3BzIHRoZSB0aW1lIGV2b2x1dGlvbiBvZiB0aGUgZm9yZWdyb3VuZCBhbmQgcmVzZXRzIHRoZSBjdXJyZW50IHRpbWVzdGFtcCB0byAwLlxuICAgIC8vICAqL1xuICAgIC8vIHN0b3BUaW1lKCkge31cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IHRoZSBjYW52YXMgb2JqZWN0IGluIGFuIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqL1xuICAgIHNob3coZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLnBhcmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheURhdGEucGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXlEYXRhLnBhcmVudEVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fZGlzcGxheURhdGEuY2FudmFzQ29udGFpbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoID0gdGhpcy5fZGlzcGxheURhdGEuY2FudmFzQ29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0ID0gdGhpcy5fZGlzcGxheURhdGEuY2FudmFzQ29udGFpbmVyLmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9kaXNwbGF5RGF0YS5vcmlnaW5BcmdDYWNoZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luKHRoaXMuX2Rpc3BsYXlEYXRhLm9yaWdpbkFyZ0NhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZENTUyh0aGlzLnByb3BlcnRpZXMuYmFja2dyb3VuZENTUyk7IC8vIFRPRE86IHNob3VsZG4ndCBoYXZlIHRvIGNhbGwgdGhpcyBhZ2FpblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgYEhUTUxFbGVtZW50IHdpdGggcXVlcnlTZWxlY3RvciBcIiR7ZWxlbWVudH1cIiBjb3VsZCBub3QgYmUgZm91bmQuYDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICBpZiAodGhpcy5fZGlzcGxheURhdGEucGFyZW50RWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheURhdGEucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLl9kaXNwbGF5RGF0YS5jYW52YXNDb250YWluZXIpO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheURhdGEucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBUT0RPOiB0aGlzIG1vZHVsZSBuZWVkcyB0ZXN0c1xuaW1wb3J0IHsgYWN0aXZlQ2FudmFzZXMgfSBmcm9tIFwiLi9hY3RpdmVDYW52YXNlcy5qc1wiO1xuY2xhc3MgVGltZUV2b2x1dGlvbkNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNhbnZhc1RpbWVEYXRhID0gW107XG4gICAgICAgIHRoaXMuZ2xvYmFsTG9vcEFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZXN0YW1wID0gMDtcbiAgICAgICAgdGhpcy5vZmZzZXRUaW1lc3RhbXAgPSAwO1xuICAgIH1cbiAgICBzdGFydEFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2YgdGhpcy5jYW52YXNUaW1lRGF0YSkge1xuICAgICAgICAgICAgb2JqZWN0LnRpbWVFdm9sdXRpb25BY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lc3RhbXAgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdGhpcy5nbG9iYWxMb29wQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lc3RhbXAgPT4gdGhpcy51cGRhdGVPYmplY3RzKHRpbWVzdGFtcCkpO1xuICAgIH1cbiAgICBwYXVzZUFsbCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2YgdGhpcy5jYW52YXNUaW1lRGF0YSkge1xuICAgICAgICAgICAgb2JqZWN0LnRpbWVFdm9sdXRpb25BY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9mZnNldFRpbWVzdGFtcCA9IHRoaXMub2Zmc2V0VGltZXN0YW1wICsgcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLnN0YXJ0VGltZXN0YW1wO1xuICAgIH1cbiAgICBzdG9wQWxsKCkge1xuICAgICAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiB0aGlzLmNhbnZhc1RpbWVEYXRhKSB7XG4gICAgICAgICAgICBvYmplY3QudGltZUV2b2x1dGlvbkFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgYWN0aXZlQ2FudmFzZXNbb2JqZWN0LmlkXS5jdXJyZW50VGltZVZhbHVlID0gMDtcbiAgICAgICAgICAgIGFjdGl2ZUNhbnZhc2VzW29iamVjdC5pZF0udXBkYXRlRm9yZWdyb3VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lc3RhbXAgPSAwO1xuICAgICAgICB0aGlzLm9mZnNldFRpbWVzdGFtcCA9IDA7XG4gICAgICAgIHRoaXMuZ2xvYmFsTG9vcEFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgICB1cGRhdGVPYmplY3RzKGN1cnJlbnRUaW1lc3RhbXApIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xvYmFsTG9vcEFjdGl2ZSkge1xuICAgICAgICAgICAgbGV0IGF0TGVhc3RPbmVBY3RpdmVDYW52YXMgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIHRoaXMuY2FudmFzVGltZURhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0LnRpbWVFdm9sdXRpb25BY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXRMZWFzdE9uZUFjdGl2ZUNhbnZhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbnZhc2VzW29iamVjdC5pZF0uY3VycmVudFRpbWVWYWx1ZSA9ICh0aGlzLm9mZnNldFRpbWVzdGFtcCArIGN1cnJlbnRUaW1lc3RhbXAgLSB0aGlzLnN0YXJ0VGltZXN0YW1wKSAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbnZhc2VzW29iamVjdC5pZF0udXBkYXRlRm9yZWdyb3VuZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhdExlYXN0T25lQWN0aXZlQ2FudmFzKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lc3RhbXAgPT4gdGhpcy51cGRhdGVPYmplY3RzKHRpbWVzdGFtcCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxMb29wQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkT2JqZWN0KGlkLCBzeW5jID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5jYW52YXNUaW1lRGF0YS5maW5kKG9iamVjdCA9PiBvYmplY3QuaWQgPT09IGlkKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhc1RpbWVEYXRhLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB0aW1lRXZvbHV0aW9uQWN0aXZlOiBzeW5jLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBgRXJyb3I6IFRpbWUgZGF0YSBmb3IgY2FudmFzIG9iamVjdCB3aXRoIElEIFwiJHtpZH1cIiBhbHJlYWR5IGV4aXN0cy5gO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFRpbWUgPSBuZXcgVGltZUV2b2x1dGlvbkNvbnRyb2xsZXIoKTtcbiIsIi8qKlxuICogT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFjdGl2ZSBjYW52YXMgb2JqZWN0cyB3aXRoIHRoZWlyIElEIGFzIHRoZSBrZXlzLiBJdCBpcyB1c2VkXG4gKiBpbnRlcm5hbGx5IGJ5IG90aGVyIG9iamVjdHMuXG4gKi9cbmV4cG9ydCBjb25zdCBhY3RpdmVDYW52YXNlcyA9IHt9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGNvbnRpbnVvdXNGdW5jdGlvbkdlbmVyYXRvcihmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKiAodCwgeExpbXMsIHlMaW1zLCBzdGVwKSB7XG4gICAgICAgIC8vIFRPRE86IGRpc2NvbnRpbnVpdGllc1xuICAgICAgICBsZXQgeCA9IHhMaW1zWzBdO1xuICAgICAgICBsZXQgeSA9ICh4KSA9PiBmdW5jKHgsIHQpO1xuICAgICAgICB3aGlsZSAoeCA8PSB4TGltc1sxXSkge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHsgLy8gd2hpbGUgeSBpcyBvdXQgb2YgcmFuZ2Ugb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgaWYgKHggPiB4TGltc1sxXSkgeyAvLyBpZiB4IGlzIG91dCBvZiByYW5nZSwgYnJlYWsgd2l0aG91dCB5aWVsZGluZyBwcmV2aW91cyBwb2ludDJEXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh5KHgpIDw9IHlMaW1zWzFdICYmIHkoeCkgPj0geUxpbXNbMF0gJiYgIU51bWJlci5pc05hTih5KHgpKSkgeyAvLyBpZiB5IGlzIGluIHJhbmdlLCB5aWVsZCB0aGUgcHJldmlvdXMgcG9pbnQyRCBhbmQgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgW3ggLSBzdGVwLCB5KHggLSBzdGVwKV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gZWxzZSBpbmNyZW1lbnQgeFxuICAgICAgICAgICAgICAgICAgICB4ICs9IHN0ZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHsgLy8gd2hpbGUgeSBpbiBpbiByYW5nZSBhbmQgZGVmaW5lZFxuICAgICAgICAgICAgICAgIHlpZWxkIFt4LCB5KHgpXTtcbiAgICAgICAgICAgICAgICBpZiAoeCA+IHhMaW1zWzFdIHx8IHkoeCkgPiB5TGltc1sxXSB8fCB5KHgpIDwgeUxpbXNbMF0gfHwgTnVtYmVyLmlzTmFOKHkoeCkpKSB7IC8vIGlmIHggb3IgeSBpcyBvdXQgb2YgcmFuZ2UsIHlpZWxkIGN1cnJlbnQgcG9pbnQyRCBhbmQgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvLyBlbHNlIGluY3JlbWVudCB4XG4gICAgICAgICAgICAgICAgICAgIHggKz0gc3RlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFtZXRyaWNGdW5jdGlvbkdlbmVyYXRvcihkYXRhKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKiAodCwgeExpbXMsIHlMaW1zLCBzdGVwLCBwYXJhbUxpbXMpIHtcbiAgICAgICAgbGV0IHggPSAocCkgPT4gZGF0YVswXShwLCB0KTtcbiAgICAgICAgbGV0IHkgPSAocCkgPT4gZGF0YVsxXShwLCB0KTtcbiAgICAgICAgbGV0IHAgPSBwYXJhbUxpbXNbMF07XG4gICAgICAgIHdoaWxlIChwIDw9IHBhcmFtTGltc1sxXSkge1xuICAgICAgICAgICAgeWllbGQgW3gocCksIHkocCldO1xuICAgICAgICAgICAgcCArPSBzdGVwO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIFt4KHApLCB5KHApXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpc2NyZXRlTWFwR2VuZXJhdG9yKGRhdGEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24qICh0KSB7XG4gICAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciBOYU5cbiAgICAgICAgZm9yIChjb25zdCB4IG9mIGRhdGFbMF0pIHtcbiAgICAgICAgICAgIHlpZWxkIFt4LCBkYXRhWzFdKHgsIHQpXTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZGlzY3JldGVGdW5jdGlvbkdlbmVyYXRvcihkYXRhKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKiAodCkge1xuICAgICAgICAvLyBUT0RPOiBhZGQgc3VwcG9ydCBmb3IgTmFOXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgeFZhbHVlID0gdHlwZW9mIGRhdGFbMF1baV0gPT09IFwiZnVuY3Rpb25cIiA/IGRhdGFbMF1baV0odCkgOiBkYXRhWzBdW2ldO1xuICAgICAgICAgICAgY29uc3QgeVZhbHVlID0gdHlwZW9mIGRhdGFbMV1baV0gPT09IFwiZnVuY3Rpb25cIiA/IGRhdGFbMV1baV0oeFZhbHVlLCB0KSA6IGRhdGFbMV1baV07XG4gICAgICAgICAgICB5aWVsZCBbeFZhbHVlLCB5VmFsdWVdO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImV4cG9ydCBjb25zdCBwcm9wZXJ0eVNldHRlcnMgPSB7XG4gICAgc2V0QXhlc1Byb3BlcnR5KGluc3RhbmNlLCBwcm9wZXJ0eSwgZXhwZWN0ZWRUeXBlLCAuLi52YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHZhbHVlc1swXSA9PT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHtcbiAgICAgICAgICAgICAgICB4OiB2YWx1ZXNbMF0sXG4gICAgICAgICAgICAgICAgeTogdmFsdWVzWzBdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIHZhbHVlc1swXSA9PT0gZXhwZWN0ZWRUeXBlICYmIHR5cGVvZiB2YWx1ZXNbMV0gPT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAgICAgaW5zdGFuY2UucHJvcGVydGllc1twcm9wZXJ0eV0gPSB7XG4gICAgICAgICAgICAgICAgeDogdmFsdWVzWzBdLFxuICAgICAgICAgICAgICAgIHk6IHZhbHVlc1sxXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIGF4ZXMgcHJvcGVydHkgJHtwcm9wZXJ0eX06IFVuZXhwZWN0ZWQgdmFsdWUgJHt2YWx1ZXN9LmA7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFNpbmdsZVByb3BlcnR5KGluc3RhbmNlLCBwcm9wZXJ0eSwgZXhwZWN0ZWRUeXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnByb3BlcnRpZXNbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBgRXJyb3Igc2V0dGluZyBzaW5nbGUgcHJvcGVydHkgJHtwcm9wZXJ0eX06IFVuZXhwZWN0ZWQgdHlwZSBcIiR7dmFsdWV9XCIuYDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QXJyYXlQcm9wZXJ0eShpbnN0YW5jZSwgcHJvcGVydHksIGV4cGVjdGVkVHlwZSwgdmFsdWVzLCBsZW5ndGgpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIGFycmF5IHByb3BlcnR5ICR7cHJvcGVydHl9OiBcIiR7dmFsdWVzfVwiIGlzIG5vdCBhbiBhcnJheS5gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlcy5sZW5ndGggIT09IGxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgYEVycm9yIHNldHRpbmcgYXJyYXkgcHJvcGVydHkgJHtwcm9wZXJ0eX06IFwiJHt2YWx1ZXN9XCIgaXMgbm90IG9mIGxlbmd0aCAke2xlbmd0aH1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEVycm9yIHNldHRpbmcgYXJyYXkgcHJvcGVydHkgJHtwcm9wZXJ0eX06IFwiVW5leHBlY3RlZCB0eXBlIFwiJHt2YWx1ZX1cIiBpbiBhcnJheS5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlLnByb3BlcnRpZXNbcHJvcGVydHldID0gdmFsdWVzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRDaG9pY2VQcm9wZXJ0eShpbnN0YW5jZSwgcHJvcGVydHksIGV4cGVjdGVkVHlwZSwgdmFsdWUsIGNob2ljZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgICAgICBsZXQgdmFsaWRDaG9pY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hvaWNlIG9mIGNob2ljZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGNob2ljZSkge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZENob2ljZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWxpZENob2ljZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIGNob2ljZSBwcm9wZXJ0eSAke3Byb3BlcnR5fTogSW52YWxpZCBjaG9pY2UgXCIke3ZhbHVlfVwiLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBgRXJyb3Igc2V0dGluZyBjaG9pY2UgcHJvcGVydHkgJHtwcm9wZXJ0eX06IFVuZXhwZWN0ZWQgdHlwZSBcIiR7dmFsdWV9XCIuYDtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIvKipcbiAqIEBsaWNlbmNlXG4gKiBQdWxzYXIuanMgLSBBIGphdmFzY3JpcHQgZGF0YSB2aXN1YWxpc2F0aW9uIGZyYW1ld29ya1xuICogQ29weXJpZ2h0IChDKSAyMDIxICBMYWNobGFuIER1Zm9ydC1LZW5uZXR0XG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuaW1wb3J0IHsgUmVzcG9uc2l2ZUNhbnZhcywgYWN0aXZlQ2FudmFzZXMgfSBmcm9tIFwiLi9jb3JlL2luZGV4LmpzXCI7XG5leHBvcnQgY29uc3QgY29yZSA9IHtcbiAgICBSZXNwb25zaXZlQ2FudmFzOiBSZXNwb25zaXZlQ2FudmFzLFxuICAgIGFjdGl2ZUNhbnZhc2VzOiBhY3RpdmVDYW52YXNlc1xufTtcbmltcG9ydCB7IFJlc3BvbnNpdmVQbG90MkQsIFJlc3BvbnNpdmVQbG90MkRUcmFjZSB9IGZyb20gXCIuL3Bsb3R0aW5nL2luZGV4LmpzXCI7XG5leHBvcnQgY29uc3QgcGxvdHRpbmcgPSB7XG4gICAgUmVzcG9uc2l2ZVBsb3QyRDogUmVzcG9uc2l2ZVBsb3QyRCxcbiAgICBSZXNwb25zaXZlUGxvdDJEVHJhY2U6IFJlc3BvbnNpdmVQbG90MkRUcmFjZVxufTtcbmV4cG9ydCB7IFRpbWUgfSBmcm9tIFwiLi9jb3JlL2luZGV4LmpzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9EZWZhdWx0cy5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vUGxvdC5qc1wiO1xuIiwiaW1wb3J0IHsgUmVzcG9uc2l2ZUNhbnZhcyB9IGZyb20gXCIuLi9jb3JlL1Jlc3BvbnNpdmVDYW52YXMuanNcIjtcbmltcG9ydCB7IHByb3BlcnR5U2V0dGVycyB9IGZyb20gXCIuLi9oZWxwZXJzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBSZXNwb25zaXZlUGxvdDJEVHJhY2UgfSBmcm9tIFwiLi9SZXNwb25zaXZlUGxvdDJEVHJhY2UuanNcIjtcbmltcG9ydCB7IERlZmF1bHRzIH0gZnJvbSBcIi4uL0RlZmF1bHRzLmpzXCI7XG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGFsbCBQdWxzYXIgcGxvdCBvYmplY3RzLiBJdCBleHRlbmRzIHtAbGluayBSZXNwb25zaXZlQ2FudmFzIGBSZXNwb25zaXZlQ2FudmFzYH0uXG4gKiBBIGBSZXNwb25zaXZlUGxvdDJEYCBvYmplY3QgY2FuIGJlIGNyZWF0ZWQgYnkgY2FsbGluZyB0aGUgY29uc3RydWN0b3IsIGJ1dCB0aGUgcHJlZmVycmVkIG1ldGhvZCBpcyB0byB1c2UgdGhlXG4gKiB7QGxpbmsgUGxvdCBgUGxvdGB9IGNsYXNzLiBgUmVzcG9uc2l2ZVBsb3QyRGAgb2JqZWN0cyBiZWhhdmUgc2ltaWxhcmx5IHRvIGEgYFJlc3BvbnNpdmVDYW52YXNgLlxuICogVGhleSBoYXZlIGEgYmFja2dyb3VuZCwgd2hpY2ggY29udGFpbnMgdGhlIGF4ZXMgYW5kIGdyaWRsaW5lcywgYW5kIGEgZm9yZWdyb3VuZCwgd2hpY2ggY29udGFpbnMgdGhlIHBsb3QgZGF0YS5cbiAqIFRoZSB0aWNrcyBhbmQgZ3JpZGxpbmVzIGNhbiBiZSB0b2dnbGVkIGFuZCB0aGUgaW50ZXJ2YWxzIGJldHdlZW4gdGhlbSBjYW4gYmUgY2hhbmdlZC5cbiAqIERhdGEgaXMgYWRkZWQgdG8gdGhlIHBsb3QgdXNpbmcgdGhlIHtAbGluayBSZXNwb25zaXZlUGxvdDJELmFkZERhdGEgYGFkZERhdGEoKWB9IG1ldGhvZC5cbiAqIFJlYWQtb25seSBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIGJlZ2lubmluZyB3aXRoIGFuIHVuZGVyc2NvcmUgc2hvdWxkIG5vdCBiZSBjaGFuZ2VkL2NhbGxlZCwgb3RoZXJ3aXNlIHRoZXlcbiAqIG1heSBjYXVzZSB1bnByZWRpY3RhYmxlIGJlaGF2aW91ci5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc3BvbnNpdmVQbG90MkQgZXh0ZW5kcyBSZXNwb25zaXZlQ2FudmFzIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWQgVGhlIHVuaXF1ZSBJRCBvZiB0aGUgcGxvdCBvYmplY3QuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgcGFyYW1ldGVycy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gRGVmYXVsdHMuY3JlYXRlKFwiUmVzcG9uc2l2ZUNhbnZhc1wiLCBcIlJlc3BvbnNpdmVQbG90MkRcIik7XG4gICAgICAgIHRoaXMuZ3JpZFNjYWxlID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250YWlucyB0aGUgZGF0YSB0cmFjZSBvYmplY3RzIGZvciB0aGUgcGxvdCBpbnN0YW5jZS5cbiAgICAgICAgICogVGhlIG9iamVjdHMgY2FuIGJlIGFjY2Vzc2VkIHVzaW5nIHRoZSB0cmFjZSBJRCBhcyB0aGUga2V5LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgICAgIERlZmF1bHRzLm1lcmdlT3B0aW9ucyh0aGlzLCBcIlJlc3BvbnNpdmVQbG90MkRcIiwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZChjb250ZXh0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRyYXdHcmlkU2V0ID0gKG1ham9yT3JNaW5vciwgeHksIHRpY2tzT3JHcmlkbGluZXMsIHdpZHRoLCBsaW5lU3RhcnQsIGxpbmVFbmQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB3aWR0aCAlIDIgPT09IDAgPyAwIDogMC41O1xuICAgICAgICAgICAgICAgIGNvbnN0IGludGVydmFsU2l6ZSA9IHRoaXMucHJvcGVydGllc1tgJHttYWpvck9yTWlub3IgKyAodGlja3NPckdyaWRsaW5lcyA9PT0gXCJUaWNrc1wiID8gXCJUaWNrU2l6ZVwiIDogXCJHcmlkU2l6ZVwiKX1gXVt4eV07XG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzW2Ake21ham9yT3JNaW5vcn0ke3RpY2tzT3JHcmlkbGluZXN9YF1beHldKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWUgPSAtTWF0aC5mbG9vcih0aGlzLnByb3BlcnRpZXMub3JpZ2luW3h5XSAvIChpbnRlcnZhbFNpemUgKiB0aGlzLmdyaWRTY2FsZVt4eV0pKSAqIGludGVydmFsU2l6ZSAqIHRoaXMuZ3JpZFNjYWxlW3h5XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHh5ID09PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRWYWx1ZSA8IHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoIC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oY3VycmVudFZhbHVlICsgb2Zmc2V0LCBsaW5lU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGN1cnJlbnRWYWx1ZSArIG9mZnNldCwgbGluZUVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlICs9IHRoaXMuZ3JpZFNjYWxlLnggKiBpbnRlcnZhbFNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeHkgPT09IFwieVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudFZhbHVlIDwgdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0IC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8obGluZVN0YXJ0LCBjdXJyZW50VmFsdWUgKyBvZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKGxpbmVFbmQsIGN1cnJlbnRWYWx1ZSArIG9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlICs9IHRoaXMuZ3JpZFNjYWxlLnkgKiBpbnRlcnZhbFNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29udGV4dC5saW5lQ2FwID0gXCJzcXVhcmVcIjtcbiAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcInJnYigwLCAwLCAwKVwiO1xuICAgICAgICAgICAgZHJhd0dyaWRTZXQoXCJtaW5vclwiLCBcInhcIiwgXCJHcmlkbGluZXNcIiwgMSwgLXRoaXMucHJvcGVydGllcy5vcmlnaW4ueSwgdGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0IC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KTtcbiAgICAgICAgICAgIGRyYXdHcmlkU2V0KFwibWlub3JcIiwgXCJ5XCIsIFwiR3JpZGxpbmVzXCIsIDEsIC10aGlzLnByb3BlcnRpZXMub3JpZ2luLngsIHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoIC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54KTtcbiAgICAgICAgICAgIGRyYXdHcmlkU2V0KFwibWFqb3JcIiwgXCJ4XCIsIFwiR3JpZGxpbmVzXCIsIDIsIC10aGlzLnByb3BlcnRpZXMub3JpZ2luLnksIHRoaXMuX2Rpc3BsYXlEYXRhLmhlaWdodCAtIHRoaXMucHJvcGVydGllcy5vcmlnaW4ueSk7XG4gICAgICAgICAgICBkcmF3R3JpZFNldChcIm1ham9yXCIsIFwieVwiLCBcIkdyaWRsaW5lc1wiLCAyLCAtdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54LCB0aGlzLl9kaXNwbGF5RGF0YS53aWR0aCAtIHRoaXMucHJvcGVydGllcy5vcmlnaW4ueCk7XG4gICAgICAgICAgICBkcmF3R3JpZFNldChcIm1pbm9yXCIsIFwieFwiLCBcIlRpY2tzXCIsIDEsIC0zLCAzKTtcbiAgICAgICAgICAgIGRyYXdHcmlkU2V0KFwibWlub3JcIiwgXCJ5XCIsIFwiVGlja3NcIiwgMSwgLTMsIDMpO1xuICAgICAgICAgICAgZHJhd0dyaWRTZXQoXCJtYWpvclwiLCBcInhcIiwgXCJUaWNrc1wiLCAyLCAtNiwgNik7XG4gICAgICAgICAgICBkcmF3R3JpZFNldChcIm1ham9yXCIsIFwieVwiLCBcIlRpY2tzXCIsIDIsIC02LCA2KTtcbiAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDM7XG4gICAgICAgICAgICBjb250ZXh0Lm1vdmVUbygwLjUsIC10aGlzLnByb3BlcnRpZXMub3JpZ2luLnkpO1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8oMC41LCB0aGlzLl9kaXNwbGF5RGF0YS5oZWlnaHQgLSB0aGlzLnByb3BlcnRpZXMub3JpZ2luLnkpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oLXRoaXMucHJvcGVydGllcy5vcmlnaW4ueCwgMC41KTtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoIC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54LCAwLjUpO1xuICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlc2l6ZUV2ZW50TGlzdGVuZXIoZW50cnkpIHtcbiAgICAgICAgc3VwZXIucmVzaXplRXZlbnRMaXN0ZW5lcihlbnRyeSk7XG4gICAgICAgIHRoaXMuc2V0WExpbXMoLi4udGhpcy5wcm9wZXJ0aWVzLnhMaW1zKTtcbiAgICAgICAgdGhpcy5zZXRZTGltcyguLi50aGlzLnByb3BlcnRpZXMueUxpbXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgICogVXBkYXRlcyB0aGUgZm9yZWdyb3VuZCBmdW5jdGlvbi5cbiAgICAgICovXG4gICAgdXBkYXRlUGxvdHRpbmdEYXRhKCkge1xuICAgICAgICB0aGlzLnNldEZvcmVncm91bmQoKGNvbnRleHQsIHRpbWVWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkYXRhc2V0SUQgb2YgT2JqZWN0LmtleXModGhpcy5kYXRhKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbZGF0YXNldElEXS5wcm9wZXJ0aWVzLnZpc2liaWxpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YXNldCA9IHRoaXMuZGF0YVtkYXRhc2V0SURdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YXNldC5wcm9wZXJ0aWVzLnRyYWNlU3R5bGUgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gZGF0YXNldC5wcm9wZXJ0aWVzLnRyYWNlQ29sb3VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSBkYXRhc2V0LnByb3BlcnRpZXMudHJhY2VXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZUpvaW4gPSBcInJvdW5kXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRhdGFzZXQucHJvcGVydGllcy50cmFjZVN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNvbGlkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0TGluZURhc2goW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZG90dGVkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzMsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRhc2hlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsxMCwgMTBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRhc2hkb3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zZXRMaW5lRGFzaChbMTUsIDMsIDMsIDNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhR2VuZXJhdG9yID0gZGF0YXNldC5kYXRhKHRpbWVWYWx1ZSwgdGhpcy5wcm9wZXJ0aWVzLnhMaW1zLCB0aGlzLnByb3BlcnRpZXMueUxpbXMsIDAuMDEsIGRhdGFzZXQucHJvcGVydGllcy5wYXJhbWV0ZXJSYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjdXJyZW50UG9pbnQgb2YgZGF0YUdlbmVyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzU2FmZUludGVnZXIoTWF0aC5yb3VuZChjdXJyZW50UG9pbnRbMV0pKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UG9pbnRbMV0gPSBjdXJyZW50UG9pbnRbMV0gPiAwID8gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgOiBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oY3VycmVudFBvaW50WzBdICogdGhpcy5ncmlkU2NhbGUueCwgLWN1cnJlbnRQb2ludFsxXSAqIHRoaXMuZ3JpZFNjYWxlLnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YXNldC5wcm9wZXJ0aWVzLm1hcmtlclN0eWxlICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFya2VyU2l6ZSA9IGRhdGFzZXQucHJvcGVydGllcy5tYXJrZXJTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IGRhdGFzZXQucHJvcGVydGllcy5tYXJrZXJDb2xvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGRhdGFzZXQucHJvcGVydGllcy5tYXJrZXJDb2xvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDIgKiBtYXJrZXJTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHJhd01hcmtlciA9ICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChkYXRhc2V0LnByb3BlcnRpZXMubWFya2VyU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChjb250ZXh0LCB4LCB5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoeCwgeSwgNSAqIG1hcmtlclNpemUsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJwbHVzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNvbnRleHQsIHgsIHkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyh4LCB5ICsgNSAqIG1hcmtlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHgsIHkgLSA1ICogbWFya2VyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oeCArIDUgKiBtYXJrZXJTaXplLCB5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyh4IC0gNSAqIG1hcmtlclNpemUsIHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY3Jvc3NcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY29udGV4dCwgeCwgeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubW92ZVRvKHggKyA1ICogbWFya2VyU2l6ZSwgeSArIDUgKiBtYXJrZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyh4IC0gNSAqIG1hcmtlclNpemUsIHkgLSA1ICogbWFya2VyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oeCAtIDUgKiBtYXJrZXJTaXplLCB5ICsgNSAqIG1hcmtlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHggKyA1ICogbWFya2VyU2l6ZSwgeSAtIDUgKiBtYXJrZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFycm93XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNvbnRleHQsIHgsIHksIHRoZXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTih0aGV0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC50cmFuc2xhdGUoeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQucm90YXRlKC10aGV0YSAtIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oMCwgLTcgKiBtYXJrZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8oLTUgKiBtYXJrZXJTaXplLCA3ICogbWFya2VyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDUgKiBtYXJrZXJTaXplLCA3ICogbWFya2VyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKDAsIC03ICogbWFya2VyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJvdGF0ZSh0aGV0YSArIE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC50cmFuc2xhdGUoLXgsIC15KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhR2VuZXJhdG9yID0gZGF0YXNldC5kYXRhKHRpbWVWYWx1ZSwgdGhpcy5wcm9wZXJ0aWVzLnhMaW1zLCB0aGlzLnByb3BlcnRpZXMueUxpbXMsIDAuMDAxLCBkYXRhc2V0LnByb3BlcnRpZXMucGFyYW1ldGVyUmFuZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RQb2ludCA9IFtOYU4sIE5hTl07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnRQb2ludCBvZiBkYXRhR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IFtjdXJyZW50UG9pbnRbMF0gKiB0aGlzLmdyaWRTY2FsZS54LCAtY3VycmVudFBvaW50WzFdICogdGhpcy5ncmlkU2NhbGUueV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4yKHBvaW50WzFdIC0gbGFzdFBvaW50WzFdLCAtcG9pbnRbMF0gKyBsYXN0UG9pbnRbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXdNYXJrZXIoY29udGV4dCwgLi4ucG9pbnQsIGFuZ2xlKTsgLy8gVE9ETzogZml4IHRoaXMgKHR5cGVzY3JpcHQgdGhpbmtzIGRyYXdNYXJrZXIgY2FuIGJlIG51bGwgKGJlY2F1c2UgdGhlIGRlZmF1bHRzIGFyZW4ndCB0eXBlZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBvaW50ID0gcG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZGF0YSB0cmFjZSB0byB0aGUgcGxvdC4gVGhlIHRyYWNlIG11c3QgYmUgZ2l2ZW4gYSB1bmlxdWUgSUQsIHNvIHRoYXQgaXQgY2FuIGJlIGFkZGVkIHRvIHRoZVxuICAgICAqIHtAbGluayBSZXNwb25zaXZlUGxvdDJELmRhdGEgYGRhdGFgfSBwcm9wZXJ0eSBvZiB0aGUgcGxvdCBvYmplY3QuXG4gICAgICogVGhlcmUgYXJlIHNldmVyYWwgd2F5cyB0aGF0IGRhdGEgY2FuIGJlIGFkZGVkLCB3aGljaCBjYW4gYmUgZGl2aWRlZCBpbnRvICoqY29udGludW91cyoqIGFuZCAqKmRpc2NyZXRlKiogZGF0YS5cbiAgICAgKiBUaGVzZSBkaWZmZXJlbnQgbWV0aG9kcyBhcmUgZGVzY3JpYmVkIGJ5IHdoYXQgdG8gcGFzcyBmb3IgdGhlIGBkYXRhYCBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0gaWQgVW5pcXVlIElEIGZvciB0aGUgdHJhY2UuXG4gICAgICogQHBhcmFtIGRhdGEgRGF0YSB0byBiZSBwbG90dGVkLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIHBhcmFtZXRlcnMuXG4gICAgICovXG4gICAgYWRkRGF0YShpZCwgZGF0YSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFbaWRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpZF0gPSBuZXcgUmVzcG9uc2l2ZVBsb3QyRFRyYWNlKHRoaXMsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogdHJhY2Ugd2l0aCBJRCAke2lkfSBhbHJlYWR5IGV4aXN0cyBvbiBjdXJyZW50IHBsb3QsIGNhbGwgcmVtb3ZlRGF0YSgpIHRvIHJlbW92ZS5gO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSB0cmFjZSBmcm9tIHRoZSBwbG90LlxuICAgICAqIEBwYXJhbSB0cmFjZSBJRCBvZiB0aGUgdHJhY2UgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICByZW1vdmVEYXRhKHRyYWNlKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbdHJhY2VdO1xuICAgICAgICB0aGlzLnVwZGF0ZVBsb3R0aW5nRGF0YSgpO1xuICAgIH1cbiAgICBzZXRPcmlnaW4oLi4ucG9pbnQpIHtcbiAgICAgICAgc3VwZXIuc2V0T3JpZ2luKC4uLnBvaW50KTtcbiAgICAgICAgaWYgKHRoaXMuX2Rpc3BsYXlEYXRhLnBhcmVudEVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5ncmlkU2NhbGUueCA+IDAgJiYgdGhpcy5ncmlkU2NhbGUueSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy54TGltcyA9IFstdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54IC8gdGhpcy5ncmlkU2NhbGUueCwgKHRoaXMuX2Rpc3BsYXlEYXRhLndpZHRoIC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi54KSAvIHRoaXMuZ3JpZFNjYWxlLnhdO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnlMaW1zID0gWy0odGhpcy5fZGlzcGxheURhdGEuaGVpZ2h0IC0gdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KSAvIHRoaXMuZ3JpZFNjYWxlLnksIHRoaXMucHJvcGVydGllcy5vcmlnaW4ueSAvIHRoaXMuZ3JpZFNjYWxlLnldO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBtYWpvciB0aWNrcy4gVHdvIHZhbHVlcyBtYXkgYmUgcGFzc2VkIGZvciBgeGAgdGhlbiBgeWAsIG9yIGp1c3QgYSBzaW5nbGUgdmFsdWUgZm9yIGJvdGggYXhlcy5cbiAgICAgKiBAcGFyYW0gY2hvaWNlcyBFaXRoZXIgb25lIG9yIHR3byBib29sZWFucy5cbiAgICAgKi9cbiAgICBzZXRNYWpvclRpY2tzKC4uLmNob2ljZXMpIHtcbiAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldEF4ZXNQcm9wZXJ0eSh0aGlzLCBcIm1ham9yVGlja3NcIiwgXCJib29sZWFuXCIsIC4uLmNob2ljZXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgbWlub3IgdGlja3MuIFR3byB2YWx1ZXMgbWF5IGJlIHBhc3NlZCBmb3IgYHhgIHRoZW4gYHlgLCBvciBqdXN0IGEgc2luZ2xlIHZhbHVlIGZvciBib3RoIGF4ZXMuXG4gICAgICogQHBhcmFtIGNob2ljZXMgRWl0aGVyIG9uZSBvciB0d28gYm9vbGVhbnMuXG4gICAgICovXG4gICAgc2V0TWlub3JUaWNrcyguLi5jaG9pY2VzKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRBeGVzUHJvcGVydHkodGhpcywgXCJtaW5vclRpY2tzXCIsIFwiYm9vbGVhblwiLCAuLi5jaG9pY2VzKTtcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHNwYWNpbmcgb2YgdGhlIG1ham9yIHRpY2tzIChpbiBncmlkIHVuaXRzKS4gVHdvIHZhbHVlcyBtYXkgYmUgcGFzc2VkIGZvciBgeGAgdGhlbiBgeWAsIG9yIGp1c3QgYSBzaW5nbGUgdmFsdWUgZm9yIGJvdGggYXhlcy5cbiAgICAgKiBAcGFyYW0gc2l6ZXMgRWl0aGVyIG9uZSBvciB0d28gbnVtYmVycy5cbiAgICAgKi9cbiAgICBzZXRNYWpvclRpY2tTaXplKC4uLnNpemVzKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRBeGVzUHJvcGVydHkodGhpcywgXCJtYWpvclRpY2tTaXplXCIsIFwibnVtYmVyXCIsIC4uLnNpemVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHNwYWNpbmcgb2YgdGhlIG1pbm9yIHRpY2tzIChpbiBncmlkIHVuaXRzKS4gVHdvIHZhbHVlcyBtYXkgYmUgcGFzc2VkIGZvciBgeGAgdGhlbiBgeWAsIG9yIGp1c3QgYSBzaW5nbGUgdmFsdWUgZm9yIGJvdGggYXhlcy5cbiAgICAgKiBAcGFyYW0gc2l6ZXMgRWl0aGVyIG9uZSBvciB0d28gbnVtYmVycy5cbiAgICAgKi9cbiAgICBzZXRNaW5vclRpY2tTaXplKC4uLnNpemVzKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRBeGVzUHJvcGVydHkodGhpcywgXCJtaW5vclRpY2tTaXplXCIsIFwibnVtYmVyXCIsIC4uLnNpemVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRvZ2dsZXMgdGhlIG1ham9yIGdyaWRsaW5lcy4gVHdvIHZhbHVlcyBtYXkgYmUgcGFzc2VkIGZvciBgeGAgdGhlbiBgeWAsIG9yIGp1c3QgYSBzaW5nbGUgdmFsdWUgZm9yIGJvdGggYXhlcy5cbiAgICAgKiBAcGFyYW0gY2hvaWNlcyBFaXRoZXIgb25lIG9yIHR3byBib29sZWFucy5cbiAgICAgKi9cbiAgICBzZXRNYWpvckdyaWRsaW5lcyguLi5jaG9pY2VzKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRBeGVzUHJvcGVydHkodGhpcywgXCJtYWpvckdyaWRsaW5lc1wiLCBcImJvb2xlYW5cIiwgLi4uY2hvaWNlcyk7XG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUb2dnbGVzIHRoZSBtaW5vciBncmlkbGluZXMuIFR3byB2YWx1ZXMgbWF5IGJlIHBhc3NlZCBmb3IgYHhgIHRoZW4gYHlgLCBvciBqdXN0IGEgc2luZ2xlIHZhbHVlIGZvciBib3RoIGF4ZXMuXG4gICAgICogQHBhcmFtIGNob2ljZXMgRWl0aGVyIG9uZSBvciB0d28gYm9vbGVhbnMuXG4gICAgICovXG4gICAgc2V0TWlub3JHcmlkbGluZXMoLi4uY2hvaWNlcykge1xuICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0QXhlc1Byb3BlcnR5KHRoaXMsIFwibWlub3JHcmlkbGluZXNcIiwgXCJib29sZWFuXCIsIC4uLmNob2ljZXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZUJhY2tncm91bmQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3BhY2luZyBvZiB0aGUgbWFqb3IgZ3JpZGxpbmVzIChpbiBncmlkIHVuaXRzKS4gVHdvIHZhbHVlcyBtYXkgYmUgcGFzc2VkIGZvciBgeGAgdGhlbiBgeWAsIG9yIGp1c3QgYSBzaW5nbGUgdmFsdWUgZm9yIGJvdGggYXhlcy5cbiAgICAgKiBAcGFyYW0gc2l6ZXMgRWl0aGVyIG9uZSBvciB0d28gbnVtYmVycy5cbiAgICAgKi9cbiAgICBzZXRNYWpvckdyaWRTaXplKC4uLnNpemVzKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRBeGVzUHJvcGVydHkodGhpcywgXCJtYWpvckdyaWRTaXplXCIsIFwibnVtYmVyXCIsIC4uLnNpemVzKTtcbiAgICAgICAgdGhpcy51cGRhdGVCYWNrZ3JvdW5kKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHNwYWNpbmcgb2YgdGhlIG1pbm9yIGdyaWRsaW5lcyAoaW4gZ3JpZCB1bml0cykuIFR3byB2YWx1ZXMgbWF5IGJlIHBhc3NlZCBmb3IgYHhgIHRoZW4gYHlgLCBvciBqdXN0IGEgc2luZ2xlIHZhbHVlIGZvciBib3RoIGF4ZXMuXG4gICAgICogQHBhcmFtIHNpemVzIEVpdGhlciBvbmUgb3IgdHdvIG51bWJlcnMuXG4gICAgICovXG4gICAgc2V0TWlub3JHcmlkU2l6ZSguLi5zaXplcykge1xuICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0QXhlc1Byb3BlcnR5KHRoaXMsIFwibWlub3JHcmlkU2l6ZVwiLCBcIm51bWJlclwiLCAuLi5zaXplcyk7XG4gICAgICAgIHRoaXMudXBkYXRlQmFja2dyb3VuZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSByYW5nZSBvZiBgeGAgdmFsdWVzIHRvIGJlIHNob3duIG9uIHRoZSBwbG90IGJ5IG1vdmluZyB0aGUgb3JpZ2luIGFuZCBhbHRlcmluZyB0aGUgZ3JpZCBzY2FsZS5cbiAgICAgKiBAcGFyYW0gbWluIFRoZSBtaW5pbXVtIHZhbHVlIG9mIGB4YC5cbiAgICAgKiBAcGFyYW0gbWF4IFRoZSBtYXhpbXVtIHZhbHVlIG9mIGB4YC5cbiAgICAgKi9cbiAgICBzZXRYTGltcyhtaW4sIG1heCkge1xuICAgICAgICBpZiAobWF4ID49IG1pbikge1xuICAgICAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldEFycmF5UHJvcGVydHkodGhpcywgXCJ4TGltc1wiLCBcIm51bWJlclwiLCBbbWluLCBtYXhdLCAyKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNjYWxlLnggPSB0aGlzLl9kaXNwbGF5RGF0YS53aWR0aCAvIE1hdGguYWJzKHRoaXMucHJvcGVydGllcy54TGltc1swXSAtIHRoaXMucHJvcGVydGllcy54TGltc1sxXSk7XG4gICAgICAgICAgICB0aGlzLnNldE9yaWdpbigtdGhpcy5wcm9wZXJ0aWVzLnhMaW1zWzBdICogdGhpcy5ncmlkU2NhbGUueCwgdGhpcy5wcm9wZXJ0aWVzLm9yaWdpbi55KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGxvdHRpbmdEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBgRXJyb3Igc2V0dGluZyB4TGltczogTG93ZXIgbGltaXQgY2Fubm90IGJlIGhpZ2hlciB0aGFuIG9yIGVxdWFsIHRvIGhpZ2hlciBsaW1pdC5gO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHJhbmdlIG9mIGB5YCB2YWx1ZXMgdG8gYmUgc2hvd24gb24gdGhlIHBsb3QgYnkgbW92aW5nIHRoZSBvcmlnaW4gYW5kIGFsdGVyaW5nIHRoZSBncmlkIHNjYWxlLlxuICAgICAqIEBwYXJhbSBtaW4gVGhlIG1pbmltdW0gdmFsdWUgb2YgYHlgLlxuICAgICAqIEBwYXJhbSBtYXggVGhlIG1heGltdW0gdmFsdWUgb2YgYHlgLlxuICAgICAqL1xuICAgIHNldFlMaW1zKG1pbiwgbWF4KSB7XG4gICAgICAgIGlmIChtYXggPj0gbWluKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0QXJyYXlQcm9wZXJ0eSh0aGlzLCBcInlMaW1zXCIsIFwibnVtYmVyXCIsIFttaW4sIG1heF0sIDIpO1xuICAgICAgICAgICAgdGhpcy5ncmlkU2NhbGUueSA9IHRoaXMuX2Rpc3BsYXlEYXRhLmhlaWdodCAvIE1hdGguYWJzKHRoaXMucHJvcGVydGllcy55TGltc1swXSAtIHRoaXMucHJvcGVydGllcy55TGltc1sxXSk7XG4gICAgICAgICAgICB0aGlzLnNldE9yaWdpbih0aGlzLnByb3BlcnRpZXMub3JpZ2luLngsIHRoaXMucHJvcGVydGllcy55TGltc1sxXSAqIHRoaXMuZ3JpZFNjYWxlLnkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIHlMaW1zOiBMb3dlciBsaW1pdCBjYW5ub3QgYmUgaGlnaGVyIHRoYW4gb3IgZXF1YWwgdG8gaGlnaGVyIGxpbWl0LmA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvdyhlbGVtZW50KSB7XG4gICAgICAgIHN1cGVyLnNob3coZWxlbWVudCk7XG4gICAgICAgIHRoaXMuc2V0WExpbXMoLi4udGhpcy5wcm9wZXJ0aWVzLnhMaW1zKTtcbiAgICAgICAgdGhpcy5zZXRZTGltcyguLi50aGlzLnByb3BlcnRpZXMueUxpbXMpO1xuICAgIH1cbn1cbiIsIi8vIFRPRE86IHRoaXMgbW9kdWxlIG5lZWRzIHRlc3RzXG5pbXBvcnQgeyBwcm9wZXJ0eVNldHRlcnMsIGRpc2NyZXRlRnVuY3Rpb25HZW5lcmF0b3IsIGRpc2NyZXRlTWFwR2VuZXJhdG9yLCBwYXJhbWV0cmljRnVuY3Rpb25HZW5lcmF0b3IsIGNvbnRpbnVvdXNGdW5jdGlvbkdlbmVyYXRvciB9IGZyb20gXCIuLi9oZWxwZXJzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBEZWZhdWx0cyB9IGZyb20gXCIuLi9EZWZhdWx0cy5qc1wiO1xuLyoqXG4gKiAgVGhpcyBwbG90IHJlcHJlc2VudHMgYSB0cmFjZSBvbiBhIHtAbGluayBSZXNwb25zaXZlUGxvdDJEIGBSZXNwb25zaXZlUGxvdDJEYH0uXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNwb25zaXZlUGxvdDJEVHJhY2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwbG90IFRoZSBwYXJlbnQgcGxvdC5cbiAgICAgKiBAcGFyYW0gZGF0YSBEYXRhIHRvIGJlIHBsb3R0ZWQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgcGFyYW1ldGVycy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwbG90LCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gRGVmYXVsdHMuY3JlYXRlKFwiUmVzcG9uc2l2ZVBsb3QyRFRyYWNlXCIpO1xuICAgICAgICB0aGlzLnBsb3QgPSBwbG90OyAvLyBUT0RPOiByZW1vdmUgbmVjZXNzaXR5IGZvciB0aGlzIHdpdGggZXZlbnRzP1xuICAgICAgICBEZWZhdWx0cy5tZXJnZU9wdGlvbnModGhpcywgXCJSZXNwb25zaXZlUGxvdDJEVHJhY2VcIiwgb3B0aW9ucyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIGRhdGEubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGFbMV0pKSB7IC8vIGRpc2NyZXRlIHBvaW50c1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVswXS5sZW5ndGggIT09IGRhdGFbMV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkVycm9yIHNldHRpbmcgcGxvdCBkYXRhOiBMZW5ndGhzIG9mIGRhdGEgYXJyYXlzIGFyZSBub3QgZXF1YWwuXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhWzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4VmFsdWUgPSB0eXBlb2YgZGF0YVswXVtpXSA9PT0gXCJmdW5jdGlvblwiID8gZGF0YVswXVtpXSgwKSA6IGRhdGFbMF1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5VmFsdWUgPSB0eXBlb2YgZGF0YVsxXVtpXSA9PT0gXCJmdW5jdGlvblwiID8gZGF0YVsxXVtpXSgwLCAwKSA6IGRhdGFbMV1baV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHhWYWx1ZSAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgeVZhbHVlICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogRGF0YSBhcnJheXMgY29udGFpbiB0eXBlcyB3aGljaCBhcmUgbm90IG51bWJlcnMuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gZGlzY3JldGVGdW5jdGlvbkdlbmVyYXRvcihkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFbMV0gPT09IFwiZnVuY3Rpb25cIikgeyAvLyBkaXNjcmV0ZSBtYXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhWzFdKDAsIDApICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIkVycm9yIHNldHRpbmcgcGxvdCBkYXRhOiBQbG90IGZ1bmN0aW9uIGRvZXMgbm90IHJldHVybiBudW1iZXJzLlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YVswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhWzBdW2ldICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogRGF0YSBhcnJheSBjb250YWlucyB0eXBlcyB3aGljaCBhcmUgbm90IG51bWJlcnMuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gZGlzY3JldGVNYXBHZW5lcmF0b3IoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZGF0YVsxXSA9PT0gXCJmdW5jdGlvblwiKSB7IC8vIHBhcmFtZXRyaWMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGFbMF0oMCwgMCkgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRhdGFbMV0oMCwgMCkgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogUGxvdCBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gbnVtYmVycy5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcGFyYW1ldHJpY0Z1bmN0aW9uR2VuZXJhdG9yKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcImZ1bmN0aW9uXCIpIHsgLy8gY29udGludW91cyBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhKDAsIDApICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgXCJFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogUGxvdCBmdW5jdGlvbiBkb2VzIG5vdCByZXR1cm4gbnVtYmVycy5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGNvbnRpbnVvdXNGdW5jdGlvbkdlbmVyYXRvcihkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGBFcnJvciBzZXR0aW5nIHBsb3QgZGF0YTogVW5yZWNvZ25pc2VkIGRhdGEgc2lnbmF0dXJlICR7ZGF0YX0uYDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjb2xvdXIgb2YgdGhlIHNwZWNpZmllZCB0cmFjZS4gVGhlIHNwZWNpZmllZCBjb2xvdXIgbXVzdCBiZSBvbmUgb2YgdGhlIGJyb3dzZXItcmVjb2duaXNlZCBjb2xvdXJzLlxuICAgICAqIEBwYXJhbSBjb2xvdXIgVGhlIG5hbWUgb2YgdGhlIGNvbG91ci5cbiAgICAgKi9cbiAgICBzZXRUcmFjZUNvbG91cihjb2xvdXIpIHtcbiAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldFNpbmdsZVByb3BlcnR5KHRoaXMsIFwidHJhY2VDb2xvdXJcIiwgXCJzdHJpbmdcIiwgY29sb3VyKTtcbiAgICAgICAgdGhpcy5wbG90LnVwZGF0ZVBsb3R0aW5nRGF0YSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzdHlsZSBvZiB0aGUgc3BlY2lmaWVkIHRyYWNlLiBQb3NzaWJsZSBzdHlsZXMgYXJlOiBgc29saWRgLCBgZG90dGVkYCwgYGRhc2hlZGAsIGBkYXNoZG90YCwgb3IgYG5vbmVgLlxuICAgICAqIEBwYXJhbSBzdHlsZSBUaGUgbmFtZSBvZiB0aGUgc3R5bGUuXG4gICAgICovXG4gICAgc2V0VHJhY2VTdHlsZShzdHlsZSkge1xuICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0Q2hvaWNlUHJvcGVydHkodGhpcywgXCJ0cmFjZVN0eWxlXCIsIFwic3RyaW5nXCIsIHN0eWxlLCBbXCJzb2xpZFwiLCBcImRvdHRlZFwiLCBcImRhc2hlZFwiLCBcImRhc2hkb3RcIiwgXCJub25lXCJdKTtcbiAgICAgICAgdGhpcy5wbG90LnVwZGF0ZVBsb3R0aW5nRGF0YSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB3aWR0aCBvZiB0aGUgc3BlY2lmaWVkIHRyYWNlIChpbiBwaXhlbHMpLlxuICAgICAqIEBwYXJhbSB3aWR0aCBUaGUgd2lkdGggb2YgdGhlIHRyYWNlIGluIHBpeGVscy5cbiAgICAgKi9cbiAgICBzZXRUcmFjZVdpZHRoKHdpZHRoKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRTaW5nbGVQcm9wZXJ0eSh0aGlzLCBcInRyYWNlV2lkdGhcIiwgXCJudW1iZXJcIiwgd2lkdGgpO1xuICAgICAgICB0aGlzLnBsb3QudXBkYXRlUGxvdHRpbmdEYXRhKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNvbG91ciBvZiB0aGUgbWFya2VycyBvbiB0aGUgc3BlY2lmaWVkIHRyYWNlLiBUaGUgc3BlY2lmaWVkIGNvbG91ciBtdXN0IGJlIG9uZSBvZiB0aGUgYnJvd3Nlci1yZWNvZ25pc2VkIGNvbG91cnMuXG4gICAgICogQHBhcmFtIGNvbG91ciBUaGUgbmFtZSBvZiB0aGUgY29sb3VyLlxuICAgICAqL1xuICAgIHNldE1hcmtlckNvbG91cihjb2xvdXIpIHtcbiAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldFNpbmdsZVByb3BlcnR5KHRoaXMsIFwibWFya2VyQ29sb3VyXCIsIFwic3RyaW5nXCIsIGNvbG91cik7XG4gICAgICAgIHRoaXMucGxvdC51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3R5bGUgb2YgdGhlIG1hcmtlcnMgdGhlIHNwZWNpZmllZCB0cmFjZS4gUG9zc2libGUgc3R5bGVzIGFyZTogYGNpcmNsZWAsIGBwbHVzYCwgYGNyb3NzYCwgYGFycm93YCwgb3IgYG5vbmVgLlxuICAgICAqIEBwYXJhbSBzdHlsZSBUaGUgbmFtZSBvZiB0aGUgc3R5bGUuXG4gICAgICovXG4gICAgc2V0TWFya2VyU3R5bGUoc3R5bGUpIHtcbiAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldENob2ljZVByb3BlcnR5KHRoaXMsIFwibWFya2VyU3R5bGVcIiwgXCJzdHJpbmdcIiwgc3R5bGUsIFtcImNpcmNsZVwiLCBcInBsdXNcIiwgXCJjcm9zc1wiLCBcImFycm93XCIsIFwibm9uZVwiXSk7XG4gICAgICAgIHRoaXMucGxvdC51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgd2lkdGggb2YgdGhlIG1hcmtlcnMgb24gdGhlIHNwZWNpZmllZCB0cmFjZSAoaW4gcGl4ZWxzKS5cbiAgICAgKiBAcGFyYW0gc2l6ZSBUaGUgc2l6ZSBvZiB0aGUgbWFya2VycyBpbiBwaXhlbHMuXG4gICAgICovXG4gICAgc2V0TWFya2VyU2l6ZShzaXplKSB7XG4gICAgICAgIHByb3BlcnR5U2V0dGVycy5zZXRTaW5nbGVQcm9wZXJ0eSh0aGlzLCBcIm1hcmtlclNpemVcIiwgXCJudW1iZXJcIiwgc2l6ZSk7XG4gICAgICAgIHRoaXMucGxvdC51cGRhdGVQbG90dGluZ0RhdGEoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVG9nZ2xlcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgc3BlY2lmaWVkIHRyYWNlLlxuICAgICAqIEBwYXJhbSB2YWx1ZSBTZXQgdG8gYHRydWVgIGZvciB0aGUgdHJhY2UgdG8gYmUgdmlzaWJsZSwgYGZhbHNlYCBmb3IgaXQgdG8gYmUgaGlkZGVuLlxuICAgICAqL1xuICAgIHNldFZpc2liaWxpdHkodmFsdWUpIHtcbiAgICAgICAgcHJvcGVydHlTZXR0ZXJzLnNldFNpbmdsZVByb3BlcnR5KHRoaXMsIFwidmlzaWJpbGl0eVwiLCBcImJvb2xlYW5cIiwgdmFsdWUpO1xuICAgICAgICB0aGlzLnBsb3QudXBkYXRlUGxvdHRpbmdEYXRhKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHJhbmdlIG9mIHZhbHVlcyBvdmVyIHdoaWNoIGEgcGFyYW1ldGVyIHNob3VsZCBiZSBwbG90dGVkLlxuICAgICAqIFRoaXMgcHJvcGVydHkgaGFzIG5vIGVmZmVjdCBhdCBhbGwgaWYgdGhlIGZ1bmN0aW9uIHBsb3R0ZWQgZG9lcyBub3QgaGF2ZSBhIGZyZWUgcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSBtaW4gVGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIGZyZWUgcGFyYW1ldGVyLlxuICAgICAqIEBwYXJhbSBtYXggVGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIGZyZWUgcGFyYW1ldGVyLlxuICAgICAqL1xuICAgIHNldFBhcmFtZXRlclJhbmdlKG1pbiwgbWF4KSB7XG4gICAgICAgIGlmIChtYXggPj0gbWluKSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVNldHRlcnMuc2V0QXJyYXlQcm9wZXJ0eSh0aGlzLCBcInBhcmFtZXRlclJhbmdlXCIsIFwibnVtYmVyXCIsIFttaW4sIG1heF0sIDIpO1xuICAgICAgICAgICAgdGhpcy5wbG90LnVwZGF0ZVBsb3R0aW5nRGF0YSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgYEVycm9yIHNldHRpbmcgcGFyYW1ldGVyUmFuZ2U6IExvd2VyIGxpbWl0IGNhbm5vdCBiZSBoaWdoZXIgdGhhbiBvciBlcXVhbCB0byBoaWdoZXIgbGltaXQuYDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFBsb3QgfSBmcm9tIFwiQGxhY2hsYW5kay9wdWxzYXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPc2NpbGxhdG9yQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG5cdHN0YXRpYyBNSU5fRlJFUSA9IDAuMTtcclxuXHRzdGF0aWMgTUFYX0ZSRVEgPSAyO1xyXG5cdHN0YXRpYyBERUZfRlJFUSA9IDE7XHJcblx0c3RhdGljIE1JTl9BTVAgPSAwLjE7XHJcblx0c3RhdGljIE1BWF9BTVAgPSAyO1xyXG5cdHN0YXRpYyBERUZfQU1QID0gMTtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwLCBvcmRlciwgZnJlcXVlbmN5ID0gT3NjaWxsYXRvckNvbXBvbmVudC5ERUZfRlJFUSwgYW1wbGl0dWRlID0gT3NjaWxsYXRvckNvbXBvbmVudC5ERUZfQU1QLCBwaGFzZSA9IDApIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5hcHAgPSBhcHA7XHJcblx0XHR0aGlzLm9yZGVyID0gb3JkZXI7XHJcblx0XHR0aGlzLmZyZXF1ZW5jeSA9IGZyZXF1ZW5jeVxyXG5cdFx0dGhpcy5hbXBsaXR1ZGUgPSBhbXBsaXR1ZGVcclxuXHRcdHRoaXMucGhhc2UgPSBwaGFzZTtcclxuXHJcblx0XHR0aGlzLmlubmVySFRNTCA9IGBcclxuXHRcdFx0PGRpdiBjbGFzcz1cIm9zY2lsbGF0b3ItY29udHJvbHNcIj5cclxuXHRcdFx0XHQ8aDIgY2xhc3M9XCJvc2NpbGxhdG9yLXRpdGxlXCI+T3NjaWxsYXRvciAke3RoaXMub3JkZXIgKyAxfTwvaDI+XHJcblx0XHRcdFx0PGxhYmVsIGNsYXNzPVwib3NjaWxsYXRvci1sYWJlbFwiPlxyXG5cdFx0XHRcdFx0PGlucHV0IGNsYXNzPVwib3NjaWxsYXRvci1zbGlkZXIgZnJlcXVlbmN5LWlucHV0XCIgdHlwZT1cInJhbmdlXCIgbWluPVwiJHtPc2NpbGxhdG9yQ29tcG9uZW50Lk1JTl9GUkVRfVwiIG1heD1cIiR7T3NjaWxsYXRvckNvbXBvbmVudC5NQVhfRlJFUX1cIiBzdGVwPVwiMC4wMVwiIHZhbHVlPVwiJHt0aGlzLmZyZXF1ZW5jeX1cIj5cclxuXHRcdFx0XHRcdEZyZXF1ZW5jeTogPHNwYW4gY2xhc3M9XCJvc2NpbGxhdG9yLWxhYmVsLXZhbHVlXCI+JHt0aGlzLmZyZXF1ZW5jeX08L3NwYW4+SHpcclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHRcdDxsYWJlbCBjbGFzcz1cIm9zY2lsbGF0b3ItbGFiZWxcIj5cclxuXHRcdFx0XHRcdDxpbnB1dCBjbGFzcz1cIm9zY2lsbGF0b3Itc2xpZGVyIGFtcGxpdHVkZS1pbnB1dFwiIHR5cGU9XCJyYW5nZVwiIG1pbj1cIiR7T3NjaWxsYXRvckNvbXBvbmVudC5NSU5fQU1QfVwiIG1heD1cIiR7T3NjaWxsYXRvckNvbXBvbmVudC5NQVhfQU1QfVwiIHN0ZXA9XCIwLjAxXCIgdmFsdWU9XCIke3RoaXMuYW1wbGl0dWRlfVwiPlxyXG5cdFx0XHRcdFx0QW1wbGl0dWRlOiA8c3BhbiBjbGFzcz1cIm9zY2lsbGF0b3ItbGFiZWwtdmFsdWVcIj4ke3RoaXMuYW1wbGl0dWRlfTwvc3Bhbj5tXHJcblx0XHRcdFx0PC9sYWJlbD5cclxuXHRcdFx0XHQ8bGFiZWwgY2xhc3M9XCJvc2NpbGxhdG9yLWxhYmVsXCI+XHJcblx0XHRcdFx0XHQ8aW5wdXQgY2xhc3M9XCJvc2NpbGxhdG9yLXNsaWRlciBwaGFzZS1pbnB1dFwiIHR5cGU9XCJyYW5nZVwiIG1pbj1cIiR7LTIgKiBNYXRoLlBJfVwiIG1heD1cIiR7MiAqIE1hdGguUEl9XCIgc3RlcD1cIjAuMDFcIiB2YWx1ZT1cIiR7dGhpcy5waGFzZX1cIj5cclxuXHRcdFx0XHRcdFBoYXNlIHNoaWZ0OiA8c3BhbiBjbGFzcz1cIm9zY2lsbGF0b3ItbGFiZWwtdmFsdWVcIj4keysoTWF0aC5yb3VuZCgrKCh0aGlzLnBoYXNlL01hdGguUEkpK1wiZSsyXCIpKStcImUtMlwiKX08L3NwYW4+cGlcclxuXHRcdFx0XHQ8L2xhYmVsPlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGZpZ3VyZSBjbGFzcz1cInBoYXNvclwiPjwvZmlndXJlPlxyXG5cdFx0XHQ8ZmlndXJlIGNsYXNzPVwid2F2ZVwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJvc2NpbGxhdG9yLWJ1dHRvbi1iYXJcIj5cclxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaGlkZS1idXR0b25cIj5IaWRlPC9idXR0b24+XHJcblx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImR1cGxpY2F0ZS1idXR0b25cIj5EdXBsaWNhdGU8L2J1dHRvbj5cclxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlLWJ1dHRvblwiPlJlbW92ZTwvYnV0dG9uPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2ZpZ3VyZT5cclxuXHRcdGA7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoXCJvc2NpbGxhdG9yLWNvbnRhaW5lclwiKTtcclxuXHJcblx0XHR0aGlzLnBoYXNvciA9IG5ldyBQbG90KGBwaGFzb3ItJHt0aGlzLm9yZGVyfWAsIHVuZGVmaW5lZCwge1xyXG5cdFx0XHRiYWNrZ3JvdW5kQ1NTOiBcImxpZ2h0c2VhZ3JlZW5cIixcclxuXHRcdFx0bWFqb3JHcmlkbGluZXM6IGZhbHNlLFxyXG5cdFx0XHRtaW5vckdyaWRsaW5lczogdHJ1ZSxcclxuXHRcdFx0bWFqb3JUaWNrczogZmFsc2UsXHJcblx0XHRcdG1pbm9yVGlja3M6IHRydWUsXHJcblx0XHRcdG1pbm9yVGlja1NpemU6IDAuMjUsXHJcblx0XHRcdHhMaW1zOiBbLTMsIDNdLFxyXG5cdFx0XHR5TGltczogWy0zLCAzXVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBoYXNvci5hZGREYXRhKFwicGhhc29yLXgtY29tcG9uZW50XCIsIFtcclxuXHRcdFx0WzAsIHQgPT4gdGhpcy5hbXBsaXR1ZGUqTWF0aC5jb3MoKDIqTWF0aC5QSSp0aGlzLmZyZXF1ZW5jeSp0KSt0aGlzLnBoYXNlKSwgdCA9PiB0aGlzLmFtcGxpdHVkZSpNYXRoLmNvcygoMipNYXRoLlBJKnRoaXMuZnJlcXVlbmN5KnQpK3RoaXMucGhhc2UpXSxcclxuXHRcdFx0WzAsIDAsICh4LCB0KSA9PiB0aGlzLmFtcGxpdHVkZSpNYXRoLnNpbigoMipNYXRoLlBJKnRoaXMuZnJlcXVlbmN5KnQpK3RoaXMucGhhc2UpXVxyXG5cdFx0XSwge1xyXG5cdFx0XHR0cmFjZUNvbG91cjogXCJyZWRcIixcclxuXHRcdFx0bWFya2VyU3R5bGU6IFwiYXJyb3dcIixcclxuXHRcdFx0bWFya2VyQ29sb3VyOiBcInJlZFwiLFxyXG5cdFx0XHR2aXNpYmlsaXR5OiBmYWxzZVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBoYXNvci5hZGREYXRhKFwicGhhc29yXCIsIFtcclxuXHRcdFx0WzAsIHQgPT4gdGhpcy5hbXBsaXR1ZGUqTWF0aC5jb3MoKDIqTWF0aC5QSSp0aGlzLmZyZXF1ZW5jeSp0KSt0aGlzLnBoYXNlKV0sXHJcblx0XHRcdFswLCAoeCwgdCkgPT4gdGhpcy5hbXBsaXR1ZGUqTWF0aC5zaW4oKDIqTWF0aC5QSSp0aGlzLmZyZXF1ZW5jeSp0KSt0aGlzLnBoYXNlKV1cclxuXHRcdF0sIHtcclxuXHRcdFx0dHJhY2VDb2xvdXI6IFwieWVsbG93XCIsXHJcblx0XHRcdG1hcmtlckNvbG91cjogXCJ5ZWxsb3dcIixcclxuXHRcdFx0bWFya2VyU3R5bGU6IFwiYXJyb3dcIlxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLndhdmUgPSBuZXcgUGxvdChgd2F2ZS0ke3RoaXMub3JkZXJ9YCwgdW5kZWZpbmVkLCB7XHJcblx0XHRcdGJhY2tncm91bmRDU1M6IFwibGlnaHRzZWFncmVlblwiLFxyXG5cdFx0XHRtYWpvckdyaWRsaW5lczogZmFsc2UsXHJcblx0XHRcdG1pbm9yR3JpZGxpbmVzOiB0cnVlLFxyXG5cdFx0XHRtYWpvclRpY2tzOiBmYWxzZSxcclxuXHRcdFx0bWlub3JUaWNrczogdHJ1ZSxcclxuXHRcdFx0bWlub3JUaWNrU2l6ZTogMC4yNSxcclxuXHRcdFx0eExpbXM6IFstMiwgMTBdLFxyXG5cdFx0XHR5TGltczogWy0zLCAzXVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLndhdmUuYWRkRGF0YShcIndhdmVcIiwgKHgsIHQpID0+IHRoaXMuYW1wbGl0dWRlKk1hdGguY29zKCgyKk1hdGguUEkqdGhpcy5mcmVxdWVuY3kqKHgtdCkpLXRoaXMucGhhc2UpLCB7XHJcblx0XHRcdHRyYWNlQ29sb3VyOiBcInllbGxvd1wiXHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoYC5mcmVxdWVuY3ktaW5wdXRgKS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZXZlbnQgPT4ge1xyXG5cdFx0XHR0aGlzLmZyZXF1ZW5jeSA9IHBhcnNlRmxvYXQoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuXHRcdFx0dGhpcy51cGRhdGVQbG90cygpO1xyXG5cdFx0XHR0aGlzLmFwcC5yZXN1bHRhbnRPc2NpbGxhdG9yLnVwZGF0ZVBsb3RzKCk7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3NjaWxsYXRvci1sYWJlbC12YWx1ZVwiKS5pbm5lclRleHQgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucXVlcnlTZWxlY3RvcihgLmFtcGxpdHVkZS1pbnB1dGApLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBldmVudCA9PiB7XHJcblx0XHRcdHRoaXMuYW1wbGl0dWRlID0gcGFyc2VGbG9hdChldmVudC50YXJnZXQudmFsdWUpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVBsb3RzKCk7XHJcblx0XHRcdHRoaXMuYXBwLnJlc3VsdGFudE9zY2lsbGF0b3IudXBkYXRlUGxvdHMoKTtcclxuXHRcdFx0ZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5vc2NpbGxhdG9yLWxhYmVsLXZhbHVlXCIpLmlubmVyVGV4dCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5xdWVyeVNlbGVjdG9yKGAucGhhc2UtaW5wdXRgKS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZXZlbnQgPT4ge1xyXG5cdFx0XHR0aGlzLnBoYXNlID0gcGFyc2VGbG9hdChldmVudC50YXJnZXQudmFsdWUpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVBsb3RzKCk7XHJcblx0XHRcdHRoaXMuYXBwLnJlc3VsdGFudE9zY2lsbGF0b3IudXBkYXRlUGxvdHMoKTtcclxuXHRcdFx0ZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5vc2NpbGxhdG9yLWxhYmVsLXZhbHVlXCIpLmlubmVyVGV4dCA9ICsoTWF0aC5yb3VuZCgrKChldmVudC50YXJnZXQudmFsdWUvTWF0aC5QSSkrXCJlKzJcIikpK1wiZS0yXCIpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoYC5oaWRlLWJ1dHRvbmApLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XHJcblx0XHRcdGlmICghdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRkZW5cIikpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHRldmVudC50YXJnZXQuaW5uZXJUZXh0ID0gXCJTaG93XCI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zaG93KCk7XHJcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LmlubmVyVGV4dCA9IFwiSGlkZVwiO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucXVlcnlTZWxlY3RvcihgLnJlbW92ZS1idXR0b25gKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFwcC5yZW1vdmVPc2NpbGxhdG9yKHRoaXMpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoYC5kdXBsaWNhdGUtYnV0dG9uYCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0dGhpcy5hcHAuYWRkT3NjaWxsYXRvcih0aGlzLmZyZXF1ZW5jeSwgdGhpcy5hbXBsaXR1ZGUsIHRoaXMucGhhc2UpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBoYXNvci5zaG93KHRoaXMucXVlcnlTZWxlY3RvcihcIi5waGFzb3JcIikpO1xyXG5cdFx0dGhpcy53YXZlLnNob3codGhpcy5xdWVyeVNlbGVjdG9yKFwiLndhdmVcIikpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlUGxvdHMoKSB7XHJcblx0XHRpZiAoIXRoaXMuYXBwLmFuaW1hdGlvbnNBY3RpdmUpIHtcclxuXHRcdFx0dGhpcy5waGFzb3IudXBkYXRlUGxvdHRpbmdEYXRhKCk7XHJcblx0XHRcdHRoaXMud2F2ZS51cGRhdGVQbG90dGluZ0RhdGEoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHNob3coKSB7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcblx0XHR0aGlzLnBoYXNvci5kYXRhW1wicGhhc29yXCJdLnNldFZpc2liaWxpdHkodHJ1ZSk7XHJcblx0XHR0aGlzLndhdmUuZGF0YVtcIndhdmVcIl0uc2V0VmlzaWJpbGl0eSh0cnVlKTtcclxuXHR9XHJcblxyXG5cdGhpZGUoKSB7XHJcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcblx0XHR0aGlzLnBoYXNvci5kYXRhW1wicGhhc29yXCJdLnNldFZpc2liaWxpdHkoZmFsc2UpO1xyXG5cdFx0dGhpcy5waGFzb3IuZGF0YVtcInBoYXNvci14LWNvbXBvbmVudFwiXS5zZXRWaXNpYmlsaXR5KGZhbHNlKTtcclxuXHRcdHRoaXMud2F2ZS5kYXRhW1wid2F2ZVwiXS5zZXRWaXNpYmlsaXR5KGZhbHNlKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgT3NjaWxsYXRvckNvbXBvbmVudCB9IGZyb20gXCIuL09zY2lsbGF0b3JDb21wb25lbnQuanNcIjtcclxuaW1wb3J0IHsgUmVzdWx0YW50T3NjaWxsYXRvckNvbXBvbmVudCB9IGZyb20gXCIuL1Jlc3VsdGFudE9zY2lsbGF0b3JDb21wb25lbnQuanNcIjtcclxuaW1wb3J0IHsgY29yZSwgUGxvdCwgVGltZSB9IGZyb20gXCJAbGFjaGxhbmRrL3B1bHNhclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBoYXNvcnNBcHAgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJvc2NpbGxhdG9yLWNvbXBvbmVudFwiLCBPc2NpbGxhdG9yQ29tcG9uZW50KTtcclxuXHRcdHdpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJyZXN1bHRhbnQtb3NjaWxsYXRvci1jb21wb25lbnRcIiwgUmVzdWx0YW50T3NjaWxsYXRvckNvbXBvbmVudCk7XHJcblx0XHR0aGlzLmlkID0gXCJhcHBcIjtcclxuXHRcdHRoaXMuYW5pbWF0aW9uc0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5hY3RpdmVPc2NpbGxhdG9ycyA9IFtdO1xyXG5cclxuXHRcdHRoaXMuaW5uZXJIVE1MID0gYFxyXG5cdFx0XHQ8ZGl2IGlkPVwib3NjaWxsYXRvci1zY3JvbGwtYXJlYVwiPjwvZGl2PlxyXG5cdFx0XHQ8aGVhZGVyIGlkPVwiaGVhZGVyLWNvbnRhaW5lclwiPlxyXG5cdFx0XHRcdDxoMSBpZD1cInRpdGxlXCI+VmlzdWFsaXNpbmcgU3VwZXJwb3NpdGlvbiB3aXRoIFBoYXNvcnM8L2gxPlxyXG5cdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwic3RhcnQtYnV0dG9uXCI+UGxheTwvYnV0dG9uPlxyXG5cdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwicGF1c2UtYnV0dG9uXCIgZGlzYWJsZWQ+UGF1c2U8L2J1dHRvbj5cclxuXHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInN0b3AtYnV0dG9uXCIgZGlzYWJsZWQ+U3RvcDwvYnV0dG9uPlxyXG5cdFx0XHQ8L2hlYWRlcj5cclxuXHRcdGA7XHJcblxyXG5cdFx0dGhpcy5yZXN1bHRhbnRPc2NpbGxhdG9yID0gbmV3IFJlc3VsdGFudE9zY2lsbGF0b3JDb21wb25lbnQodGhpcyk7XHJcblx0XHR0aGlzLmluc2VydEJlZm9yZSh0aGlzLnJlc3VsdGFudE9zY2lsbGF0b3IsIHRoaXMucXVlcnlTZWxlY3RvcihcIiNoZWFkZXItY29udGFpbmVyXCIpKTtcclxuXHRcdHRoaXMub3NjaWxsYXRvclNjcm9sbEFyZWEgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIjb3NjaWxsYXRvci1zY3JvbGwtYXJlYVwiKTtcclxuXHJcblx0XHR0aGlzLnN0YXJ0QnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0LWJ1dHRvblwiKTtcclxuXHRcdHRoaXMucGF1c2VCdXR0b24gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIjcGF1c2UtYnV0dG9uXCIpO1xyXG5cdFx0dGhpcy5zdG9wQnV0dG9uID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiI3N0b3AtYnV0dG9uXCIpO1xyXG5cdFx0dGhpcy5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHRUaW1lLnN0YXJ0QWxsKCk7XHJcblx0XHRcdHRoaXMuYW5pbWF0aW9uc0FjdGl2ZSA9IHRydWU7XHJcblx0XHRcdHRoaXMuc3RhcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnBhdXNlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuc3RvcEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcblx0XHRcdFRpbWUucGF1c2VBbGwoKTtcclxuXHRcdFx0dGhpcy5hbmltYXRpb25zQWN0aXZlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuc3RhcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5wYXVzZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuc3RvcEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnN0b3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0VGltZS5zdG9wQWxsKCk7XHJcblx0XHRcdHRoaXMuYW5pbWF0aW9uc0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnN0YXJ0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMucGF1c2VCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnN0b3BCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRhZGRPc2NpbGxhdG9yKC4uLnBhcmFtcykge1xyXG5cdFx0Y29uc3Qgb3NjaWxsYXRvciA9IG5ldyBPc2NpbGxhdG9yQ29tcG9uZW50KHRoaXMsIHRoaXMuYWN0aXZlT3NjaWxsYXRvcnMubGVuZ3RoLCAuLi5wYXJhbXMpO1xyXG5cdFx0dGhpcy5hY3RpdmVPc2NpbGxhdG9ycy5wdXNoKG9zY2lsbGF0b3IpO1xyXG5cdFx0dGhpcy5vc2NpbGxhdG9yU2Nyb2xsQXJlYS5hcHBlbmRDaGlsZChvc2NpbGxhdG9yKTtcclxuXHRcdHRoaXMucmVzdWx0YW50T3NjaWxsYXRvci51cGRhdGVQbG90cygpO1xyXG5cdFx0aWYgKHRoaXMucmVzdWx0YW50T3NjaWxsYXRvci5waGFzb3IuZGF0YVtcInBoYXNvci14LWNvbXBvbmVudFwiXS5wcm9wZXJ0aWVzLnZpc2liaWxpdHkgPT09IHRydWUpIHtcclxuXHRcdFx0b3NjaWxsYXRvci5waGFzb3IuZGF0YVtcInBoYXNvci14LWNvbXBvbmVudFwiXS5zZXRWaXNpYmlsaXR5KHRydWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmVtb3ZlT3NjaWxsYXRvcihvc2NpbGxhdG9yKSB7XHJcblx0XHR0aGlzLmFjdGl2ZU9zY2lsbGF0b3JzLnNwbGljZShvc2NpbGxhdG9yLm9yZGVyLCAxKTtcclxuXHRcdGRlbGV0ZSBjb3JlLmFjdGl2ZUNhbnZhc2VzW2BwaGFzb3ItJHtvc2NpbGxhdG9yLm9yZGVyfWBdO1xyXG5cdFx0ZGVsZXRlIGNvcmUuYWN0aXZlQ2FudmFzZXNbYHdhdmUtJHtvc2NpbGxhdG9yLm9yZGVyfWBdO1xyXG5cdFx0b3NjaWxsYXRvci5yZW1vdmUoKTtcclxuXHRcdGZvciAoY29uc3Qgb3NjIG9mIHRoaXMuYWN0aXZlT3NjaWxsYXRvcnMpIHtcclxuXHRcdFx0aWYgKG9zYy5vcmRlciA+IG9zY2lsbGF0b3Iub3JkZXIgKSB7XHJcblx0XHRcdFx0b3NjLm9yZGVyIC09IDE7XHJcblx0XHRcdFx0b3NjLnF1ZXJ5U2VsZWN0b3IoXCIub3NjaWxsYXRvci10aXRsZVwiKS5pbm5lclRleHQgPSBgT3NjaWxsYXRvciAke29zYy5vcmRlciArIDF9YDtcclxuXHRcdFx0XHRUaW1lLmNhbnZhc1RpbWVEYXRhWygyICogb3NjLm9yZGVyKSArIDRdLmlkID0gYHBoYXNvci0ke29zYy5vcmRlcn1gO1xyXG5cdFx0XHRcdGNvcmUuYWN0aXZlQ2FudmFzZXNbYHBoYXNvci0ke29zYy5vcmRlciArIDF9YF0uc2V0SUQoYHBoYXNvci0ke29zYy5vcmRlcn1gKTtcclxuXHRcdFx0XHRUaW1lLmNhbnZhc1RpbWVEYXRhWygyICogb3NjLm9yZGVyKSArIDVdLmlkID0gYHdhdmUtJHtvc2Mub3JkZXJ9YDtcclxuXHRcdFx0XHRjb3JlLmFjdGl2ZUNhbnZhc2VzW2B3YXZlLSR7b3NjLm9yZGVyICsgMX1gXS5zZXRJRChgd2F2ZS0ke29zYy5vcmRlcn1gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0VGltZS5jYW52YXNUaW1lRGF0YS5zcGxpY2UoKDIgKiBvc2NpbGxhdG9yLm9yZGVyKSArIDIsIDIpO1xyXG5cdFx0dGhpcy5yZXN1bHRhbnRPc2NpbGxhdG9yLnVwZGF0ZVBsb3RzKCk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IFBsb3QgfSBmcm9tIFwiQGxhY2hsYW5kay9wdWxzYXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXN1bHRhbnRPc2NpbGxhdG9yQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG5cdGNvbnN0cnVjdG9yKGFwcCkge1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLmFwcCA9IGFwcDtcclxuXHJcblx0XHR0aGlzLmlubmVySFRNTCA9IGBcclxuXHRcdFx0PGRpdiBjbGFzcz1cIm9zY2lsbGF0b3ItY29udHJvbHNcIj5cclxuXHRcdFx0XHQ8aDIgY2xhc3M9XCJvc2NpbGxhdG9yLXRpdGxlXCI+UmVzdWx0YW50IE9zY2lsbGF0b3I8L2gyPlxyXG5cdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwiYWRkLW9zY2lsbGF0b3ItYnV0dG9uXCI+QWRkIE9zY2lsbGF0b3I8L2J1dHRvbj5cclxuXHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInNob3cteC1jb21wb25lbnRzLWJ1dHRvblwiPjxzcGFuPlNob3c8L3NwYW4+IHggQ29tcG9uZW50czwvYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmxpbmUtb3NjaWxsYXRvci1jb250cm9sc1wiPlxyXG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzaG93LWFsbC1idXR0b25cIj5TaG93IEFsbDwvYnV0dG9uPlxyXG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJoaWRlLWFsbC1idXR0b25cIj5IaWRlIEFsbDwvYnV0dG9uPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PGZpZ3VyZSBpZD1cInJlc3VsdGFudC1waGFzb3JcIiBjbGFzcz1cInBoYXNvclwiPjwvZmlndXJlPlxyXG5cdFx0XHQ8ZmlndXJlIGlkPVwicmVzdWx0YW50LXdhdmVcIiBjbGFzcz1cIndhdmVcIj48L2ZpZ3VyZT5cclxuXHRcdGA7XHJcblx0XHR0aGlzLmlkID0gXCJyZXN1bHRhbnQtb3NjaWxsYXRvclwiO1xyXG5cdFx0dGhpcy5jbGFzc0xpc3QuYWRkKFwib3NjaWxsYXRvci1jb250YWluZXJcIik7XHJcblxyXG5cdFx0Ly9bWzAsIHQgPT4gNCpNYXRoLmNvcyh0KSwgdCA9PiA0Kk1hdGguY29zKHQpKzIqTWF0aC5jb3MoMip0KSwgdCA9PiA0Kk1hdGguY29zKHQpKzIqTWF0aC5jb3MoMip0KStNYXRoLmNvcygzKnQpXSwgWzAsICh4LCB0KSA9PiA0Kk1hdGguc2luKHQpLCAoeCwgdCkgPT4gNCpNYXRoLnNpbih0KSsyKk1hdGguc2luKDIqdCksICh4LCB0KSA9PiA0Kk1hdGguc2luKHQpKzIqTWF0aC5zaW4oMip0KStNYXRoLnNpbigzKnQpXV1cclxuXHJcblx0XHR0aGlzLnBoYXNvciA9IG5ldyBQbG90KFwicmVzdWx0YW50LXBoYXNvclwiLCB1bmRlZmluZWQsIHtcclxuXHRcdFx0YmFja2dyb3VuZENTUzogXCJsaWdodHNlYWdyZWVuXCIsXHJcblx0XHRcdG1ham9yR3JpZGxpbmVzOiBmYWxzZSxcclxuXHRcdFx0bWlub3JHcmlkbGluZXM6IHRydWUsXHJcblx0XHRcdG1ham9yVGlja3M6IGZhbHNlLFxyXG5cdFx0XHRtaW5vclRpY2tzOiB0cnVlLFxyXG5cdFx0XHRtaW5vclRpY2tTaXplOiAwLjI1LFxyXG5cdFx0XHR4TGltczogWy01LCA1XSxcclxuXHRcdFx0eUxpbXM6IFstNSwgNV1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waGFzb3IuYWRkRGF0YShcInBoYXNvci14LWNvbXBvbmVudFwiLCBbXHJcblx0XHRcdFswLCB0ID0+IHRoaXMuYXBwLmFjdGl2ZU9zY2lsbGF0b3JzLnJlZHVjZSgoYWNjLCBvc2MpID0+IGFjYyArIG9zYy5hbXBsaXR1ZGUqTWF0aC5jb3MoKDIqTWF0aC5QSSpvc2MuZnJlcXVlbmN5KnQpK29zYy5waGFzZSksIDApLCB0ID0+IHRoaXMuYXBwLmFjdGl2ZU9zY2lsbGF0b3JzLnJlZHVjZSgoYWNjLCBvc2MpID0+IGFjYyArIG9zYy5hbXBsaXR1ZGUqTWF0aC5jb3MoKDIqTWF0aC5QSSpvc2MuZnJlcXVlbmN5KnQpK29zYy5waGFzZSksIDApXSxcclxuXHRcdFx0WzAsIDAsICh4LCB0KSA9PiB0aGlzLmFwcC5hY3RpdmVPc2NpbGxhdG9ycy5yZWR1Y2UoKGFjYywgb3NjKSA9PiBhY2MgKyBvc2MuYW1wbGl0dWRlKk1hdGguc2luKCgyKk1hdGguUEkqb3NjLmZyZXF1ZW5jeSp0KStvc2MucGhhc2UpLCAwKV1cclxuXHRcdF0sIHtcclxuXHRcdFx0dHJhY2VDb2xvdXI6IFwicmVkXCIsXHJcblx0XHRcdG1hcmtlclN0eWxlOiBcImFycm93XCIsXHJcblx0XHRcdG1hcmtlckNvbG91cjogXCJyZWRcIixcclxuXHRcdFx0dmlzaWJpbGl0eTogZmFsc2VcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waGFzb3IuYWRkRGF0YShcInJlc3VsdGFudC1waGFzb3JcIiwgW1xyXG5cdFx0XHRbMCwgdCA9PiB0aGlzLmFwcC5hY3RpdmVPc2NpbGxhdG9ycy5yZWR1Y2UoKGFjYywgb3NjKSA9PiBhY2MgKyBvc2MuYW1wbGl0dWRlKk1hdGguY29zKCgyKk1hdGguUEkqb3NjLmZyZXF1ZW5jeSp0KStvc2MucGhhc2UpLCAwKV0sXHJcblx0XHRcdFswLCAoeCwgdCkgPT4gdGhpcy5hcHAuYWN0aXZlT3NjaWxsYXRvcnMucmVkdWNlKChhY2MsIG9zYykgPT4gYWNjICsgb3NjLmFtcGxpdHVkZSpNYXRoLnNpbigoMipNYXRoLlBJKm9zYy5mcmVxdWVuY3kqdCkrb3NjLnBoYXNlKSwgMCldXHJcblx0XHRdLCB7XHJcblx0XHRcdHRyYWNlQ29sb3VyOiBcInllbGxvd1wiLFxyXG5cdFx0XHRtYXJrZXJDb2xvdXI6IFwieWVsbG93XCIsXHJcblx0XHRcdG1hcmtlclN0eWxlOiBcImFycm93XCJcclxuXHRcdH0pXHJcblxyXG5cdFx0dGhpcy53YXZlID0gbmV3IFBsb3QoXCJyZXN1bHRhbnQtd2F2ZVwiLCB7XHJcblx0XHRcdGlkOiBcInJlc3VsdGFudC1waGFzb3JcIixcclxuXHRcdFx0ZGF0YTogKHgsIHQpID0+IHRoaXMuYXBwLmFjdGl2ZU9zY2lsbGF0b3JzLnJlZHVjZSgoYWNjLCBvc2MpID0+IGFjYyArIG9zYy5hbXBsaXR1ZGUqTWF0aC5jb3MoKDIqTWF0aC5QSSpvc2MuZnJlcXVlbmN5Kih4LXQpKS1vc2MucGhhc2UpLCAwKSxcclxuXHRcdFx0b3B0aW9uczoge1xyXG5cdFx0XHRcdHRyYWNlQ29sb3VyOiBcInllbGxvd1wiXHJcblx0XHRcdH1cclxuXHRcdH0sIHtcclxuXHRcdFx0YmFja2dyb3VuZENTUzogXCJsaWdodHNlYWdyZWVuXCIsXHJcblx0XHRcdG1ham9yR3JpZGxpbmVzOiBmYWxzZSxcclxuXHRcdFx0bWlub3JHcmlkbGluZXM6IHRydWUsXHJcblx0XHRcdG1ham9yVGlja3M6IGZhbHNlLFxyXG5cdFx0XHRtaW5vclRpY2tzOiB0cnVlLFxyXG5cdFx0XHRtaW5vclRpY2tTaXplOiAwLjI1LFxyXG5cdFx0XHR4TGltczogWy0yLCAxMF0sXHJcblx0XHRcdHlMaW1zOiBbLTUsIDVdXHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIjYWRkLW9zY2lsbGF0b3ItYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmFwcC5hZGRPc2NpbGxhdG9yKCkpO1xyXG5cdFx0dGhpcy5xdWVyeVNlbGVjdG9yKFwiI3Nob3ctYWxsLWJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHRmb3IgKGNvbnN0IG9zY2lsbGF0b3Igb2YgdGhpcy5hcHAuYWN0aXZlT3NjaWxsYXRvcnMpIHtcclxuXHRcdFx0XHRvc2NpbGxhdG9yLnNob3coKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQvLyBUT0RPOiB4LWNvbXBvbmVudHMgYnV0dG9uIGRvZXNuJ3Qgd29yayB0b2dldGhlciB3aXRoIHNob3cvaGlkZSBhbGxcclxuXHRcdHRoaXMucXVlcnlTZWxlY3RvcihcIiNzaG93LXgtY29tcG9uZW50cy1idXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcclxuXHRcdFx0aWYgKGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKFwic3BhblwiKS5pbm5lclRleHQgPT09IFwiU2hvd1wiKSB7XHJcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCJzcGFuXCIpLmlubmVyVGV4dCA9IFwiSGlkZVwiO1xyXG5cdFx0XHRcdHRoaXMucGhhc29yLmRhdGFbXCJwaGFzb3IteC1jb21wb25lbnRcIl0uc2V0VmlzaWJpbGl0eSh0cnVlKTtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IG9zY2lsbGF0b3Igb2YgdGhpcy5hcHAuYWN0aXZlT3NjaWxsYXRvcnMpIHtcclxuXHRcdFx0XHRcdG9zY2lsbGF0b3IucGhhc29yLmRhdGFbXCJwaGFzb3IteC1jb21wb25lbnRcIl0uc2V0VmlzaWJpbGl0eSh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoXCJzcGFuXCIpLmlubmVyVGV4dCA9IFwiU2hvd1wiO1xyXG5cdFx0XHRcdHRoaXMucGhhc29yLmRhdGFbXCJwaGFzb3IteC1jb21wb25lbnRcIl0uc2V0VmlzaWJpbGl0eShmYWxzZSk7XHJcblx0XHRcdFx0Zm9yIChjb25zdCBvc2NpbGxhdG9yIG9mIHRoaXMuYXBwLmFjdGl2ZU9zY2lsbGF0b3JzKSB7XHJcblx0XHRcdFx0XHRvc2NpbGxhdG9yLnBoYXNvci5kYXRhW1wicGhhc29yLXgtY29tcG9uZW50XCJdLnNldFZpc2liaWxpdHkoZmFsc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIjaGlkZS1hbGwtYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcblx0XHRcdGZvciAoY29uc3Qgb3NjaWxsYXRvciBvZiB0aGlzLmFwcC5hY3RpdmVPc2NpbGxhdG9ycykge1xyXG5cdFx0XHRcdG9zY2lsbGF0b3IuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucGhhc29yLnNob3codGhpcy5xdWVyeVNlbGVjdG9yKFwiLnBoYXNvclwiKSk7XHJcblx0XHR0aGlzLndhdmUuc2hvdyh0aGlzLnF1ZXJ5U2VsZWN0b3IoXCIud2F2ZVwiKSk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVQbG90cygpIHtcclxuXHRcdGlmICghdGhpcy5hcHAuYW5pbWF0aW9uc0FjdGl2ZSkge1xyXG5cdFx0XHR0aGlzLnBoYXNvci51cGRhdGVQbG90dGluZ0RhdGEoKTtcclxuXHRcdFx0dGhpcy53YXZlLnVwZGF0ZVBsb3R0aW5nRGF0YSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCB7IFBoYXNvcnNBcHAgfSBmcm9tIFwiLi9QaGFzb3JzQXBwLmpzXCI7XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwicGhhc29ycy1hcHBcIiwgUGhhc29yc0FwcCk7XHJcblxyXG5jb25zdCBhcHAgPSBuZXcgUGhhc29yc0FwcCgpO1xyXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFwcCk7XHJcblxyXG5hcHAuYWRkT3NjaWxsYXRvcigpO1xyXG5hcHAuYWRkT3NjaWxsYXRvcigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9