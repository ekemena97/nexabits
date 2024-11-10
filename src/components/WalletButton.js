import React, { useState } from 'react';
import { useWalletContext } from '../context/WalletContext.js';
import { FiCopy, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JettonStats from './JettonStats.js'; // Import JettonStats component
import tonSymbol from '../assets/ton_symbol.png'; // Import the TON symbol icon

const WalletButton = () => {
  const { wallet, walletAddress, fullUserFriendlyAddress, walletDetails, handleConnect, handleDisconnect } = useWalletContext();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullUserFriendlyAddress); // Copy human-readable address
    toast.success('Address copied to clipboard', { position: "bottom-center", autoClose: 2000 });
  };

  const toggleModal = () => {
    if (wallet) setModalOpen(!isModalOpen);
    else handleConnect();
  };

  return (
    <header style={{ position: "relative" }}>
      <button
        onClick={toggleModal}
        style={{
          float: "right",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, #2D83EC, #1AC9FF)",
          color: "white",
          border: "none",
          borderRadius: "20px",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        <img
          src={tonSymbol}
          alt="TON Symbol"
          style={{ width: "20px", height: "20px", marginRight: "3px" }}
        />
        <span style={{ fontSize: wallet ? "0.7rem" : "0.8rem" }}>
          {wallet ? walletAddress : "Connect Wallet"}
        </span>
        {wallet && <FiChevronDown style={{ marginLeft: "6px", fontSize: "1.2rem" }} />}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: "absolute", top: "50px", right: "0",
          background: "#F7F9FB",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "10px",
          width: "180px",
          zIndex: 1
        }}>
          <div
            onClick={handleCopyAddress}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "5px",
              color: "black",
              fontSize: "0.8rem"
            }}
          >
            <FiCopy style={{ marginRight: "8px" }} /> Copy Address
          </div>
          <div
            onClick={handleDisconnect}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "5px",
              color: "black",
              fontSize: "0.8rem"
            }}
          >
            <FiLogOut style={{ marginRight: "8px" }} /> Disconnect
          </div>

          {/* Jetton Stats */}
          {walletDetails.address && (
            <div style={{ marginTop: "10px" }}>
              <JettonStats accountId={walletDetails.address} walletName={walletDetails.name} />
            </div>
          )}
        </div>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-center"
        style={{ bottom: '100px' }}
      />
    </header>
  );
};

export default WalletButton;
