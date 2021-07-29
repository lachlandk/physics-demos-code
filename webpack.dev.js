import path from "path";

export default {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.join(path.resolve(), "build"),
		clean: true
	},
	mode: "development",
	optimization: {
		usedExports: true,
		innerGraph: true
	},
	devtool: "inline-source-map",
	devServer: {
		contentBase: ".",
		watchContentBase: true,
		hot: true
	}
};
