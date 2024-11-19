import React, { useState } from 'react';
import { useWalletContext } from '../context/WalletContext.js';
import { FiCopy, FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JettonStats from './JettonStats.js';
import tonSymbol from '../assets/ton_symbol.png';
import './animations.css';

const WalletButton = () => {
  const {
    wallet,
    walletAddress,
    fullUserFriendlyAddress,
    walletDetails,
    handleConnect,
    handleDisconnect: originalHandleDisconnect,
  } = useWalletContext();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullUserFriendlyAddress);
    toast.success('Address copied to clipboard', { position: 'bottom-center', autoClose: 2000 });
  };

  const toggleModal = () => {
    if (wallet) setModalOpen(!isModalOpen);
    else handleConnect();
  };

  const handleDisconnect = () => {
    setModalOpen(false); // Close the modal
    originalHandleDisconnect(); // Call the original disconnect logic
  };

  return (
    <header
      style={{
        position: 'relative',
        padding: '0 1rem', // Ensures it doesn't touch edges on any screen
      }}
    >
      <button
        onClick={toggleModal}
        style={{
          float: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #2D83EC, #1AC9FF)',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          padding: '4px 18px',
          cursor: 'pointer',
          gap: '2px',
          minWidth: '10px', // Prevent button from becoming too narrow
          maxWidth: 'fit-content', // Adapt to content size
          width: 'auto', // Allow it to expand naturally
          fontSize: 'clamp(0.7rem, 2vw, 1rem)', // Responsive font size
        }}
      >
        <img
          src={tonSymbol}
          alt="TON Symbol"
          style={{
            width: 'clamp(20px, 5vw, 25px)',
            height: 'clamp(20px, 5vw, 25px)',
          }}
        />
        <span
          style={{
            fontSize: wallet ? '0.7rem' : '0.8rem',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center', // Aligns the text and the chevron icon
            gap: '4px', // Space between text and chevron
          }}
        >
          {wallet ? (
            walletAddress
          ) : (
            <>
              Wallet <FiChevronRight className="chevron" style={{ fontSize: '0.8rem', }} />
            </>
          )}
        </span>
        {wallet && (
          <FiChevronDown
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: '1',
              marginLeft: '4px',
            }}
          />
        )}
      </button>


      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            background: '#F7F9FB',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            width: '180px',
            zIndex: 1,
            maxWidth: '90%', // Prevent overflow
          }}
        >
          <div
            onClick={handleCopyAddress}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '5px',
              color: 'black',
              fontSize: '0.8rem',
            }}
          >
            <FiCopy style={{ marginRight: '8px' }} /> Copy Address
          </div>
          <div
            onClick={handleDisconnect}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '5px',
              color: 'black',
              fontSize: '0.8rem',
            }}
          >
            <FiLogOut style={{ marginRight: '8px' }} /> Disconnect
          </div>

          {/* Jetton Stats */}
          {walletDetails.address && (
            <div style={{ marginTop: '10px' }}>
              <JettonStats
                accountId={walletDetails.address}
                walletName={walletDetails.name}
              />
            </div>
          )}
        </div>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer position="bottom-center" style={{ bottom: '100px' }} />
    </header>   
  );
};

export default WalletButton;
