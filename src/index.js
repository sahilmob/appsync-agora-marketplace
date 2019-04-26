import "element-theme-default";

import * as serviceWorker from "./serviceWorker";

import Amplify from "aws-amplify";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import aws_exports from "./aws-exports";

// Bring in default Element React theme

Amplify.configure(aws_exports);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
