import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { initializeStoryClient, registerAssetOnStoryProtocol } from '../utils/storyProtocolUtils';
import toast from 'react-hot-toast';

export function useStoryProtocol() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isRegistering, setIsRegistering] = useState(false);

  const registerAsset = useCallback(async (assetData) => {
    if (!address || !walletClient || !walletClient.account) {
      throw new Error('Wallet not connected or account not available');
    }

    setIsRegistering(true);

    try {
      const client = initializeStoryClient(walletClient);
      
      // Asegurarse de que el owner sea la dirección actual
      const result = await registerAssetOnStoryProtocol(client, {
        ...assetData,
        owner: address
      });
      
      toast.success('Asset registrado exitosamente en Story Protocol!');
      console.log('Asset registrado con éxito:', {
        txHash: result.txHash,
        ipId: result.ipId,
        explorerUrl: result.explorerUrl
      });
      
      return result;
    } catch (error) {
      console.error('Error registering asset:', error);
      
      // Mensajes de error más específicos
      if (error.message?.includes('user rejected transaction')) {
        toast.error('Transacción rechazada por el usuario');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Fondos insuficientes para completar la transacción');
      } else if (error.message?.includes('Royalty policy requires currency token')) {
        toast.error('Error en la política de regalías: se requiere un token de moneda válido');
      } else if (error.message?.includes('WIP')) {
        toast.error('Error relacionado con el token WIP. Es posible que necesites tokens WIP para esta operación.');
      } else {
        toast.error(`Error al registrar asset: ${error.message || 'Error desconocido'}`);
      }
      
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [address, walletClient]);

  return {
    registerAsset,
    isRegistering,
    isReady: !!address && !!walletClient?.account
  };
}