import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'aos/dist/aos.css'
import './i18n'
import './index.css'
import App from './App.tsx'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './components/Toast/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </StrictMode>,
)
