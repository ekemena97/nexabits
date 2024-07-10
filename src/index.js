import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

import { TapProvider } from './context/TapContext.js';
import TelegramContext from './context/TelegramContext.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
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
        path: '/ref',
        element: <Referrals />,
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
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TelegramContext>
      <TapProvider>
        <RouterProvider router={router} />
      </TapProvider>
    </TelegramContext>
  </React.StrictMode>
);
