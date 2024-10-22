import { useState } from 'react';
import './AIWordle.css';
import useWordleLogic from './WordleAI';
function App() {
  const {
    guess,
    attempts,
    guessList,
    isGameWon,
    isGameLost,
    handleInputChange,
    handleSubmit
  } = useWordleLogic();
  
  return (
    <div className="wordle-game">
      <h1>Wordle</h1>
      <p>Guess the Word</p>
      <input
        type="text"
        value={guess}
        onChange={handleInputChange}
        disabled={isGameWon || isGameLost}
      />
      <button onClick={handleSubmit} disabled={isGameWon || isGameLost || !guess}>
        Enviar
      </button>

      <ul id="guess-list">
        {guessList.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>

      {isGameWon && (
        <div id="win-message">
          <h2>¡Has ganado!</h2>
        </div>
      )}

      {isGameLost && (
        <div id="lose-message">
          <h2>¡Has perdido!</h2>
        </div>
      )}
    </div>
  );
}

export default App;
