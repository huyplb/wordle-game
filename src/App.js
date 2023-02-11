import { useState,useEffect } from "react";
// import { WORDS } from "./words.js";
import './App.css';
import congrats from './congrats_fkscna.gif'; // with import


// let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
// console.log(rightGuessString);
var words ;
var word;
let rightGuessString = "";
let hintGuessString = "";


function App() {
  const wordLength = 4
  const NUMBER_OF_GUESSES = 4;
  const [show, setShow] = useState(false);
  const [instruction, setInstruction] = useState(false);
  const [ismodal, setIsmodal] = useState(false);


  
  const [isDark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const [nextLetter,setNextLetter] = useState(0)
  const [guessesRemaining,setGuessesRemaining] = useState(NUMBER_OF_GUESSES)
  const [grid, setGrid] = useState([["", "", "", ""],["", "", "", ""],["", "", "", ""],["", "", "", ""]]);
  const [gridcolor, setGridcolor] = useState([["is-light is-warning", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"]]);
  
  const readStream = async (stream) => {
    const reader = stream.getReader();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }
    return JSON.parse(result);
  }

  const fetchData = async () => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
            headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
            "content-type": "application/json"
            },
        });
        const stream = await res.body;
        const data = await readStream(stream);
        if (rightGuessString === "") {
          words = data["dictionary"];
          word= words[Math.floor(Math.random() * words.length)];
          rightGuessString = word["word"]
          hintGuessString = word["hint"]
          setLoading(false);
          console.log(rightGuessString);
        }
  }

    useEffect(() => {
      if (rightGuessString === "") {
        fetchData();
      }
    },[])

  const startGame = () =>{
    setGuessesRemaining(NUMBER_OF_GUESSES)
    setNextLetter(0)
    setGrid([["", "", "", ""],["", "", "", ""],["", "", "", ""],["", "", "", ""]]);
    setGridcolor([["is-light is-outlined", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"]]);
  
  }

  const handleKeyUp = (e) => {
    // debugger
    let pressedKey = String(e.key);
    let found = pressedKey.match(/[a-z]/gi);
    
   if (pressedKey === "Backspace" && nextLetter > -1) {
    deleteLetter();
    return;
  }
  if (pressedKey === "Enter" ) {
    /* Calling the function checkGuess() */
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

  const changePoniter = (x, y, value) => {
    const updatedGrid = [...gridcolor];
    updatedGrid[x][y] = value;
    setGridcolor(updatedGrid);
  };


  const deleteLetter = () => {
    if (grid[0][0] === "")
      return
    let row = NUMBER_OF_GUESSES - guessesRemaining; 
    changeValue(row,nextLetter,"")  
    if (nextLetter === 0) {
      setNextLetter(0)
      return
    }
    setNextLetter(nextLetter - 1)
  }

  const addCharacter = (character) => {
    
    let row = NUMBER_OF_GUESSES - guessesRemaining;
    changePoniter(row,nextLetter-1,"is-light")

    if (nextLetter === 3) {
      changeValue(row,nextLetter,character)
      if (grid[row][nextLetter] !== ""){
        changePoniter(row,nextLetter,"is-light is-warning")
      }
      return
    }
    changeValue(row,nextLetter,character)
    setNextLetter(nextLetter + 1)

    changePoniter(row,nextLetter,"is-light is-warning")
  }

  const checkGuess= () => {
    
    let row = NUMBER_OF_GUESSES - guessesRemaining;
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    let currentGuess = grid[row];
    for (const val of currentGuess) {
      guessString += val;
    }
  
    if (guessString.length !== wordLength) {
      alert("Not enough letters!");
      return;
    }
    else {
      setGuessesRemaining(guessesRemaining - 1)
      setNextLetter(0)
    }

    // const exists = words.filter(w => w.word === guessString);
    // if (!exists) {
    //   console.log("Word not in list!");
    //   return;
    // }
  
    const changeColor = [...gridcolor];
    //check green
    for (let i = 0; i < wordLength; i++) {
      if (rightGuess[i].toLowerCase() === currentGuess[i].toLowerCase()) {   
        changeColor[row][i] = "is-success flip";
      }
    }
      //check yellow
      //checking guess letters
    for (let i = 0; i < wordLength; i++) {
      if (changeColor[row][i] === "is-success flip") continue;
      //checking right letters
      for (let j = 0; j < wordLength; j++) {
        if (rightGuess[j].toLowerCase() === currentGuess[i].toLowerCase()) {
          changeColor[row][i] = "is-warning bounce-out-down";
          
        }
      }
    }

    setGridcolor(changeColor);
    changePoniter(row,nextLetter,"is-light")
    if ((row + 1) < NUMBER_OF_GUESSES)
      changePoniter(row+1,0,"is-light is-warning")

    if (guessString.toLowerCase() === rightGuessString.toLowerCase()) {
      for (let i = 0; i < wordLength; i++) {
          changeColor[row][i] = "is-success shake";
      }
       // Show popup congratulation
       debugger
       setIsmodal(true)
      setGridcolor(changeColor);
      setGuessesRemaining(0)
     
      return;
    } else {
      setGuessesRemaining(-1)
      setNextLetter(0)
      currentGuess = [];
      if (guessesRemaining === 0) {
        alert(`You've run out of guesses! Game over! . The right word was: "${rightGuessString}"`);
      }
    }
  }

  const showModal = () => 
  (
      <div className={`modal is-active`}>
        <div className="modal-background" onClick={() => setIsmodal(false)} />
        <div className="modal-card">
          <section className="modal-card-body">
            <img src={congrats}/>
          </section>
        </div>
      </div>
  )

  return (
    <div style={{ backgroundColor: isDark ? 'black' : 'white' }}
    onKeyUp={(e) => handleKeyUp(e)} className={"container Game-board "}>   
    <nav style={{width: "100%", backgroundColor: isDark ? 'black' : 'white'}}  className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-light is-rounded" onClick={() => setDark(!isDark)}>
              <span className="icon">&#9681;</span> 
              </a>       
              <a className="button is-light is-rounded" onClick={() => setInstruction(!instruction)}  >
              <span className="icon"><strong>?</strong></span>
              </a>  
              <a className="button is-light is-rounded" onClick={() => setShow(!show)} >
              <span className="icon"><strong>i</strong></span>  
            </a>                
            </div>
          </div>
        </div>
      </nav>
    <h1 className="title">Welcome to Wordle Game!</h1>
    <br/>
      {
        grid.map((row, i) => (
        <div key={i} className='buttons'  >
          {
            row.map((col, j) => (
            <button key={j} className={ 'button ' +  gridcolor[i][j] + ' letter'  }>
              {grid[i][j] === 0? "": grid[i][j] }
            </button>
          ))}
        </div>
      ))}
      {show && <div className="box fade-in">{hintGuessString}</div>}
      {instruction && <div className="box fade-in">Please Google search how to play wordle game.</div>}
      
      {loading ? (
        <button className={ 'button is-primary is-loading' } disabled>Loading...</button>
      ) : (
        <button className={ 'button is-primary ' } onClick={() => startGame()}> Start Game </button>
      )}
      {ismodal && showModal()}
    </div>
  );
}

export default App;
