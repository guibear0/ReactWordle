import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WordleAI from './WordleAI.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WordleAI />
  </StrictMode>,
)
