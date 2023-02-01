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
        getJokes();
    }, [])

    useEffect(()=> {
      if (jokes.jokes) {
         sortedJokes = jokes.jokes.sort((a, b) => b.votes - a.votes);
      } 
     
    }, [jokes])

    const getJokes = () => {
          // load jokes one at a time, adding not-yet-seen jokes
          const asyncJokes = async () => {
          let newJokes = [];
          let seenJokes = new Set(); 
            let i = 0;
            while (newJokes.length < numJokesToGet && i < 10) {
                const res =  await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
                });
        
                let joke = res.data
                
                if (seenJokes.has(joke.id)) {
                    console.log("duplicate found!");
                  } else {
                    seenJokes.add(joke.id);
                    newJokes.push({ ...joke, votes: 0 });
                  }
                  i++;

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

    return (
        
        <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>
            <p>Jokes go here</p>
            {sortedJokes.map(j => <Joke key={j.id} id={j.id} vote={vote} votes={j.votes} text={j.joke} />)}
        </div>
    )
}

export default JokeList;