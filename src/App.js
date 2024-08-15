import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import { TapProvider } from "./context/TapContext.js";
import { TreasureProvider } from "./context/treasureContext.js";
import { TimeLapseProvider } from "./context/TimeContext.js"; 
import { ReferralProvider } from "./context/ReferralContext.js"; 
import Loading from "./components/Loading.js";
import Navigation from "./components/Navigation.js";
import bgMain from "./assets/bg-main.png";  // Import the background image

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
  const [loading, setLoading] = useState(true);
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
    setFullScreenDimensions();
  }, []);

  function setFullScreenDimensions() {
    const appContainer = document.querySelector(".App");
    if (appContainer) {
      appContainer.style.width = "100%";
      appContainer.style.height = "100%";
    }
  }

  if (loading) {
    return <Loading />;
  }

  const isNewsPage = location.pathname === '/news';

  return (
    <QueryClientProvider client={queryClient}>
      <TreasureProvider>
        <TimeLapseProvider>
          <TapProvider>
            <TelegramContext>
              <ReferralProvider>
                <TaskProvider>
                  <div className="app-container">
                    <main
                      className="App-main w-full h-full flex flex-col content-center items-center relative font-poppins"
                      style={{
                        color: isNewsPage ? 'initial' : 'white',
                        textShadow: isNewsPage ? 'initial' : '1px 1px 3px rgba(0, 0, 0, 0.7)',
                      }}
                      onTouchMove={(e) => e.stopPropagation()} // Allow scrolling
                    >
                      <div className="z-0" />
                      <div
                        className="w-screen h-screen fixed -z-10"
                        style={{
                          backgroundImage: `url(${bgMain})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <Outlet /> {/* Ensure Outlet is included to render nested routes */}
                      <Navigation style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }} />
                    </main>
                  </div>
                </TaskProvider>
              </ReferralProvider>
            </TelegramContext>
          </TapProvider>
        </TimeLapseProvider>
      </TreasureProvider>
    </QueryClientProvider>
  );
}

export default App;
