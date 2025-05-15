import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SafeImage } from '../assets/safe.svg';
import { ReactComponent as EthereumImage } from '../assets/ethereum.svg';
import { ReactComponent as UpImage } from '../assets/up.svg';
import tonSymbol from '../assets/ton_symbol.png'; // Import TON symbol image
import { useWalletContext } from '../context/WalletContext.js'; // Corrected import
import JettonStats from '../components/JettonStats.js';
import { saveData, fetchData } from '../components/firebaseHelper.js';
import {
  useTelegramUser,
  useTelegramStartappParam as useTelegramReferrerId,
  useTelegramFirstName,
  useTelegramUsername,
  useTelegramIsBot,
  useTelegramIsPremium,
} from "../context/TelegramContext.js";

const Guide = () => {
  const userId = useTelegramUser();
  const referrerId = useTelegramReferrerId();
  const firstName = useTelegramFirstName();
  const username = useTelegramUsername();
  const isBot = useTelegramIsBot();
  const isPremium = useTelegramIsPremium();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showJettonStats, setShowJettonStats] = useState(false); // Jetton stats visibility
  const [thirdPageTitle, setThirdPageTitle] = useState('Start Your Journey'); // Dynamic title
  const [thirdPageDescription, setThirdPageDescription] = useState('Get started with Nexabit’s tools and insights.'); // Dynamic description
  const navigate = useNavigate();
  const {
    walletDetails,
    handleConnect,
  } = useWalletContext(); // Access the wallet context

  useEffect(() => {
    const checkGuideStatus = async () => {
      try {
        const data = await fetchData(userId, ['hasSeenGuide']);
        if (data.hasSeenGuide) {
          navigate('/'); // If the guide has already been seen, skip it
        }
      } catch (error) {
        console.error('Error fetching guide status:', error);
      }
    };

    checkGuideStatus();
  }, [userId, navigate]);  

  useEffect(() => {
    if (currentPage === 3) {
      if (walletDetails?.address) {
        // If wallet is connected, update text and simulate loading
        setThirdPageTitle('Hang on Fren, We are crunching the result');
        setThirdPageDescription('');
        setIsLoading(true);
        setShowJettonStats(false); // Ensure stats are hidden initially
        const timer = setTimeout(() => {
          setIsLoading(false);
          setShowJettonStats(true);
          setThirdPageTitle('Here is your activity result');
          setThirdPageDescription('');
        }, 3000); // Simulate 3-second loading

        return () => clearTimeout(timer); // Cleanup timer on unmount or page change
      } else {
        // Reset to default when wallet is not connected
        setThirdPageTitle('Interactive AR Experiences');
        setThirdPageDescription('Display your NFT at home, adorning your wall like a masterpiece. Through augmented reality, it comes alive, narrating your blockchain journey with visual flair, interactive storytelling, and meaningful insights.');
      }
    }
  }, [currentPage, walletDetails]);

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSkip(); // Automatically skip when reaching the end
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = async () => {
    await saveData(userId, { hasSeenGuide: true });
    navigate('/');
  };

  const guidePages = [
    {
      title: 'Everyone has a story, and in the blockchain world, every transaction writes a chapter.',
      description: 'NexaBit transforms blockchain activities into unique, soul-bound NFTs, creating a physical, visual and interactive narrative of each user’s crypto journey. Through on-chain analytics, augmented reality technology, and gamification.',
      image: <SafeImage />,
    },
    {
      title: 'Detect hidden risks in tokens, uncover honeypots, and evaluate project credibility.',
      description: 'Gain access to real-time insights on verified, trending coins and technical analysis of tokens to make informed decisions.',
      image: <EthereumImage />,
    },
    {
      title: thirdPageTitle,
      description: thirdPageDescription,
      image: <UpImage />,
    },
  ];

  const { title, description, image } = guidePages[currentPage - 1];

  return (
    <div className="mt-20 mb-20">
      {/* Progress Bar as Dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '30px',
          marginTop: '20px',
        }}
      >
        {guidePages.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              margin: '0 8px',
              backgroundColor: currentPage === index + 1 ? '#fddc00' : '#1e2337',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          
        }}
      >
        <div style={{ width: '100px', height: '100px', marginBottom: '20px' }}>{image}</div>
        <h1 class="text-lg -mt-14 p-4">{title}</h1>
        <p class="text-sm mt-4 p-4">{description}</p>

        {/* Trigger message near the "Connect Wallet" button */}
        {currentPage === 3 && !walletDetails?.address && (
          <p className="mt-4 text-center">
            Get your first time reward for being a crypto trader on TON,{' '}
            <span style={{ color: 'orange', fontWeight: 'bold' }}>Connect Wallet to reveal your reward</span>
          </p>
        )}

        {/* Render Jetton Stats only on the third page when wallet is connected */}
        {currentPage === 3 && walletDetails?.address && (
          <div style={{ marginTop: '10px' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center' }}>
                {/* Custom Loading Animation */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #fddc00',
                    borderTop: '5px solid #1e2337',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '20px auto',
                  }}
                />
                <p style={{ marginTop: '10px' }}>calculating...</p>
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            ) : (
              showJettonStats && (
                <JettonStats
                  accountId={walletDetails.address}
                  walletName={
                    walletDetails.name?.toLowerCase() === 'wallet'
                      ? 'Telegram Wallet'
                      : walletDetails.name
                  }
                />
              )
            )}
          </div>
        )}

        <div style={{ marginTop: '40px', display: 'flex', gap: '30px' }}>
          {currentPage > 1 && (
            <button
              onClick={handlePrevious}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0098ea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Previous
            </button>
          )}
          {currentPage === 3 && (
            <>
              {!walletDetails?.address && (
                <button
                  onClick={handleSkip}
                  style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '30px',
                    background: 'none',
                    color: '#fddc00', // Golden color for subtle appearance
                    border: 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Skip>>
                </button>
              )}
              {(!walletDetails?.address || isLoading) && (
                <button
                  onClick={handleConnect}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#5a5fff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={tonSymbol}
                    alt="TON Symbol"
                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                  />
                  Connect Wallet
                </button>
              )}
              {showJettonStats && (
                <button
                  onClick={handleSkip}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#5a5fff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={tonSymbol}
                    alt="TON Symbol"
                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                  />
                  Let's Go
                </button>
              )}
            </>
          )}
          {currentPage < 3 && (
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                backgroundColor: '#5a5fff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guide;
