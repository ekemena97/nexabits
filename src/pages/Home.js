import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo.js";
import Navigation from "../components/Navigation.js";
import { CryptoProvider } from "../context/CryptoContext.js";
import { StorageProvider } from "../context/StorageContext.js";
import { TrendingProvider } from "../context/TrendingContext.js";
import { ThemeProvider, useThemeContext } from "../context/ThemeContext.js";

import { TapProvider } from "../context/TapContext.js";
import App from "../App.js";
import { NewsProvider } from "../context/NewsContext.js";

const Home = () => {
  // const { theme, setTheme } = useThemeContext();
  // console.log(theme)

  // Applying Light and Dark Mode Theme to the entire application
  return (
    <ThemeProvider>
      <NewsProvider>
        <TapProvider>
          <CryptoProvider>
            <TrendingProvider>
              <StorageProvider>
                <App />
              </StorageProvider>
            </TrendingProvider>
          </CryptoProvider>
        </TapProvider>
      </NewsProvider>
    </ThemeProvider>
  );
};

export default Home;
