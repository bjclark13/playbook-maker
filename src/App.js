import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import BoardDrag from './BoardDrag';
import Editor from './Editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Board /> */}
        <Editor />
        <BoardDrag />
      </div>
    );
  }
}

export default App;
