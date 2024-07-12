// src/App.js
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeContext } from "./context/ThemeContext.js";
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import Loading from "./components/Loading.js";
import Logo from "./components/Logo.js";
import Navigation from "./components/Navigation.js";

// List of images to preload from the assets folder
const imageUrls = [
  "/assets/image1.jpg",
  "/assets/image2.jpg",
  "/assets/image3.jpg",
  "/assets/image4.jpg",
  "/assets/news1.jpg",
  "/assets/news1_1.jpg",
  "/assets/news2.jpg",
  "/assets/news2_1.jpg",
  "/assets/news3.jpg",
  "/assets/news3_1.jpg",
  "/assets/news4.jpg",
  "/assets/news4_1.png",
  "/assets/news5.jpg",
  "/assets/news5_1.jpg"
];

// Utility function to preload images
function preloadImages(imageUrls) {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const { theme, setTheme } = useThemeContext();
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    preloadImages(imageUrls); // Call the preload function

    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();
      webApp.ready();

      webApp.onEvent("viewportChanged", setFullScreenDimensions);
      setFullScreenDimensions();

      webApp.onEvent("viewportChanged", () => webApp.MainButton.hide());

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
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showConfirm("Are you sure you want to close the app?", (confirmed) => {
          if (confirmed) {
            window.Telegram.WebApp.close();
          }
        });
      } else {
        event.returnValue = "Are you sure you want to close the app?";
      }
    };

    const handlePopState = (event) => {
      if (!window.confirm("Are you sure you want to go back?")) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const shouldShowLogo = !location.pathname.startsWith("/news") && !location.pathname.startsWith("/blog");
    setShowLogo(shouldShowLogo);
  }, [location]);

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
    <QueryClientProvider client={queryClient}>
      <TelegramContext>
        <TaskProvider>
          <div className="app-container">
            <main
              className={`App-main w-full h-full flex flex-col content-center items-center relative font-poppins ${
                theme === "dark" ? "text-[#ffffff] bg-[#19191E]" : "bg-[#fff] text-[#15231D]"
              }`}
              onTouchMove={(e) => e.stopPropagation()} // Allow scrolling
            >
              <div className={`${theme === "dark" ? "z-0" : "z-0"}`} />
              <div
                className={`w-screen h-screen fixed -z-10 ${
                  theme === "dark" ? "bg-[#19191E]" : "bg-[#fff]"
                }`}
              />
              {showLogo && <Logo />}
              <Outlet /> {/* Ensure Outlet is included to render nested routes */}
              <Navigation />
            </main>
          </div>
        </TaskProvider>
      </TelegramContext>
    </QueryClientProvider>
  );
}

export default App;
