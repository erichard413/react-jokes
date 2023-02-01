import React, { Component } from "react";
import JokeList from "./JokeList";
import JokeListClasses from './JokeList-classes';


/** App component. Renders list of jokes. */

class App extends Component {
  render() {
    return (
      <div className="App">
        <JokeList />
      </div>
    );
  }
}

export default App;
