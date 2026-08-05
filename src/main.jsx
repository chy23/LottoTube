import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 網站建立自楊家驊老師 The website was created by Teacher ChiahuaYang
console.log("%c網站建立自楊家驊老師 The website was created by Teacher ChiahuaYang", "color: #007AFF; font-size: 14px; font-weight: bold;");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
