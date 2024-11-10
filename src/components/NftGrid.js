import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useTaskContext } from '../context/TaskContext.js';
import { useReferralContext } from '../context/ReferralContext.js';
import { useWalletContext } from '../context/WalletContext.js'; // Import WalletContext
import './NftGrid.css';

// Import images
import NFTMain from '../assets/nft/NFT_main.png';
import Demo1 from '../assets/nft/demo1.png';
import Demo2 from '../assets/nft/demo2.png';
import Demo3 from '../assets/nft/demo3.png';
import Demo4 from '../assets/nft/demo4.png';
import Fragment1 from '../assets/nft/fragment1.png';
import Fragment2 from '../assets/nft/fragment2.png';
import Fragment3 from '../assets/nft/fragment3.png';
import Fragment4 from '../assets/nft/fragment4.png';

const NftGrid = () => {
  const { completedTasks, totalTasks } = useTaskContext();
  const { successfulReferrals } = useReferralContext();
  const { wallet } = useWalletContext(); // Access wallet status from WalletContext

  const [isTask2Complete, setIsTask2Complete] = useState(false);

  useEffect(() => {
    setIsTask2Complete(completedTasks['task-2']);
  }, [completedTasks]);

  // Check if all tasks are completed
  const allTasksCompleted = Object.keys(completedTasks).length >= totalTasks;
  const isWalletConnected = !!wallet; // Check if wallet is connected

  const images = [
    NFTMain,
    allTasksCompleted ? Fragment1 : Demo1,                // Fragment1 if all tasks are completed
    isTask2Complete ? Fragment2 : Demo2,                   // Fragment2 if task 2 is complete
    successfulReferrals >= 2 ? Fragment3 : Demo3,          // Fragment3 if successfulReferrals >= 2
    isWalletConnected ? Fragment4 : Demo4                  // Fragment4 if wallet is connected
  ];

  return (
    <div className="nft-grid">
      <div className="small-images">
        <div className="small-row">
          <div className="small-image">
            <img src={images[1]} alt="Demo 1" />
            {allTasksCompleted && (
              <FaCheckCircle className="checkmark-icon" />
            )}
          </div>
          <span className="plus-sign">+</span>
          <div className="small-image">
            <img src={images[2]} alt="Demo 2" />
            {isTask2Complete && (
              <FaCheckCircle className="checkmark-icon" />
            )}
          </div>
        </div>
        <div className="small-row">
          <div className="small-image">
            <img src={images[3]} alt="Demo 3" />
            {successfulReferrals >= 2 && (
              <FaCheckCircle className="checkmark-icon" />
            )}
          </div>
          <span className="plus-sign">+</span>
          <div className="small-image">
            <img src={images[4]} alt="Demo 4" />
            {isWalletConnected && (
              <FaCheckCircle className="checkmark-icon" />
            )}
          </div>
        </div>
      </div>
      <div className="boss-section">
        <span className="equal-sign">=</span>
        <div className="boss-image">
          <img src={images[0]} alt="Boss" />
        </div>
      </div>
    </div>
  );
};

export default NftGrid;
