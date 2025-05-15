import React from 'react';
import { useNavigate } from 'react-router-dom';
import tonSymbol from '../assets/ton_symbol.png'; // Importing the image

const Welcome2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4 relative">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
        Get your first time reward for being a crypto trader on TON
      </h1>
      <p className="text-lg sm:text-xl font-light text-gray-300 max-w-md mb-8">
        Connect Wallet to reveal your reward
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 flex items-center gap-2">
        <img src={tonSymbol} alt="TON Symbol" className="w-6 h-6" />
        Connect Wallet
      </button>
      <span
        className="absolute bottom-6 right-6 text-yellow-400 text-lg cursor-pointer"
        onClick={() => navigate('/')} // Navigate back to Welcome page
      >
        Skip &gt;&gt;
      </span>
    </div>
  );
};

export default Welcome2;
