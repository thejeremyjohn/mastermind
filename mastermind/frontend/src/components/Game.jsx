import React, { Component } from "react";
import Table from "./Table";
import sampleSize from 'lodash/sampleSize'
import Inputmask from 'inputmask';


export default class Game extends Component {

  constructor(props) {
    super(props)
    this.takeTurn = this.takeTurn.bind(this)
    this.addHighscore = this.addHighscore.bind(this)
    this.state = {
      guess:'', message:'', name:'', history:[], highscores:[],
     };
  }

  componentDidMount() {
    this.getHighscores();
    this.newGame();
    mask('guess-input');
  }

  newGame() {
    this.secret = sampleSize('0123456789', 4);
    this.turnsRemaining = 10;
    this.score = 0;
    this.gameWon = false;
    this.started = false;
    this.startTime = null;
    this.endTime = null;
    const { name, highscores } = this.state;
    this.setState({
      guess:'', message:'', name, history:[], highscores,
    })
    this.guessInput.focus();
  }

  takeTurn(e) {
    e.preventDefault();
    let guess = unmask(this.state.guess);

    if (validInput(guess)) {
      this.turnsRemaining--;
      let result = this.compare(guess);
      let history = this.concatHistory(result);
      this.setState({ guess:'', message:'', history })
      this.evaluate(result);
    } else {
      this.setState({ message: 'need 4 unique digits' })
    }
  }

  compare(guess) {
    let secret = this.secret;
    const result = {white: 0, red: 0};
    for (var i = 0; i < this.secret.length; i++) {
      if (guess[i] === secret[i]) {
        result.red++;
      } else if (secret.includes(guess[i])) {
        result.white++;
      }
    }
    return result;
  }

  evaluate(result) {
    if (result.red === 4) {
      this.gameWon = true;
      this.endTime = new Date();
      let basePoints = (this.turnsRemaining+1) * 1000000000;
      let speedModifier = (this.endTime - this.startTime);
      this.score = Math.floor( basePoints/speedModifier );
      this.setState({ message: `YOU WIN !!! Your score is ${this.score}` });
    } else if (this.turnsRemaining===0) {
      this.setState({ message: 'You Lose' });
    };

    if (this.gameWon || this.turnsRemaining===0) {
      let guessForm = document.querySelector(".guess-form");
      toggleDisabled(guessForm);
    }
  }

  concatHistory(result) {
    const {white, red} = result;
    const historyItem = {
      id: this.state.history.length,
      guess: this.state.guess,
      white, red
    };
    return this.state.history.concat(historyItem)
  }

  addHighscore(e) {
    e.preventDefault();
    let nameForm = document.querySelector(".name-form");
    toggleDisabled(nameForm);

    const highscore = {
      name: this.state.name,
      score: this.score,
    };
    const conf = {
      method: "post",
      body: JSON.stringify(highscore),
      headers: new Headers({ "Content-Type": "application/json" }),
      redirect: 'follow',
    };
    fetch('api/highscore/', conf)
      .then(response => {
        if (!response.ok) console.log(response);
        this.getHighscores();
      });
  }

  getHighscores() {
    fetch("api/highscore/")
      .then(response => {
        if (!response.ok) console.log(response);
        return response.json();
      })
      .then(data => {
        data.sort((a,b) => b.score - a.score);
        let highscores = data.slice(0, 10);
        this.setState({ highscores });
      })
  }


  runTimer = () => {
    if (!this.started && unmask(this.state.guess).length>0) {
      this.started = true;
      this.startTime = new Date();
    }
  }

  update(field) {
    this.runTimer();
    return (e) => {
      this.setState({ [field]: e.target.value })
    };
  }

  // <h1>{this.secret}</h1>
  render() {
    return (
      <div className="inner-container">
        <h1 className="page-header">M A S T E R M I N D</h1>

        <div className="how-to-play">
          <p>
            <strong>How to play:</strong> Figure out the 4-digit code.
            Every digit is unique. You have up to 10 turns to solve the code.
            The faster you solve, the higher your score.
          </p>
          <p className="hint">
            <strong>white</strong> = correct digits in the wrong position.
            <strong>red</strong> = correct digits in the correct position.
          </p>
        </div>

        <div className="game-container">
          <div className="game">
            <form className="guess-form" onSubmit={this.takeTurn}>
              <input
                id="guess-input" className="guess form-field" type="text"
                ref={(input) => { this.guessInput = input; }}
                value={this.state.guess} autoComplete='off'
                onChange={this.update('guess')}
              ></input>
              <input className="guess form-button" type="submit" value='GO'></input>
            </form>
            <h2 className="turns-remaining">
              {`${this.turnsRemaining} turn${this.turnsRemaining>1 ? 's' : ''} remaining`}
            </h2>
            <h3 className="message"><strong>{this.state.message}</strong></h3>

            {this.highscoreForm()}
            {this.playAgainButton()}
          </div>

          <div className="history">
            <Table data={this.state.history} tableName='History' />
          </div>
        </div>

        <div className="highscores">
          <Table data={this.state.highscores} tableName='Highscores' />
        </div>
      </div>
    )
  }

  highscoreForm() {
    if (this.gameWon) {
      return (
        <form className="name-form" onSubmit={this.addHighscore}>
          <input
            className="form-field" type="text" required
            placeholder="name"
            maxLength="15"
            value={this.state.name}
            onChange={this.update('name')}
          ></input>
        <input
          id="save-score" className="form-button"
          type="submit" value='Save Score'
        ></input>
        </form>
      )
    }
  }

  playAgainButton() {
    if (this.gameWon || !this.turnsRemaining) {
      return (
        <div>
          <button
            className="play-again"
            onClick={() => {
              let guessForm = document.querySelector(".guess-form");
              toggleDisabled(guessForm);
              this.newGame();
            }}
            >Play Again
          </button>
        </div>
      )
    }
  }

}

const mask = (elementId) => {
  Inputmask({'mask': '9 - 9 - 9 - 9'}).mask(
    document.getElementById(elementId)
  );
}

const unmask = (code) => {
  if (code) {
    return code.split(' - ').filter(x => x !== '_');
  }
  return [];
}

const validInput = (guess) => {
  guess = new Set(guess);
  return guess.size === 4;
};

const toggleDisabled = (selector, toggleChild=true) => {
  if (selector.getAttribute('disabled') === null) {
    selector.setAttribute('disabled', '');
  } else {
    selector.removeAttribute('disabled');
  };
  if (toggleChild) {
    for (let i=0; i<selector.childElementCount; i++) {
      toggleDisabled(selector.children[i]);
    }
  }
};
