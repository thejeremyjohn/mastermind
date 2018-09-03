import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";
import Game from "./Game";

const App = () => (
  <div>

    <Game />

    <DataProvider
      endpoint="api/highscore/"
      render={data => {
        data.sort((a,b) => b.score - a.score)
        // data = data.map(a => {
        //   const {name, score} = a;
        //   return {id, name, score};
        // })
        return (
          <div className="highscores">
            <Table data={data} tableName='Highscores' />
          </div>
        )
      }}
    />

  </div>
);

const wrapper = document.getElementById("app");

wrapper ? ReactDOM.render(<App />, wrapper) : null;
