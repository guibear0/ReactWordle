import  { useEffect, useRef } from 'react';
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
    errorMessage,
    maxAttempts,
    word
  } = useWordleLogic();

  const inputRefs = useRef([]);

  // Handle key events for input and submission
  const handleKeyDown = (e, index) => {
  if (e.key === 'Enter' && currentGuess.every((char) => char !== '')) {
    handleSubmit();
  } else if (e.key === 'Backspace') {
    // Si el input actual está vacío, ir al anterior
    if (!currentGuess[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
};

  // Handle input changes directly
  const handleChange = (value, index) => {
  const upperValue = value.toUpperCase();
  if (/^[A-Z]$/i.test(upperValue) || value === '') {
    handleInputChange(upperValue, index);

    if (/^[A-Z]$/i.test(upperValue) && index < currentGuess.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }
};

  // Focus first input on mount or after submission
  useEffect(() => {
    if (!isGameWon && !isGameLost && attempts.length < maxAttempts) {
      inputRefs.current[0]?.focus();
    }
  }, [attempts, isGameWon, isGameLost, maxAttempts]);

  const cellVariants = {
    initial: { backgroundColor: '#3a3a3c', },
    correct: { backgroundColor: '#538d4e', transition: { duration: 0.3, ease: 'easeInOut' } },
    present: { backgroundColor: '#b59f3b',  transition: { duration: 0.3, ease: 'easeInOut' } },
    absent: { backgroundColor: '#3a3a3c',  transition: { duration: 0.3, ease: 'easeInOut' } },
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
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="word-input-cell"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
        )}

        {maxAttempts - attempts.length - 1 > 0 &&
          Array(maxAttempts - attempts.length - 1)
            .fill(null)
            .map((_, emptyIndex) => (
              <div key={emptyIndex} className="word-row">
                {Array(5).fill('').map((_, charIndex) => (
                  <div key={charIndex} className="word-cell empty"></div>
                ))}
              </div>
            ))}
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
          style={{ color: '#ff4d4d' }}
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
          style={{ color: '#538d4e' }}
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
          style={{ color: '#ff4d4d' }}
        >
          ¡Has perdido! La palabra era: {word}
        </motion.p>
      )}
    </div>
  );
};

export default WordleAI;