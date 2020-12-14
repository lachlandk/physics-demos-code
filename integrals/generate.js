let difficulty = {
	powerRule: true,
	exponential: true,
	naturalLog: true,
	classes: function(){
		let classes = [];
		difficulty.powerRule ? classes.push("polynomial", "binomial") : null;
		difficulty.exponential ? classes.push("exponential") : null;
		difficulty.naturalLog ? classes.push("naturalLog") : null;
		return classes
	}
};

function num(min=0, max=11){
	return Math.floor(Math.random() * (max - min) ) + min;
}

function term(power, nonZero=false){
	let coeff = nonZero ? num(1) : num();
	if (power === ""){
		return coeff === 0 ? "" : coeff.toString()
	} else {
		return coeff === 0 ? "" : coeff === 1 ? power : coeff + power
	}
}

// change this, degree should always be non zero
function polynomial(degree=5, nonZeroDegrees=[]){
	let terms = [];
	terms.unshift(nonZeroDegrees.includes(0) ? term("", true) : term(""));
	terms.unshift(nonZeroDegrees.includes(1) ? term("x", true) : term("x"));
	if (degree >= 2 && Math.random() <= 1/2){
		terms.unshift(nonZeroDegrees.includes(2) ? term("x^2", true) : term("x^2"))
	}
	if (degree >= 3 && Math.random() <= 1/3){
		terms.unshift(nonZeroDegrees.includes(3) ? term("x^3", true) : term("x^3"))
	}
	if (degree >= 4 && Math.random() <= 1/4){
		terms.unshift(nonZeroDegrees.includes(4) ? term("x^4", true) : term("x^4"))
	}
	if (degree >= 5 && Math.random() <= 1/5){
		terms.unshift(nonZeroDegrees.includes(5) ? term("x^5", true) : term("x^5"))
	}
	terms.forEach(function(item, index){
		if (!item){
			terms.splice(index, 1)
		}
	});
	let polynomial = "(";
	for (let i=0; i<terms.length; i++){
		polynomial += i === terms.length - 1 ? terms[i] : terms[i] + " + "
	}
	polynomial += ")";
	return polynomial
}

function binomial(){
	let binomial = "";
	let coeff = num(1);
	binomial += coeff === 1 ? "(" : coeff + "(";
	binomial += polynomial(1, [0, 1]) + ")^{";
	binomial += num(2, 30) + "}";
	return binomial
}

function exponential(){
	let exponential = "";
	exponential += Math.round(Math.random()) === 0 ? "e^{" : num(2) + "^{";
	exponential += polynomial(1, [1]) + "}";
	if (exponential.charAt(0) === "e"){
		let coeff = num(1);
		exponential = coeff === 1 ? exponential : coeff + exponential
	}
	return exponential
}

function naturalLog(){
	return "\\frac{" +num(1) + "}{" + polynomial(1, [0, 1]) + "}"
}

function generate(){
	let terms = [];
	let i = 1;
	while (Math.random() >= 1/i) {
		switch (difficulty.classes()[Math.floor(Math.random() * difficulty.classes().length)]) {
			case "polynomial":
				terms.unshift(polynomial());
				break;
			case "binomial":
				terms.unshift(binomial());
				break;
			case "exponential":
				terms.unshift(exponential());
				break;
			case "naturalLog":
				terms.unshift(naturalLog());
				break;
		}
		i++;
	}
	terms.forEach(function(item, index){
		if (!item){
			terms.splice(index, 1)
		}
	});
	let expression = "\\int";
	for (let i=0; i<terms.length; i++){
		expression += i === terms.length - 1 ? terms[i] : terms[i] + " + "
	}
	expression += "\\space dx";
	return expression
}

function display(){
	document.getElementById("generate-button").disabled = true;
	document.getElementById("integral").innerHTML = "\\[" + generate() + "\\]";
	MathJax.texReset();
	MathJax.typesetClear();
	MathJax.typesetPromise().then(document.getElementById("generate-button").disabled = false);
}

window.addEventListener("load", function(){
	display();
});
