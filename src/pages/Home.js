import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import { CryptoProvider } from "../context/CryptoContext";
import { StorageProvider } from "../context/StorageContext";
import { TrendingProvider } from "../context/TrendingContext";
import { ThemeProvider, useThemeContext } from "../context/ThemeContext";

import { TapProvider } from "../context/TapContext";
import App from "../App";
import { NewsProvider } from "../context/NewsContext";

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
