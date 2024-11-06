import React, { useState, useEffect } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { FiCopy, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const WalletButton = () => {
  const wallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [isModalOpen, setModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (wallet) {
      const address = wallet.account.address;
      setWalletAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
    }
  }, [wallet]);

  const handleConnect = () => {
    if (!wallet) {
      tonConnectUI.openModal();
    } else {
      setModalOpen(!isModalOpen);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.account.address);
    toast.success('Address copied to clipboard', { position: "bottom-center", autoClose: 2000 });
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setModalOpen(false); // Close modal after disconnecting
  };

  return (
    <header>
      <button onClick={handleConnect} style={{ float: "right", position: "relative" }}>
        {wallet ? walletAddress : "Connect Wallet"}
        {wallet && <FiChevronDown style={{ marginLeft: "8px" }} />}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: "absolute", top: "50px", right: "0",
          background: "white", border: "1px solid #ccc",
          borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "10px", width: "180px", zIndex: 1
        }}>
          <div onClick={handleCopyAddress} style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "8px" }}>
            <FiCopy style={{ marginRight: "8px" }} /> Copy Address
          </div>
          <div onClick={handleDisconnect} style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "8px", color: "red" }}>
            <FiLogOut style={{ marginRight: "8px" }} /> Disconnect
          </div>
        </div>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer />
    </header>
  );
};
