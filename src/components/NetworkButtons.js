import React from 'react';
import './NetworkButtons.css'; // Custom CSS for styling
import base from "../assets/Base_Symbol.png";

const networks = [
  { name: 'SUI', logo: 'https://cryptologos.cc/logos/sui-sui-logo.png?v=025', color: '#4da2ff' },
  { name: 'TON', logo: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=035', color: '#0088cc' },
  { name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=025', color: '#00FFA3' },
  { name: 'Tron', logo: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=025', color: '#FF0606' },
];

const NetworkButtons = () => {
  return (
    <div className="network-buttons-container">
      {networks.map((network, index) => (
        <div key={index} className="network-button">
          <img src={network.logo} alt={network.name} className="network-logo" />
          <span>{network.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NetworkButtons;
