import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './api/connectWallet.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <WalletProvider><App /></WalletProvider>
    
  </StrictMode>,
)
