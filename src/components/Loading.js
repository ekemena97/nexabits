// src/components/Loading.js
import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <ClipLoader color="#3498db" loading={true} size={150} cssOverride={{ animationDuration: '2s' }} />
    </div>
  );
};

export default Loading;
