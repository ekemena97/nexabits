import React, { useEffect, useState } from 'react';
import { FaWallet, FaClock } from 'react-icons/fa';
import { IoCopyOutline } from 'react-icons/io5';
import { useWalletContext } from '../context/WalletContext.js';
import { useTonConnectUI } from '@tonconnect/ui-react';

const Payment = ({ sellAmount, selectedToken, calculateWTHAmount, setShowPayment }) => {
  const { wallet } = useWalletContext();
  const [tonConnectUI] = useTonConnectUI();
  const [timeLeft, setTimeLeft] = useState(1800);
  const [copied, setCopied] = useState(false);

  const getTeamWallet = (token) => {
    switch (token) {
      case 'BTC': return 'bc1qducddm5damemawd9y7r5al2j0w2rtp2p48uffn';
      case 'ETH':
      case 'BNB':
      case 'USDT': return '0x6A5dBffb7C6b271b424967e291420F8E49398482';
      case 'TRX': return 'TLqzN6BqoN2MjWp95sNZaw5L3knqJGinUC';
      case 'SUI': return '0xdd05b4e402f0a0dcc9915b69a36fcbaca22730be930931b8d6b9e745eb1bc1f7';
      case 'SOL': return '839T3UUFM7vjMph7Wycv2YkvVy1YxRBARg8V1MwaDrXA';
      case 'TON': return 'UQAgofIq7vV_wmfJ1mM54w2u4HhOf2VpfMa3wZmvCrrAj2aO';
      default: return '';
    }
  };

  const teamWallet = getTeamWallet(selectedToken);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setShowPayment(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatWalletAddress = (address) => {
    return `${address.slice(0, 12)}.....${address.slice(-12)}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(teamWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransaction = () => {
    if (wallet && selectedToken === 'TON') {
      const transaction = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: teamWallet,
            amount: sellAmount * 1000000000, // Toncoin amount in nanotons
          },
        ],
      };
      tonConnectUI.sendTransaction(transaction);
    }
  };

  return (
    <div className="text-[#f7f9fb] p-4 bg-[rgba(30,35,55,0.3)] shadow-lg rounded-lg text-sm mt-4 font-inter">
      <p>
        Send exactly <strong>{sellAmount || 0} {selectedToken}</strong> to the team wallet address below:
      </p>
      <div className="flex items-center mt-2 space-x-2">
        <FaWallet className="text-purple-500 text-sm" />
        <span>Wallet:</span>
        <span className="text-xs">{formatWalletAddress(teamWallet)}</span>
        {copied ? (
          <span className="text-purple-500 text-xs">Copied</span>
        ) : (
          <IoCopyOutline
            className="text-purple-500 cursor-pointer text-lg"
            onClick={handleCopy}
          />
        )}
      </div>
      <p className="mt-2">
        Your total allocation is <strong>{Number(calculateWTHAmount()).toLocaleString()} $WTH 🎉</strong>
      </p>
      <p className="mt-2">Transaction confirmation is automated. Click copy and send the exact amount within this timeframe.</p>
      <p className="mt-2 flex items-center">
        <FaClock className="mr-1 text-[#ffd700]" />
        Transaction expires in <strong className="text-[#ffd700] ml-1">{formatTime(timeLeft)}</strong>
      </p>

      {/* Complete Transaction button and additional text if wallet is connected and selected token is TON */}
      {wallet && selectedToken === 'TON' && (
        <div className="mt-4 text-center">
          <button
            style={{
              background: 'linear-gradient(to right, #2d83ec, #1ac9ff)',
              padding: '8px 16px',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            onClick={handleTransaction} // Trigger transaction on button click
          >
            Complete Transaction
          </button>
          <p className="mt-2">You can also send the exact amount to the wallet displayed above.</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
