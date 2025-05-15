import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.js';
import './index.css';
import Home from './pages/Home.js';
import Crypto from './pages/Crypto.js';
import Trending from './pages/Trending.js';
import Saved from './pages/Saved.js';
import CryptoDetails from './components/CryptoDetails.js';
import Boost from './carrotPages/Boost.js';
import NewsFeed from './carrotPages/NewsFeed.js';
import Referrals from './carrotPages/Referrals.js';
import Task from './carrotPages/Task.js';
import Tap from './carrotPages/Tap.js';
import BlogPost from './components/BlogPost.js';  // Ensure correct import path
import AiAnalysis from './carrotPages/AiAnalysis.js'; // Import the AiAnalysis component
import Messenger from './carrotPages/Messenger.js';
import Leaderboard from './carrotPages/Leaderboard.js';
import LaunchPad from './carrotPages/LaunchPad.js';
import Guide from './carrotPages/Guide.js'; // Import your guide component
import PrivacyPolicy from './carrotPages/PrivacyPolicy.js';
import Welcome from './carrotPages/Welcome.js'; // Ensure the correct path
import Welcome2 from './carrotPages/Welcome2.js'; // Ensure the correct path 
import XrpTokenCreator from './carrotPages/XrpTokenCreator.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/guide', // New guide route
        element: <Guide />,
      },
      {
        path: '/',
        element: <Tap />,
        children: [
          {
            path: ':coinId',
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: '/task',
        element: <Task />,
        children: [
          {
            path: ':coinId',
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: '/launch',
        element: <LaunchPad />,
        children: [
          {
            path: ':coinId',
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: '/boost',
        element: <Boost />,
        children: [
          {
            path: ':coinId',
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: '/news',
        element: <NewsFeed />,
      },
      {
        path: '/messenger',
        element: <Messenger />,
      },
      {
        path: '/leaderboard',
        element: <Leaderboard />,
      },

      {
        path: '/privacy',
        element: <PrivacyPolicy />,
      },

      {
        path: '/creator',
        element: <XrpTokenCreator />,
      },      

      {
        path: '/welcome', // Route for the Welcome component
        element: <Welcome />,
      },
      {
        path: '/welcome2', // Route for the Welcome2 component
        element: <Welcome2 />,
      },      
      
      {
        path: '/blog/:id',
        element: <BlogPost />,  // Use BlogPost component directly
      },
      {
        path: '/trending',
        element: <Trending />,
        children: [
          {
            path: ':coinId',
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: '/ai', // Define the new route
        element: <AiAnalysis />, // Use the AiAnalysis component
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
