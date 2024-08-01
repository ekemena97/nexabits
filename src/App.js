import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeContext } from "./context/ThemeContext.js";
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import { TapProvider } from "./context/TapContext.js";
import { TreasureProvider } from "./context/treasureContext.js"; // Import TreasureProvider
import Loading from "./components/Loading.js";
import Logo from "./components/Logo.js";
import Navigation from "./components/Navigation.js";

// List of images to preload from the assets folder
const imageUrls = [
  "/assets/image1.jpg",
  "/assets/image2.jpg",
  "/assets/image3.jpg",
  "/assets/image4.png",
  "/assets/news1.png",
  "/assets/news1_1.jpg",
  "/assets/news2.png",
  "/assets/news2_1.jpg",
  "/assets/news3.png",
  "/assets/news3_1.jpg",
  "/assets/news4.png",
  "/assets/news4_1.png",
  "/assets/news5.png",
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

    // Preload images
    preloadImages(imageUrls);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const shouldShowLogo = !location.pathname.startsWith("/news") && !location.pathname.startsWith("/blog") && !location.pathname.startsWith("/ai");
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
      <TreasureProvider> {/* Add TreasureProvider */}
        <TapProvider>
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
        </TapProvider>
      </TreasureProvider>
    </QueryClientProvider>
  );
}

export default App;
