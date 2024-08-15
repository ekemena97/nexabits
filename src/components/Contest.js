import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaChevronRight } from 'react-icons/fa';

const ContestButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const visibilityCycle = () => {
      setIsVisible(true); // Show the page for 30 seconds
      setTimeout(() => {
        setIsVisible(false); // Hide the page after 30 seconds
      }, 30000); // 30 seconds

      setTimeout(() => {
        visibilityCycle(); // Restart the cycle after 3 minutes
      }, 3 * 60 * 1000); // 3 minutes
    };

    visibilityCycle(); // Start the visibility cycle

    return () => clearTimeout(visibilityCycle); // Clean up on component unmount
  }, []);

  if (!isVisible) {
    return null; // Return null to hide the component
  }

  return (
    <div className="fixed h-screen flex items-center justify-center bg-gray-900">
      <Link
        to={`/leaderboard`}
        className="absolute flex items-center gap-2 p-2 text-white rounded-md text-lg font-bold cursor-pointer transition-transform duration-150 ease-in hover:bg-[#4A4FFF] hover:scale-105"
        style={{ top: '-0.5rem', right: '-5.5rem', fontSize: '0.7rem' }}
        onClick={() => {
          if (onClick) onClick(); // Call the passed click handler if it exists
        }}
      >
        <span className="inline-flex items-center gap-1" style={{ borderBottom: '2px solid purple' }}>
          <FaTrophy className="text-lg" style={{ color: 'gold', fontSize: '1rem' }} /> Contest
          <FaChevronRight className="ml-0 text-lg" style={{ fontSize: '0.5rem' }} />
        </span>
        <span className="absolute text-xs text-yellow-300 animate-pulse" style={{ top: '2.5rem', right: '1rem', fontSize: '0.5rem' }}>
          Join Now!🔥
        </span>
      </Link>
    </div>
  );
};

export default ContestButton;
