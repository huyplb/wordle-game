import { useState,useEffect } from "react";
import './App.css';
import congrats from './congrats_fkscna.gif'; // with import

var words ;
var word;
let theAnswer = "";
let hintGuessString = "";


function App() {
  const wordLength = 4
  const guessing_times = 4;
  const [show, setShow] = useState(false);
  const [instruction, setInstruction] = useState(false);
  const [modal, setModal] = useState(false);
  const [isDark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tile_index,setTileIndex] = useState(0)
  const [answerRemaining,setAnswerRemaining] = useState(guessing_times)
  const [matrix, setMatrix] = useState([["", "", "", ""],["", "", "", ""],["", "", "", ""],["", "", "", ""]]);
  const [matrixCss, setMatrixCss] = useState([["is-light is-warning", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"]]);
  
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
        if (theAnswer === "") {
          words = data["dictionary"];
          word= words[Math.floor(Math.random() * words.length)];
          theAnswer = word["word"]
          hintGuessString = word["hint"]
          setLoading(false);
          console.log(theAnswer);
        }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyUp);

    return () => window.removeEventListener("keydown", handleKeyUp);
  });


  useEffect(() => {
    if (theAnswer === "") {
      fetchData();
    }
  },[])

  const startGame = () =>{

    word= words[Math.floor(Math.random() * words.length)];
    theAnswer = word["word"]
    hintGuessString = word["hint"]
    console.log(theAnswer)
    setAnswerRemaining(guessing_times)
    setTileIndex(0)
    setMatrix([["", "", "", ""],["", "", "", ""],["", "", "", ""],["", "", "", ""]]);
    setMatrixCss([["is-light is-warning", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"],["is-light", "is-light", "is-light", "is-light"]]);
    
  }

  const handleKeyUp = (e) => {
    let pressedKey = String(e.key);
    let found = pressedKey.match(/[a-z]/gi);
    
   if (pressedKey === "Backspace" && tile_index > -1) {
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
    const updatedMatrix = [...matrix];
    updatedMatrix[x][y] = value;
    setMatrix(updatedMatrix);
  };

  const changePointer = (x, y, value) => {
    const updatedMatrix = [...matrixCss];
    updatedMatrix[x][y] = value;
    setMatrixCss(updatedMatrix);
  };


  const deleteLetter = () => {
    if (matrix[0][0] === "")
      return
    let row = guessing_times - answerRemaining; 
    let titlePointer = tile_index - 1
    if (tile_index === 0) {
      setTileIndex(0)
      changePointer(row,titlePointer,"is-light is-warning")
      return
    }
    if (tile_index > 3) {
      titlePointer = 3
      setTileIndex(3)
    }
    changePointer(row,tile_index,"is-light")
    changeValue(row,titlePointer,"")  
    setTileIndex(titlePointer)
    changePointer(row,titlePointer,"is-light is-warning")


  }

  const addCharacter = (character) => {
    
    let row = guessing_times - answerRemaining;

    if (tile_index > 3) {
      return
    }
    changePointer(row,tile_index-1,"is-light")
    changeValue(row,tile_index,character)
    setTileIndex(tile_index + 1)

    changePointer(row,tile_index,"is-light is-warning")
  }

  const checkGuess= () => {
    let row = guessing_times - answerRemaining;
    let guessString = "";
    let rightGuess = Array.from(theAnswer);

    let currentGuess = matrix[row];
    for (const val of currentGuess) {
      guessString += val;
    }
  
    if (guessString.length !== wordLength) {
      alert("Not enough letters!");
      return;
    }
    else {
      setAnswerRemaining(answerRemaining - 1)
      setTileIndex(0)
    }
  
    const changeColor = [...matrixCss];
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

    setMatrixCss(changeColor);
    if (tile_index > 3)
      changePointer(row,3,"is-light")

    changePointer(row,tile_index,"is-light")
    if ((row + 1) < guessing_times)
      changePointer(row+1,0,"is-light is-warning")

    if (guessString.toLowerCase() === theAnswer.toLowerCase()) {
      for (let i = 0; i < wordLength; i++) {
          changeColor[row][i] = "is-success shake";
      }
       // Show popup congratulation
      setModal(true)
      setMatrixCss(changeColor);
      setAnswerRemaining(0)
     
      return;
    } else {
      setAnswerRemaining(answerRemaining-1)
      
      setTileIndex(0)
      currentGuess = [];
      if (answerRemaining === 0) {
        alert(`You've run out of guesses! Game over! . The right word was: "${theAnswer}"`);
      }
    }
  }

  const showModal = () => 
  (
      <div className={`modal is-active`}>
        <div className="modal-background" onClick={() => setModal(false)} />
        <div className="modal-card">
          <section className="modal-card-body">
            <img src={congrats}/>
          </section>
        </div>
      </div>
  )

  return (
    <div style={{ backgroundColor: isDark ? 'black' : 'white' }}
    className={"container Game-board "}>   
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
        matrix.map((row, i) => (
        <div key={i} className='buttons'  >
          {
            row.map((col, j) => (
            <button key={j} className={ 'button ' +  matrixCss[i][j] + ' letter'  }>
              {matrix[i][j] === 0? "": matrix[i][j] }
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
      {modal && showModal()}
    </div>
  );
}

export default App;
