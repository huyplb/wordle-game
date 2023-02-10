import { useState } from "react";
import { WORDS } from "./words.js";
import './App.css';
 
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

function App() {
  const NUMBER_OF_GUESSES = 6;
  const [nextLetter,setNextLetter] = useState(0)
  const [guessesRemaining,setGuessesRemaining] = useState(NUMBER_OF_GUESSES)
  
  const [grid, setGrid] = useState([[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]]);
  const [gridcolor, setGridcolor] = useState(["is-light", "is-light", "is-light", "is-light", "is-light","is-light", "is-light", "is-light", "is-light", "is-light","is-light", "is-light", "is-light", "is-light", "is-light","is-light", "is-light", "is-light", "is-light", "is-light","is-light", "is-light", "is-light", "is-light", "is-light","is-light", "is-light", "is-light", "is-light", "is-light"]);

  
  const handleKeyUp = (e) => {
    // debugger
    let pressedKey = String(e.key);
    let found = pressedKey.match(/[a-z]/gi);
    
   if (pressedKey === "Backspace" && nextLetter > -1) {
    deleteLetter();
    return;
  }
  if (pressedKey === "Enter" && nextLetter === 4) {
    setGuessesRemaining(guessesRemaining - 1)
    setNextLetter(0)
    checkGuess();
    return;
  }
    if (!found || found.length > 1) {
      return;
    } else {
      addCharacter(pressedKey);
    }
  }
  

  const changeValue = (x, y, value) => {
    const updatedGrid = [...grid];
    updatedGrid[x][y] = value;
    setGrid(updatedGrid);
  };

  const deleteLetter = () => {
    if (grid[0][0] === "")
      return
    let row = 6 - guessesRemaining; 
    changeValue(row,nextLetter,"")  
    if (nextLetter === 0) {
      setNextLetter(0)
      return
    }
    setNextLetter(nextLetter - 1)
  }

  const addCharacter = (character) => {
    
    let row = 6 - guessesRemaining;
    if (nextLetter === 4) {
      changeValue(row,nextLetter,character)
      return
    }
    changeValue(row,nextLetter,character)
    setNextLetter(nextLetter + 1)
  }

  const checkGuess= () => {
    
    let row = 6 - guessesRemaining;
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    let currentGuess = grid[row];
    for (const val of currentGuess) {
      guessString += val;
    }
  
    if (guessString.length !== 5) {
      console.log("Not enough letters!");
      return;
    }
  
    if (!WORDS.includes(guessString)) {
      console.log("Word not in list!");
      return;
    }
  
    const changeColor = [...gridcolor];
    //check green
    for (let i = 0; i < 5; i++) {
      if (rightGuess[i] === currentGuess[i]) {        
        changeColor[row*5+i] = "is-success flip";
        // console.log(gridcolor[row*5+i])
        rightGuess[i] = "#";
      }
    }
      //check yellow
      //checking guess letters
    for (let i = 0; i < 5; i++) {
      if (gridcolor[row][i] === "is-success") continue;
      //checking right letters
      for (let j = 0; j < 5; j++) {
        if (rightGuess[j] === currentGuess[i]) {
          changeColor[row*5+i] = "is-warning bounce-out-down";
          rightGuess[j] = "#";
        }
      }
    }

    setGridcolor(changeColor);


    if (guessString === rightGuessString) {
      for (let i = 0; i < 5; i++) {
          changeColor[row*5+i] = "is-success shake";
      }
      setGridcolor(changeColor);

      guessesRemaining = 0;
      return;
    } else {
      guessesRemaining -= 1;
      currentGuess = [];
      nextLetter = 0;
  
      if (guessesRemaining === 0) {
        alert(`You've run out of guesses! Game over! . The right word was: "${rightGuessString}"`);
      }
    }


  }
  

  return (
    
    <div onKeyUp={(e) => handleKeyUp(e)} className={"Game-board"}>
    <h1>Welcome to Wordle Game!</h1>
    <br/>
      {
        grid.map((row, i) => (
        <div key={i} className='buttons'  >
          {
            row.map((col, j) => (
            <button key={j} className={ 'button ' +  gridcolor[5*i + j] + ' letter'  }>
              {grid[i][j] === 0? "": grid[i][j] }
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
