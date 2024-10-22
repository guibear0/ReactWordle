import { useState, useEffect } from 'react';

export const useWordleLogic = () => {
  const words = [
    'apple', 'baker', 'candy', 'delta', 'eagle', 'fancy', 'grape', 'hotel', 'input', 'jolly',
    'kneel', 'latch', 'march', 'north', 'ocean', 'pride', 'quiet', 'rider', 'slice', 'table',
    'unity', 'vivid', 'watch', 'xenon', 'yield', 'zebra', 'bliss', 'crane', 'drill', 'event',
    'flare', 'glide', 'hover', 'icing', 'jumps', 'karma', 'lions', 'mixer', 'notes', 'optic',
    'plane', 'quake', 'races', 'stone', 'train', 'ultra', 'vapor', 'wires', 'xerox', 'zones',
    'acorn', 'bloom', 'climb', 'daisy', 'earth', 'flame', 'grows', 'hatch', 'ideal', 'joint',
    'knees', 'lakes', 'minor', 'nails', 'olive', 'pearl', 'query', 'roses', 'smile', 'taste',
    'unite', 'vocal', 'winds', 'xenon', 'yarns', 'zeros', 'badge', 'clock', 'dodge', 'equal',
    'flock', 'gloom', 'heart', 'index', 'judge', 'knife', 'lemon', 'music', 'nerve', 'onion',
    'piano', 'queen', 'radar', 'shine', 'tiger', 'urban', 'virus', 'wound', 'yacht', 'zippy'
  ];

  const [currentGuess, setCurrentGuess] = useState(['', '', '', '', '']);
  const [attempts, setAttempts] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // Estado para el mensaje de error
  const [word, setWord] = useState('');  // Inicializamos la palabra correcta como vacía
  const maxAttempts = 6;

  // Elegir una palabra aleatoria del array al inicio del juego
  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    console.log(randomWord)
  }, []);  // Este efecto solo se ejecuta una vez al montar el componente

  // Función para manejar cambios en el input
  const handleInputChange = (value, index) => {
    if (!isGameWon && !isGameLost) {
      const newGuess = [...currentGuess];
      newGuess[index] = value.toUpperCase();  // Convertir a mayúsculas
      setCurrentGuess(newGuess);
    }
  };

  // Función para manejar el envío del intento
  const handleSubmit = () => {
    // Limpiar el mensaje de error
    setErrorMessage('');

    // Verificar si el intento está completo (es decir, 5 letras)
    if (currentGuess.join('').length < 5) {
      setErrorMessage('Completa todas las casillas antes de enviar.');  // Mostrar mensaje de error
      return;
    }

    if (!isGameWon && !isGameLost && currentGuess.join('').length === 5) {
      const newAttempt = currentGuess.map((char, index) => {
        if (char === word[index].toUpperCase()) {
          return { letter: char, status: 'correct' };  // Verde
        } else if (word.toUpperCase().includes(char)) {
          return { letter: char, status: 'present' };  // Naranja
        } else {
          return { letter: char, status: 'absent' };  // Gris
        }
      });

      setAttempts([...attempts, newAttempt]);

      // Comprobar si se ganó o perdió el juego
      if (currentGuess.join('').toUpperCase() === word.toUpperCase()) {
        setIsGameWon(true);
      } else if (attempts.length + 1 === maxAttempts) {
        setIsGameLost(true);
      }

      setCurrentGuess(['', '', '', '', '']);  // Reiniciar la fila de input
    }
  };

  return {
    currentGuess,
    attempts,
    isGameWon,
    isGameLost,
    errorMessage,  // Devolver el mensaje de error
    word,
    handleInputChange,
    handleSubmit,
    maxAttempts
  };
};
