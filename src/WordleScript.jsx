// WordleScript.js
import { useState, useEffect } from 'react';

export const useWordleLogic = () => {
  const localWords = [
    'APPLE', 'BAKER', 'CANDY', 'DELTA', 'EAGLE',
    'FANCY', 'GRAPE', 'HOTEL', 'INPUT', 'JOLLY'
  ];

  const [currentGuess, setCurrentGuess] = useState(['', '', '', '', '']);
  const [attempts, setAttempts] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [word, setWord] = useState('');
  const maxAttempts = 6;


    // Función para eliminar acentos
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };


  // Obtener palabra de la API o fallback
  const fetchRandomWord = async () => {
  try {
    const res = await fetch('https://rae-api.com/api/random?min_length=5&max_length=5');
    if (!res.ok) throw new Error('Error al obtener palabra de RAE API');
    const data = await res.json();
    const apiWord = removeAccents(data.data.word).toUpperCase();
    setWord(apiWord);
    console.log('Palabra RAE API:', apiWord); 
  } catch (error) {
    console.error('Error RAE API, usando fallback:', error);
    const fallback = localWords[Math.floor(Math.random() * localWords.length)];
    setWord(fallback);
    console.log('Palabra fallback:', fallback); 
  }
};


  useEffect(() => {
    fetchRandomWord();
  }, []);

  const handleInputChange = (value, index) => {
    if (!isGameWon && !isGameLost) {
      const newGuess = [...currentGuess];
      newGuess[index] = value.toUpperCase();
      setCurrentGuess(newGuess);
    }
  };

  const handleSubmit = () => {
    setErrorMessage('');
    if (currentGuess.join('').length < 5) {
      setErrorMessage('Completa todas las casillas antes de enviar.');
      return;
    }

    if (!isGameWon && !isGameLost) {
      const newAttempt = currentGuess.map((char, idx) => {
        if (char === word[idx]) return { letter: char, status: 'correct' };
        else if (word.includes(char)) return { letter: char, status: 'present' };
        else return { letter: char, status: 'absent' };
      });

      setAttempts([...attempts, newAttempt]);

      if (currentGuess.join('') === word) setIsGameWon(true);
      else if (attempts.length + 1 === maxAttempts) setIsGameLost(true);

      setCurrentGuess(['', '', '', '', '']);
    }
  };

  return {
    currentGuess,
    attempts,
    isGameWon,
    isGameLost,
    errorMessage,
    word,
    handleInputChange,
    handleSubmit,
    maxAttempts
  };
};
