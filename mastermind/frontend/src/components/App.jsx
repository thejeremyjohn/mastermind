import React from "react";
import ReactDOM from "react-dom";
import Table from "./Table";
import Game from "./Game";

const App = () => (
    <Game />
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;
