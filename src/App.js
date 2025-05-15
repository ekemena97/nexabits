import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react'; // Import TonConnect provider
import TelegramContext from "./context/TelegramContext.js";
import { TaskProvider } from "./context/TaskContext.js";
import { TapProvider } from "./context/TapContext.js";
import { TreasureProvider } from "./context/treasureContext.js";
import { TimeLapseProvider } from "./context/TimeContext.js"; 
import { ReferralProvider } from "./context/ReferralContext.js"; 
import { LeaderboardProvider } from "./context/LeaderboardContext.js"; 
import { WalletProvider } from "./context/WalletContext.js";  // Import WalletContext
import { ClaimProvider } from "./context/ClaimContext.js"; // Import ClaimContext
import { DataProvider } from "./context/DataContext.js";
import Loading from "./components/Loading.js";
import Navigation from "./components/Navigation.js";
import Guide from "./carrotPages/Guide.js";  // Import the Guide.js component
import TokenSecurityDetection from './components/TokenSecurityDetection.js';
import NewsFeed from './carrotPages/NewsFeed.js';

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

// List of images to preload
const imageUrls = [
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
  const navigate = useNavigate();
  
  const hasSeenGuide = localStorage.getItem('hasSeenGuide') === 'true';

  useEffect(() => {


    // Initialize Telegram Analytics SDK
    if (window.telegramAnalytics) {
      window.telegramAnalytics.init({
        token: 'eyJhcHBfbmFtZSI6ImRhdGFjb2RlIiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9OZXhhQml0X1RhcF9ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly9uZXhhYml0cy53ZWIuYXBwIn0=!jxpdxXSn9NgupqezW9uWCKQYF7+qT11X9PPDJ3LLzuk=',
        appName: 'datacode',
      });
    }

    // Preload and cache images
    preloadImages(imageUrls);
    cacheAssets(imageUrls);

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
        <DataProvider>
          <WalletProvider> {/* Add WalletProvider here */}
            <TreasureProvider>
              <TimeLapseProvider>
                <TapProvider>
                  <TelegramContext>
                    <ReferralProvider>
                      <TaskProvider>
                        <LeaderboardProvider>
                          <ClaimProvider>
                            <div className="app-container bg-black font-inter min-h-screen">
                              <main
                                className="App-main w-full h-full flex flex-col content-center items-center relative text-white font-inter"
                              >
                                <div className="z-0" />
                                <div className="top-0 left-0 w-screen h-screen fixed -z-10 ">
     
                                </div>
                                {/* Show Guide if the user hasn't seen it yet */}
                                {/*{!hasSeenGuide ? (
                                  <Guide /> // Render the Guide component
                                ) : (
                                  <>
                                    <Outlet />
                                    <Navigation />
                                  </>
                                )} */}
                                <>
                                  <Outlet />
                                  <Navigation />
                                </>                                
                              </main>
                            </div>
                          </ClaimProvider>
                        </LeaderboardProvider>
                      </TaskProvider>
                    </ReferralProvider>
                  </TelegramContext>
                </TapProvider>
              </TimeLapseProvider>
            </TreasureProvider>
          </WalletProvider> {/* Close WalletProvider */}
        </DataProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>  
  );
}

export default App;
