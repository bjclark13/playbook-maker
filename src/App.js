import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import BoardDrag from './BoardDrag';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Board /> */}

        <BoardDrag />
      </div>
    );
  }
}

export default App;
