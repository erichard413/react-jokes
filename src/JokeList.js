import React, {useState, useEffect} from 'react';
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


const JokeList = () => {
    const numJokesToGet = 5;
    let sortedJokes = []
    const [jokes, setJokes] = useState({
            jokes: [],
            isLoading: true
    })

    useEffect(()=>{
      let data = getJokesFromLS();
      data !== null && setJokes(data);
      getJokes();
    }, [])

    useEffect(()=> {
      if (jokes.jokes) {
         sortedJokes = jokes.jokes.sort((a, b) => b.votes - a.votes);
      }
      localStorage.setItem('jokes', JSON.stringify(jokes))     
    }, [jokes])

    const getJokesFromLS = () => {
      let data = JSON.parse(localStorage.getItem('jokes') || null)
      return data;
    }

    const getJokes = () => {
          // load jokes one at a time, adding not-yet-seen jokes
          const asyncJokes = async () => {
          let newJokes = [];
          let seenJokes = new Set();
          let savedJokes = jokes.jokes.filter(j => j.isLocked === true);
          savedJokes.map(sj => newJokes.push(sj));
            while (newJokes.length < numJokesToGet) {
                const res =  await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
                });
        
                let joke = res.data
                
                if (seenJokes.has(joke.id)) {
                    console.log("duplicate found!");
                  } else {
                    seenJokes.add(joke.id);
                    newJokes.push({ ...joke, votes: 0, isLocked: false });
                  }
          }
          setJokes({
            jokes: [...newJokes],
            isLoading: false
          });
        }
        asyncJokes();
    }

      /* empty joke list, set to loading state, and then call getJokes */

    const generateNewJokes = () => {
    setJokes({ isLoading: true});
    getJokes();
    }

    const vote = (id, delta) => {
          let copy = {...jokes}
          copy.jokes.map(j => j.id === id ? j.votes = j.votes + delta:"");
          setJokes(copy);
          
    }

    const resetVotes = () => {
      let copy = {...jokes}
      copy.jokes.map(j => j.votes = 0)
      setJokes(copy);
    }
    
    if (jokes.jokes) {
      sortedJokes = jokes.jokes.sort((a, b) => b.votes - a.votes);
    }

    if (jokes.isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    const toggleLock = (id) => {
      let joke = jokes.jokes.filter(j => j.id === id)
      joke[0].isLocked = joke[0].isLocked ? false : true
      let jokesCopy = {...jokes};
      jokesCopy.jokes.map(j=> j.id === id ? joke[0] : j);
      setJokes(jokesCopy);
    }

    return (
        
        <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>
            {sortedJokes.map(j => <Joke key={j.id} id={j.id} vote={vote} votes={j.votes} isLocked={j.isLocked} toggleLock={toggleLock} text={j.joke} />)}
        <button className="JokeList-resetvotes" onClick={resetVotes}>Reset Votes</button>
        </div>
    )
}

export default JokeList;