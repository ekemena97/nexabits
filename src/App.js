// src/App.js
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Logo from "./components/Logo.js";
import Navigation from "./components/Navigation.js";
import { Outlet } from "react-router-dom";
import { useThemeContext } from "./context/ThemeContext.js";
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import Loading from "./components/Loading.js";

function App() {
  // Set Theme
  const { theme, setTheme } = useThemeContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the time as needed

    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();
      webApp.ready();

      webApp.onEvent("viewportChanged", function () {
        setFullScreenDimensions();
      });

      setFullScreenDimensions();

      webApp.onEvent("viewportChanged", () => {
        webApp.MainButton.hide();
      });

      if (webApp.version && parseFloat(webApp.version) >= 6.1) {
        webApp.BackButton.show();

        webApp.BackButton.onClick(() => {
          webApp.showConfirm("Are you sure you want to go back?", (confirmed) => {
            if (confirmed) {
              webApp.close();
            }
          });
        });
      }

      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "";

        webApp.showConfirm("Are you sure you want to close the app?", (confirmed) => {
          if (confirmed) {
            webApp.close();
          }
        });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      window.addEventListener(
        "touchmove",
        function (event) {
          event.preventDefault();
        },
        { passive: false }
      );

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("touchmove", function (event) {
          event.preventDefault();
        });
      };
    } else {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "Are you sure you want to close the app?";
      };

      const handlePopState = (event) => {
        if (!window.confirm("Are you sure you want to go back?")) {
          window.history.pushState(null, "", window.location.href);
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);

      window.addEventListener(
        "touchmove",
        function (event) {
          event.preventDefault();
        },
        { passive: false }
      );

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("touchmove", function (event) {
          event.preventDefault();
        });
      };
    }
  }, []);

  function setFullScreenDimensions() {
    const appContainer = document.querySelector(".App");
    if (appContainer) {
      appContainer.style.width = "100%";
      appContainer.style.height = "100%";
    }
  }

  useEffect(() => {
    setFullScreenDimensions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <TelegramContext>
      <TaskProvider>
        <div className="">
          <main
            className={`w-full h-full flex flex-col content-center items-center relative font-poppins ${
              theme === "dark" ? "text-[#ffffff] bg-[#19191E]" : "bg-[#fff] text-[#15231D]"
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
      </TaskProvider>
    </TelegramContext>
  );
}

export default App;
