import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, WagmiProvider, http } from 'wagmi'
import { aeneid } from '@story-protocol/core-sdk'
import { injected } from 'wagmi/connectors'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'

const config = createConfig({
  chains: [aeneid],
  connectors: [injected()],
  transports: {
    [aeneid.id]: http('https://aeneid.storyrpc.io')
  }
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <BrowserRouter>
            <App />
            <Toaster position="bottom-right" />
          </BrowserRouter>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);