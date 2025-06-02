import { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Story Protocol Aeneid Testnet Chain ID
  const STORY_CHAIN_ID = '0x523'; // Chain ID 1315 in hex

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Setup provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      // Setup listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      checkConnection();

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setAccount(accounts[0]);
          setChainId(chainId);
          
          if (provider) {
            const signer = await provider.getSigner();
            setSigner(signer);
          }
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount(null);
      setSigner(null);
      toast.error('Wallet desconectada');
    } else if (accounts[0] !== account) {
      // Account changed
      setAccount(accounts[0]);
      if (provider) {
        provider.getSigner().then(setSigner);
      }
      toast.success('Cuenta cambiada');
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask no está instalado!');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Get current chain ID
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      setAccount(accounts[0]);
      setChainId(chainId);
      
      // Get signer
      if (provider) {
        const signer = await provider.getSigner();
        setSigner(signer);
      }
      
      // Check if on Story Protocol's testnet
      if (chainId !== STORY_CHAIN_ID) {
        await switchToStoryNetwork();
      }
      
      toast.success('Wallet conectada exitosamente!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Error al conectar wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToStoryNetwork = async () => {
    try {
      // Try to switch to Story Protocol network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: STORY_CHAIN_ID }],
      });
    } catch (switchError) {
      // Network doesn't exist in MetaMask, so we add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: STORY_CHAIN_ID,
                chainName: 'Story Aeneid Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://aeneid.storyrpc.io'],
                blockExplorerUrls: ['https://aeneid.storyscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Story network:', addError);
          toast.error('Error al añadir la red Story a MetaMask');
        }
      } else {
        console.error('Error switching networks:', switchError);
        toast.error('Error al cambiar a la red Story');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    toast.success('Wallet desconectada');
  };

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isStoryNetwork: chainId === STORY_CHAIN_ID,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet debe ser usado dentro de un WalletProvider');
  }
  return context;
};