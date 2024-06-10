import React, { useEffect } from "react";

const PointsAnimation = ({ points, position, onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1000); // Duration of the animation

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div
      className="float-up absolute no-select"
      style={{ left: position.x, top: position.y }}
    >
      +{points}
    </div>
  );
};

export default PointsAnimation;
