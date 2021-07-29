import path from "path";

export default {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.join(path.resolve(), "dist"),
		clean: true
	},
	mode: "production",
	devtool: "source-map"
};
