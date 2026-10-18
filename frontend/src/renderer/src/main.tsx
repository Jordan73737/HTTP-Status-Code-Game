import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

window.addEventListener('error', (event) => {
  console.error('Unhandled renderer error:', event.error ?? event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled renderer promise rejection:', event.reason)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
