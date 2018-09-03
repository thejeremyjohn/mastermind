import React, { Component } from "react";
import Table from "./Table";
import sampleSize from 'lodash/sampleSize'
import Inputmask from 'inputmask';

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
}


class Game extends Component {

  constructor(props) {
    super(props)
    this.takeTurn = this.takeTurn.bind(this)
    this.addHighscore = this.addHighscore.bind(this)
    this.state = {
      history: new Array, guess: '',
      message: '', playerName: ''
     };
    this.newGame();
  }

  newGame() {
    this.secret = sampleSize('0123456789', 4);
    this.turns = 10;
    this.turnsRemaining = this.turns;
    this.gameWon = false;
    this.score = 0;
    this.started = false;
    this.startTime = null;
    this.endTime = null;
  }

  componentDidMount() {
    if (!this.started) {
      const {playerName} = this.state;
      this.setState({
        history: [], guess: '',
        message: '', playerName
      })
    }
    // mask('secret-id');
    mask('guess-input');
    this.guessInput.focus();
  }

  // componentDidUpdate(){
  //   window.state = this.state;
  // }

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

  takeTurn(e) {
    e.preventDefault();
    let result, logEntry, newState;
    let message = '';

    let guess = unmask(this.state.guess);
    if (validInput(guess)) {
      this.turnsRemaining--;

      result = this.compare(guess);
      if (result.red === 4) {
        this.gameWon = true;
        this.endTime = new Date();
        let elapsed = (this.endTime - this.startTime)
        let modifier = this.turnsRemaining * 10
        this.score = Math.floor(
          Math.max(1, 600000/elapsed) * modifier
        )
        message = `YOU WIN !!!
          your score is ${this.score}`;
      };

      const {red, white} = result
      logEntry = {
        id: this.state.history.length,
        guess: this.state.guess,
        white, red
      }

      newState = Object.assign({}, this.state, {
        guess: '',
        message: message,
        history: this.state.history.concat(logEntry),
      });
    } else {
      newState = Object.assign({}, this.state, {
        message: 'need 4 unique digits'
      })
    }
    this.setState(newState)
  }

  addHighscore(e) {
    e.preventDefault();
    const highscore = {
      name: this.state.playerName,
      score: this.score,
    };
    console.log(highscore);
    const conf = {
      method: "post",
      body: JSON.stringify(highscore),
      headers: new Headers({ "Content-Type": "application/json" }),
      redirect: 'follow',
    };
    fetch('api/highscore/', conf).then(response => console.log(response));
  }

  // <h1 id="secret-id">{this.secret}</h1>
  render() {
    return (
      <div>

        <div className="how-to-play">
          <p>
            <strong>How to play:</strong> Figure out the 4-digit code. Every digit is unique. You will have 10 turns to solve the code. The faster you solve the higher your score.
          </p>
          <p className="hint">
            <strong>white</strong> = correct digits in the wrong position. <strong>red</strong> = correct digits in the correct position.
          </p>
        </div>


        <div className="game-container">
          <div className="game">
            <form className="guess-form" onSubmit={this.takeTurn}>
              <input id="guess-input" className="form-field" type="text"
                ref={(input) => { this.guessInput = input; }}
                value={this.state.guess}
                onChange={this.update('guess')}
                autoComplete='off'
              ></input>
              <input id="go-button" className="form-button" type="submit" value='GO'></input>
            </form>

            <h2 className="turns-remaining">
              {`${this.turnsRemaining} turn${this.turnsRemaining>1 ? 's' : ''} remaining`}
            </h2>

            <h3 className="message">{this.state.message}</h3>
            {this.highscoreForm()}
          </div>

          <div className="history">
            <Table data={this.state.history} tableName='History' />
          </div>
        </div>


      </div>
    )
  }

  highscoreForm() {
    if (this.gameWon) {
      return (
        <form className="" onSubmit={this.addHighscore}>
          <input type="text"
            value={this.state.playerName}
            onChange={this.update('playerName')}
            required
          ></input>
        <input type="submit" value='submit'></input>
        </form>
      )
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

}

export default Game;
