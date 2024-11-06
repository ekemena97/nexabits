import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react'; // Import TonConnect provider
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import { TapProvider } from "./context/TapContext.js";
import { TreasureProvider } from "./context/treasureContext.js";
import { TimeLapseProvider } from "./context/TimeContext.js"; 
import { ReferralProvider } from "./context/ReferralContext.js"; 
import { LeaderboardProvider } from "./context/LeaderboardContext.js"; 
import Loading from "./components/Loading.js";
import Navigation from "./components/Navigation.js";
// Assets to preload
import crypto from "./assets/crypto.png";
import logo3 from "./assets/logo3.png";
import treasure from "./assets/treasure.png";
import notification from "./assets/notification.gif";
import coin from "./assets/coin.png";
import referral from "./assets/referral.png";
import boost from "./assets/chatbot.png";
import earn from "./assets/earn.png";
import news from "./assets/news.png";
import trophy from "./assets/trophy.png";

const bgMain = `${process.env.PUBLIC_URL}/assets/bg-main.png`;  // Use absolute path for the background image

// List of images to preload
const imageUrls = [
  bgMain,  // Preload the background image
  crypto,
  logo3,
  treasure,
  notification,
  coin,
  referral,
  boost,
  earn,
  news,
  trophy,
];

// Utility function to preload images
function preloadImages(imageUrls) {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Utility function to cache assets
const cacheAssets = async (urls) => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('app-assets-cache');
      await cache.addAll(urls);
    } catch (error) {
      console.error('Failed to cache assets:', error);
    }
  }
};

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Preload and cache images
    preloadImages(imageUrls);
    cacheAssets(imageUrls);

    // Load the background image
    console.log('Loading image from:', bgMain); // Debugging log
    const img = new Image();
    img.src = bgMain; // Use the updated path
    img.onload = () => setImageLoaded(true);
    img.onerror = (error) => {
      console.error("Image failed to load:", error);
    };

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();

      // Set full-screen dimensions
      setFullScreenDimensions();

      webApp.onEvent("viewportChanged", () => {
        webApp.expand();
        setFullScreenDimensions();
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

    const preventDefault = (e) => {
      if (e.touches.length > 1 || (e.scale && e.scale !== 1)) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  useEffect(() => {
    setFullScreenDimensions();
  }, []);

  function setFullScreenDimensions() {
    const appContainer = document.querySelector(".App");
    if (appContainer) {
      appContainer.style.setProperty('--tg-viewport-height', '100vh');
      appContainer.style.setProperty('--tg-viewport-stable-height', '100vh');
      appContainer.style.height = "100vh";
      appContainer.style.width = "100%";
    }
  }

  if (loading) {
    return <Loading />;
  }

  const isNewsPage = location.pathname === '/news';

  return (
    <TonConnectUIProvider manifestUrl="https://nexabits.web.app/tonconnect-manifest.json"> {/* Wrap app with TON Connect */}  
      <QueryClientProvider client={queryClient}>
        <TreasureProvider>
          <TimeLapseProvider>
            <TapProvider>
              <TelegramContext>
                <ReferralProvider>
                  <TaskProvider>
                    <LeaderboardProvider>
                      <div className="app-container">
                        <main
                          className="App-main w-full h-full flex flex-col content-center items-center relative font-poppins"
                          style={{
                            color: isNewsPage ? 'initial' : 'white',
                            textShadow: isNewsPage ? 'initial' : '1px 1px 3px rgba(0, 0, 0, 0.7)',
                          }}
                        >
                          <div className="z-0" />
                          <div
                            className="w-screen h-screen fixed -z-10"
                            style={{
                              backgroundImage: imageLoaded ? `url(${bgMain})` : 'none', // Use dynamic loading
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <Outlet />
                          <Navigation />
                        </main>
                      </div>
                    </LeaderboardProvider>
                  </TaskProvider>
                </ReferralProvider>
              </TelegramContext>
            </TapProvider>
          </TimeLapseProvider>
        </TreasureProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>  
  );
}

export default App;
