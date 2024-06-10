// Rocket.js
import React, { useEffect, useState } from 'react';
import { FaRocket } from 'react-icons/fa';
import styled from 'styled-components';

const RocketIcon = styled(FaRocket)`
  position: absolute;
  width: 50px;
  height: 50px;
  cursor: pointer;
`;

const getRandomPosition = () => {
  const x = Math.random() * (window.innerWidth - 50);
  const y = Math.random() * (window.innerHeight - 50);
  return { x, y };
};

const Rocket = () => {
  const [position, setPosition] = useState(getRandomPosition());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer;
    if (visible) {
      timer = setTimeout(() => {
        setPosition(getRandomPosition());
      }, 30000); // 30 seconds
    } else {
      timer = setTimeout(() => {
        setVisible(true);
        setPosition(getRandomPosition());
      }, 60000); // 1 minute
    }

    return () => clearTimeout(timer);
  }, [visible]);

  const handleClick = () => {
    setVisible(false);
  };

  return (
    visible && (
      <RocketIcon
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        onClick={handleClick}
      />
    )
  );
};

export default Rocket;
