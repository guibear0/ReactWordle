// WordleScript.js
import { useState, useEffect } from "react";

export const useWordleLogic = () => {
  const localWords = ["APPLE", "BAKER", "CANDY", "DELTA", "EAGLE"];
  const [currentGuess, setCurrentGuess] = useState(["", "", "", "", ""]);
  const [attempts, setAttempts] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [word, setWord] = useState("");
  const maxAttempts = 6;

  // Eliminar acentos
  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Palabra aleatoria
const fetchRandomWord = async () => {
  try {
    let validWord = "";

    // Bucle hasta encontrar palabra válida
    while (!validWord) {
      const res = await fetch(
        "https://rae-api.com/api/random?min_length=5&max_length=5"
      );
      if (!res.ok) throw new Error("Error al obtener palabra");

      const data = await res.json();
      const rawWord = data.data.word;

      // Eliminar acentos y pasar a mayúsculas
      const cleanWord = removeAccents(rawWord)
        .toUpperCase()
        .trim();

      // ✅ Validar: solo letras (sin guiones, números ni espacios)
      if (/^[A-ZÁÉÍÓÚÜÑ]+$/.test(cleanWord)) {
        validWord = cleanWord;
      } else {
        console.warn("Palabra descartada por caracteres raros:", rawWord);
      }
    }

    setWord(validWord);
    console.log("Palabra RAE:", validWord);
  } catch (error) {
    console.error("Error con API, usando fallback:", error);
    const fallback =
      localWords[Math.floor(Math.random() * localWords.length)];
    setWord(fallback);
    console.log("Palabra fallback:", fallback);
  }
};


  // ✅ Validar si la palabra existe en la RAE o en fallback
  const validateWord = async (guess) => {
    try {
      const res = await fetch(
        `https://rae-api.com/api/words/${guess.toLowerCase()}`
        
      )
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.data?.word;
    } catch (error) {
      console.warn("Validación falló, usando fallback:", error);
      return localWords.includes(guess.toUpperCase());
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

  const handleSubmit = async () => {
    setErrorMessage("");

    const guess = currentGuess.join("").toUpperCase();
    if (guess.length < 5) {
      setErrorMessage("Completa todas las casillas antes de enviar.");
      return;
    }

    // 🚨 Validar antes de aceptar el intento
    const isValid = await validateWord(guess);
    if (!isValid) {
      setErrorMessage("Esa palabra no está en el diccionario.");
      return;
    }

    const newAttempt = currentGuess.map((char, idx) => {
      if (char === word[idx]) return { letter: char, status: "correct" };
      if (word.includes(char)) return { letter: char, status: "present" };
      return { letter: char, status: "absent" };
    });

    setAttempts((prev) => [...prev, newAttempt]);

    if (guess === word) setIsGameWon(true);
    else if (attempts.length + 1 === maxAttempts) setIsGameLost(true);

    setCurrentGuess(["", "", "", "", ""]);
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
    maxAttempts,
  };
};
