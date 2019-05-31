import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import { h, app } from "hyperapp";

const state = {};
const actions = {};

const view = (state, actions) => (
  <div>
    <h1> Hello World</h1>
  </div>
);

const main = app(state, actions, view, document.querySelector("#app"));
