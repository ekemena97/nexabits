import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Logo from "./components/Logo.js";
import Navigation from "./components/Navigation.js";
import { Outlet } from "react-router-dom";
import { useThemeContext } from "./context/ThemeContext.js";

function App() {
  // Set Theme
  const { theme, setTheme } = useThemeContext();

  useEffect(() => {
    // Check if the Telegram Web App is available
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();

      // Disable pull-to-refresh
      webApp.onEvent("viewportChanged", () => {
        webApp.MainButton.hide();
      });
    }

    // Prevent default touchmove behavior to avoid pull-to-refresh
    const preventDefault = (e) => {
      if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  // Capture referrer ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get("startapp");
    if (referrerId) {
      localStorage.setItem("referrerId", referrerId);
    }
  }, []);

  return (
    <div className="">
      <main
        className={`w-full h-full flex flex-col content-center items-center relative font-poppins ${
          theme === "dark"
            ? "text-[#ffffff] bg-[#19191E]"
            : "bg-[#fff] text-[#15231D]"
        }`}
      >
        <div className={`${theme === "dark" ? "z-0" : "z-0"}`} />
        <div
          className={`w-screen h-screen fixed -z-10 ${
            theme === "dark" ? "bg-[#19191E]" : "bg-[#fff]"
          }`}
        />
        <Logo />
        <Outlet />
        <Navigation />
      </main>
    </div>
  );
}

export default App;
