import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { toUserFriendlyAddress } from '@tonconnect/sdk';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState('');
  const [fullUserFriendlyAddress, setFullUserFriendlyAddress] = useState('');
  const [walletDetails, setWalletDetails] = useState({
    address: '',
    device: '',
    provider: '',
    tonProof: '',
    name: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (wallet) {
      const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);
      setWalletAddress(`${userFriendlyAddress.slice(0, 4)}...${userFriendlyAddress.slice(-4)}`);
      setFullUserFriendlyAddress(userFriendlyAddress);
      
      setWalletDetails({
        address: wallet.account.address,
        device: wallet.device.appName,
        provider: wallet.provider,
        tonProof: wallet.connectItems?.tonProof || '',
        name: wallet.name,
        imageUrl: wallet.imageUrl
      });
    } else {
      // Reset details if disconnected
      setWalletAddress('');
      setFullUserFriendlyAddress('');
      setWalletDetails({});
    }
  }, [wallet]);

  const handleConnect = () => {
    if (!wallet) {
      tonConnectUI.openModal();
    }
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
  };

  return (
    <WalletContext.Provider value={{ wallet, walletAddress, fullUserFriendlyAddress, walletDetails, handleConnect, handleDisconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
