import { getDefaultConfig, TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@tomo-inc/tomo-evm-kit/wallets';
import  ConnectButton  from './components/ConnectButton.tsx';

const config = getDefaultConfig({
  clientId: '0WSYVJAHevR5govAFDeMkGrVGxmDVJysE0OEzVuiFq4IWBCQV9iPcgtVOJDeGiXzUGmiUjYheevhWlyKbbTZLW8L', // Replace with your clientId
  appName: 'TomoEVMKit App',
  projectId: 'e9d908d51831e872d0faa0736d2ed43d', 
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server-side rendering (SSR)
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet, 
        rainbowWallet, 
        walletConnectWallet, // Add other wallets if needed
      ],
    },
  ],
});

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          <ConnectButton />
          {/* Your App */}
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;