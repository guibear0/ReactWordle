import React from 'react';
import { useWordleLogic } from './WordleScript';
import { motion } from 'framer-motion';
import './AIWordle.css';

const WordleAI = () => {
  const {
    currentGuess,
    attempts,
    isGameWon,
    isGameLost,
    handleInputChange,
    handleSubmit,
    errorMessage,  // Obtenemos el mensaje de error
    maxAttempts,
    word  // Ahora obtenemos la palabra correcta del hook
  } = useWordleLogic();

  const cellVariants = {
    initial: { backgroundColor: '#303030' },
    correct: { backgroundColor: 'rgba(0, 128, 0, 1)', transition: { duration: 0.3, ease: 'easeInOut' } },
    present: { backgroundColor: 'rgba(255, 165, 0, 1)', transition: { duration: 0.3, ease: 'easeInOut' } },
    absent: { backgroundColor: 'rgba(128, 128, 128, 1)', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    
  };

  return (
    <div className="wordle-game">
      <h1>Wordle</h1>

      <div className="attempts-grid">
        {attempts.map((attempt, attemptIndex) => (
          <div key={attemptIndex} className="word-row">
            {attempt.map((charObj, charIndex) => (
              <motion.div
                key={charIndex}
                className="word-cell"
                initial="initial"
                animate={charObj.status}
                variants={cellVariants}
                style={{ width: 50, height: 50 }}
              >
                {charObj.letter}
              </motion.div>
            ))}
          </div>
        ))}

        {!isGameWon && !isGameLost && attempts.length < maxAttempts && (
          <div className="word-row">
            {currentGuess.map((char, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={char}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="word-input-cell"
              />
            ))}
          </div>
        )}

        {maxAttempts - attempts.length - 1 > 0 && (
          Array(maxAttempts - attempts.length - 1).fill(null).map((_, emptyIndex) => (
            <div key={emptyIndex} className="word-row">
              {Array(5).fill('').map((_, charIndex) => (
                <div key={charIndex} className="word-cell"></div>
              ))}
            </div>
          ))
        )}
      </div>

      <button onClick={handleSubmit} disabled={isGameWon || isGameLost}>
        Enviar
      </button>

     
      {errorMessage && (
        <motion.p
          className="error-message"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={messageVariants}
          style={{ color: 'red' }}
          duration={1}
        >
          {errorMessage}
        </motion.p>
      )}

 
      {isGameWon && (
        <motion.p
          className="game-message"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={messageVariants}
          style={{ color: 'green' }}
        >
          ¡Has ganado!
        </motion.p>
      )}

      {isGameLost && (
        <motion.p
          className="game-message"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={messageVariants}
          style={{ color: 'red' }}
        >
          ¡Has perdido! La palabra era: {word}
        </motion.p>
      )}
    </div>
  );
};

export default WordleAI;
