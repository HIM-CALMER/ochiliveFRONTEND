import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  createElement(
    StrictMode,
    null,
    createElement(BrowserRouter, null, createElement(AppErrorBoundary, null, createElement(App, null))),
  ),
)
