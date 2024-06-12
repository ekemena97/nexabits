import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.js";
import Crypto from "./pages/Crypto.js";
import Trending from "./pages/Trending.js";
import Saved from "./pages/Saved.js";
import CryptoDetails from "./components/CryptoDetails.js";

import Boost from "./carrotPages/Boost.js";
import NewsFeed from "./carrotPages/NewsFeed.js";
import Referrals from "./carrotPages/Referrals.js";
import Task from "./carrotPages/Task.js";
import Tap from "./carrotPages/Tap.js";
import NewsFeedDetails from "./carrotPages/NewsFeedDetails.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Tap />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: "/task",
        element: <Task />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: "/ref",
        element: <Referrals />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: "/boost",
        element: <Boost />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: "/news",
        element: <NewsFeed />,
        children: [
          {
            path: `/news/id`,
            element: <NewsFeedDetails />,
          },
        ],
      },
      {
        path: `/news/:id`,
        element: <NewsFeedDetails />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
      {
        path: "/trending",
        element: <Trending />,
        children: [
          {
            path: ":coinId",
            element: <CryptoDetails />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
