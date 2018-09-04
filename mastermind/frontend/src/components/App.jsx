import React from "react";
import { HashRouter, Route } from 'react-router-dom';
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";
import Game from "./Game";

const App = () => (
  <HashRouter>
    <div>
      <Route path='/' exact component={Game} />

      <Route path='/highscores' exact render={() => (
          <DataProvider
            endpoint="api/highscore-all/"
            render={data => {
              let allHighscores = data.map((el, idx) => (
                Object.assign({}, el, {rank: idx+1})
              ));
              return (
                <Table
                  data={allHighscores}
                  tableName='all highscores'
                />
              )
            }}
          />
      )} />
    </div>
  </HashRouter>
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;
