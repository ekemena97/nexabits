import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, saveData } from '../components/firebaseHelper.js'; // Import fetchData to check guide status
import { useWalletContext } from '../context/WalletContext.js';
import tonSymbol from '../assets/ton_symbol.png'; // Adjust the path to your TON symbol image
import gift from '../assets/gift.png';
import { FaChevronLeft } from 'react-icons/fa'; 
import { useTapContext } from "../context/TapContext.js";
import { useDataContext } from "../context/DataContext.js";
import {
  useTelegramUser,
  useTelegramStartappParam as useTelegramReferrerId,
  useTelegramFirstName,
  useTelegramUsername,
  useTelegramIsBot,
  useTelegramIsPremium,
  } from "../context/TelegramContext.js";

const Guide = () => {
  const { fetchDataById, loading, error, score, scoreDetails, aggregates, nftData, formatDate, awardRandomWorth, walletScore, } = useDataContext();
  const navigate = useNavigate();
  const { incrementPoints } = useTapContext();
  const userId = useTelegramUser();
  const referrerId = useTelegramReferrerId();
  const firstName = useTelegramFirstName();
  const username = useTelegramUsername();
  const isBot = useTelegramIsBot();
  const isPremium = useTelegramIsPremium();
  const {
    walletDetails,
    handleConnect,
    handleDisconnect,
    fullUserFriendlyAddress,
  } = useWalletContext();

  const accountId = walletDetails?.address || '';
  const walletName =
    walletDetails.name?.toLowerCase() === 'wallet'
      ? 'Telegram Wallet'
      : walletDetails.name || '';    
  const [hasSeenGuide, setHasSeenGuide] = useState(null); // Track guide status
  const [currentStep, setCurrentStep] = useState('welcome'); // Manage flow state
  const [referralDetails, setReferralDetails] = useState(null); // Store referral data
  const [dataFetched, setDataFetched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const steps = [
    "welcome",
    "reward",
    "firstTransaction",
    "interactions",
    "numberOfTransactions",
    "numberOfNft",
    "favouriteWallet",
    "referredBy",
    "isPremium",
    "usernameWorth",
    "total",
  ]; 

  const {
    nonZeroBalanceTokens,
    zeroBalanceTokens,
    scamTokens,
    suspiciousNFTs,
    scamTransactions,
    totalTransactions,
    durationDays,
    durationText,
    firstTransactionDate,
  } = aggregates;

  const {
    tokensScore,
    nftsScore,
    ageScore,
    scamDeduction,
    interactionsScore,
    totalTransactionsScore,
  } = scoreDetails; 

  const referredByScore = referrerId ? 1000 : 0; 
  const isPremiumScore = isPremium ? 500 : 0; 
  const overallScore = score + isPremiumScore + referredByScore + bonusScore + awardRandomWorth(walletName) - (nftsScore * 10) - (scamDeduction * 10);

  useEffect(() => {
    const hasRunBefore = localStorage.getItem('randomBonusGenerated');
    if (!hasRunBefore) {
      const randomBonus = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
      setBonusScore(randomBonus);
      localStorage.setItem('randomBonusGenerated', 'true');
    }
  }, []); // Runs only once when the component mounts  

  useEffect(() => {
    const timer = setInterval(() => {
      // If the step is 'welcome', do not proceed to the next step
      if ((currentStep === 'welcome' && !walletDetails?.address) || currentStep === 'total') {
        return;
      }

      // If the step is 'reward', only proceed if the wallet is connected
      if (currentStep === 'reward' && !walletDetails?.address) {
        return;
      }

      // Move to the next step
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      setCurrentStep(steps[(currentStepIndex + 1) % steps.length]);
    }, 7000);

    return () => clearInterval(timer); // Clear timer when component unmounts
  }, [currentStepIndex, steps, currentStep, walletDetails]);


  useEffect(() => {
    if (walletDetails?.address) {
      setCurrentStep('firstTransaction');
    }
  }, [walletDetails?.address]);  

  useEffect(() => {
    if (accountId && !dataFetched) {
      fetchDataById(accountId);
      setDataFetched(true);
    }
  }, [accountId, fetchDataById, dataFetched]);  

  // Check if the user has already seen the guide
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

  // Fetch referral details from the endpoint
  useEffect(() => {
    const fetchReferralDetails = async () => {
      if (!referrerId) return; // Only fetch if referrerId exists

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/referral?referrerId=${referrerId}`);
        const data = await response.json();

        if (response.ok) {
          setReferralDetails(data); // Save referral details to state
        } else {
          console.error("Error fetching referral details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching referral details:", error);
      }
    };

    fetchReferralDetails();
  }, [referrerId]);  

  const handleHome = async () => {
    await saveData(userId, { hasSeenGuide: true });
    setHasSeenGuide(true);
    navigate('/');
  };  

  const handleStart = () => {
    if (walletDetails?.address) {
      setCurrentStep('firstTransaction'); // Transition to the first transaction screen
    } else {
      setCurrentStep('reward'); // Transition to the reward screen
    }
  };

  // General handler to dynamically change the current step
  const handleStepChange = (stepName) => {
    setCurrentStep(stepName); // Set the current step dynamically
  };




  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };  

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      handleDisconnect(); // Disconnect on toggle off
    }
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown state
  };  

  if (error) {
    return (
      <p className="text-center text-gold">
        Error: {error}. Please try again later.
      </p>
    );
  } 

  // Define your progress bar component
  const ProgressBar = ({ steps, currentStepIndex }) => {
    const [fillWidth, setFillWidth] = useState(0); // To track the current step's filling percentage
    const fillDuration = 7000; // 10 seconds for each step

    useEffect(() => {
      setFillWidth(0); // Reset fill for the new step

      const fillInterval = setInterval(() => {
        setFillWidth((prev) => {
          if (prev >= 100) {
            clearInterval(fillInterval); // Stop filling once complete
            return 100; // Cap at 100%
          }
          return prev + 1; // Increment fill width by 1% per tick
        });
      }, fillDuration / 100); // Calculate the interval for smooth filling (e.g., 100 steps over 10s)

      return () => clearInterval(fillInterval);
    }, [currentStepIndex]); // Re-run when the current step changes

    return (
      <div className="flex w-full items-center justify-center bg-[#1f213a] py-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex-1 mx-1 relative h-0.5 rounded-md overflow-hidden"
            style={{
              backgroundColor:
                index < currentStepIndex
                  ? "#fff" // Purple for previous steps
                  : "#808080", // White for the current and future steps initially
            }}
          >
            {/* Filling effect for the current step */}
            {index === currentStepIndex && (
              <div
                className="absolute top-0 left-0 h-full transition-all"
                style={{
                  width: `${fillWidth}%`, // Dynamic width based on state
                  background: `linear-gradient(
                    90deg, 
                    #ffffff 0%,       /* Start as white */
                    #FFD700 50%,      /* Gold at midpoint */
                    #DAA520 100%      /* Deeper gold at the end */
                  )`,
                  transition: "width 0.1s linear, background-color 0.3s ease-in-out", // Smooth animation
                  boxShadow: "0 0 10px #FFD700", // Add a subtle glow effect for richness
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Top Progress Bar */}
      {currentStep !== 'welcome' && currentStep !== 'reward' && (
        <ProgressBar steps={steps} currentStepIndex={currentStepIndex} />
      )}

      <div className="flex-1">

        {currentStep === 'welcome' && (
          <div className="flex flex-col items-center min-h-screen bg-black text-white text-center px-4 mt-6 font-inter">
            <div className="mb-20">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">WELCOME TO </h1>
              <h1 className="text-gold font-extrabold text-3xl sm:text-4xl">NexaBits</h1>
            </div>

            {/* Illustration */}
            <div className="mb-4">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>            
            <div className="mt-4">
              <p className="text-lg sm:text-xl font-semibold text-white max-w-md mt-4 uppercase text-center p-2">
                We Turn blockchain activities into interactive <span className="text-gold">RWA (Real World Asset)</span>, and protects users from <span className="text-gold">scams</span>.
              </p>
              <button
                className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold mt-8 py-3 px-20 rounded-md text-lg transition-all duration-300"
                onClick={handleStart}
              >
                Let’s start
              </button>
            </div>
          </div>
        )}      

        {currentStep === 'reward' && (
          <div className="flex flex-col items-center min-h-screen bg-black text-white text-center py-2 relative mt-10">
            <div className="absolute bottom-[15%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('welcome')}>
              <FaChevronLeft />
            </div>
            <h1 className="text-2xl sm:text-2xl font-extrabold mb-10 px-2 text-justify">
              Get your first-time reward for interacting on TON ecosystem
            </h1>


            {/* Illustration */}
            <div className="mb-4">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>             
            <div className="mt-12">
              <p className="text-lg sm:text-xl font-light text-gold max-w-md mb-8">
                Connect Wallet to reveal your reward
              </p>
            </div>
            {(!walletDetails?.address || loading) && (
            <button
              onClick={handleConnect}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 flex items-center gap-2">
              <img src={tonSymbol} alt="TON Symbol" className="w-6 h-6"
            />
              Connect Wallet
            </button>
            )}

            {walletDetails?.address && (
              <button
                onClick={toggleDropdown}
                className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 flex items-center justify-between gap-2"
              >
                {formatWalletAddress(walletDetails.address)}
                <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
            )}

            <span
              className="absolute bottom-[15%] right-[10%] right-6 text-gold text-lg cursor-pointer"
              onClick={() => {
                setIsSkipped(true); // Record the click
                handleStepChange("referredBy"); // Call the step change logic
              }}
            >
              Skip &gt;&gt;
            </span>
          </div>
        )}


        {currentStep === 'firstTransaction' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter relative">
            <div
              className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg"
              onClick={() => setCurrentStep('reward')}
            >
              <FaChevronLeft />
            </div>            

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  Wow, you've been interacting on the TON ecosystem for{" "}
                  <span className="text-[#0098ea] font-medium">{durationText}</span>!
                </p>
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{ageScore}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("interactions")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}


        {currentStep === 'interactions' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('firstTransaction')}>
              <FaChevronLeft />
            </div>          
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  You made your first TON transaction on{" "}
                  <span className="text-[#2d83ec] font-medium">{formatDate(firstTransactionDate)}</span>.
                </p>
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{interactionsScore}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>            

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("numberOfTransactions")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}  


        {currentStep === 'numberOfTransactions' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('interactions')}>
              <FaChevronLeft />
            </div>          
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  You've done over{" "}
                  <span className="text-[#2d83ec] font-medium">
                    {totalTransactions} transactions
                  </span>, and about{" "}
                  <span className="text-[#fddc00] font-medium">
                    {scamTransactions} were scams
                  </span>
                  . Keep an eye out, and continue exploring safely!
                </p>
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex flex-col items-center space-y-4"> {/* Changed from space-x-4 to space-y-4 */}
                <div className="flex items-center space-x-2">
                  <span className="text-6xl font-extrabold text-gold animate-flyIn">+{totalTransactionsScore}</span>
                  <img src={gift} alt="Gift" className="w-12 h-12" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-6xl font-extrabold text-gold animate-flyIn">-{scamDeduction * 10}</span>
                  <img src={gift} alt="Gift" className="w-12 h-12" />
                </div>
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>            

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("numberOfNft")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === 'numberOfNft' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('numberOfTransactions')}>
              <FaChevronLeft />
            </div>           
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  You currently have about{" "}
                  <span className="text-[#fddc00] font-medium">
                    {nftsScore}
                  </span>{" "}
                  suspicious NFTs in your wallet. Double-check their legitimacy to ensure they're safe!
                </p>
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  -{nftsScore * 10}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>                      

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("favouriteWallet")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === 'favouriteWallet' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('numberOfNft')}>
              <FaChevronLeft />
            </div>           
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  You currently own{" "}
                  <span className="text-[#2d83ec] font-medium">
                    {nonZeroBalanceTokens}
                  </span>{" "}
                  tokens on the TON ecosystem.
                </p>
                <p className="text-sm">
                  And your favorite wallet is{" "}
                  <b className="text-[#5a5fff]">{walletName}</b>.
                </p>            
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{walletScore(walletName) + tokensScore}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>            

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("referredBy")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}    

        {currentStep === 'referredBy' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('favouriteWallet')}>
              <FaChevronLeft />
            </div>           
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <div style={{ textAlign: "center", padding: "20px", fontSize: "18px", color: "#f7f9fb" }}>
                <p>
                  Hey {username || firstName}! You're a social butterfly 🦋—your awesome friend <span className="text-gold font-bold">{referralDetails}</span> sent you here!
                </p>
              </div>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{referredByScore}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>             

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("isPremium")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === 'isPremium' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
              <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('referredBy')}>
              <FaChevronLeft />
            </div>         
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <div style={{ padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                <div>
                  {isPremium ? (
                    <h2 style={{ color: "#5a5fff" }}>🎉 You're a Telegram Premium User! 🚀</h2>
                  ) : (
                    <h2 style={{ color: "#ff5722" }}>🙌 Enjoying Telegram's Free Features! 🌟</h2>
                  )}
                </div>
                <p style={{ color: "#f7f9fb", fontSize: "16px" }}>
                  {isPremium
                    ? "Thanks for supporting Telegram and enjoying the premium perks!"
                    : "Consider upgrading to Premium to unlock exclusive features like larger uploads, no ads, and more!"}
                </p>
              </div>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{isPremiumScore}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>             

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("usernameWorth")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}  

        {currentStep === 'usernameWorth' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
              <div className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg" onClick={() => setCurrentStep('isPremium')}>
              <FaChevronLeft />
            </div>         
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <h2 className="text-xl sm:text-2xl font-light max-w-lg text-[#dcdcdc]">
                <p>
                  Your username ({useTelegramUsername}) is currently worth{" "}
                  <span className="text-[#fddc00] font-medium">
                    {awardRandomWorth(useTelegramUsername)}
                  </span>{" "}
                </p>
                <p className="flex items-center space-x-1">
                  <img src={tonSymbol} alt="Crypto Icon" className="w-5 h-5" />
                  <span>
                    TON on <b className="text-[#5a5fff]">Fragment</b>.
                  </span>
                </p>
                <p className="text-xs mt-2">Need some cash? Explore trading it on Telegram Fragment</p>            
              </h2>
            </div>

            {/* Animated Score */}
            <div className="mb-12 relative">
              {/* Score */}
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-extrabold text-gold animate-flyIn">
                  +{awardRandomWorth(useTelegramUsername) + 5}
                </div>
                <img src={gift} alt="Gift" className="w-12 h-12" />
              </div>

              {/* Coin Animation */}
              <div className="absolute left-0 top-0 w-8 h-8 bg-gold rounded-full animate-coinFollow shadow-md"></div>
            </div>             

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                {/* Simulating an icon or illustration */}
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleStepChange("total")}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )} 


        {currentStep === 'total' && (
          <div className="flex flex-col items-center min-h-screen bg-[#0b0c1e] text-white text-center px-4 py-10 font-inter">
            {/* Navigation */}
            <div
              className="absolute bottom-[10%] left-[10%] cursor-pointer flex items-center gap-2 text-blue text-lg"
              onClick={() => setCurrentStep('usernameWorth')}
            >
              <FaChevronLeft />
            </div>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gold">
                Congratulations!
              </h1>
              <div className="text-lg sm:text-xl text-[#f7f9fb] font-medium mt-2">
                Well done, {username || firstName}! Your efforts have paid off 🎉
              </div>
            </div>

            {/* Total Score Display */}
            <div className="mb-12">
              <div className="flex flex-col items-center">
                <p className="text-xl sm:text-2xl font-semibold text-[#f7f9fb] mb-2">
                  Your Total Score is:
                </p>
                <div className="text-7xl sm:text-8xl font-extrabold text-gold animate-bounce-2s">
                  {overallScore}
                </div>
                <img
                  src={gift}
                  alt="Gift"
                  className="w-14 h-14 mt-4 animate-spin-slow"
                />
              </div>
            </div>

            {/* Illustration */}
            <div className="mb-12">
              <div className="rounded-full bg-[#1f213a] p-12 flex justify-center items-center shadow-lg animate-breathing">
                <img src={tonSymbol} alt="Crypto Icon" className="w-16 h-16" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleHome}
              className="bg-[#3390ec] hover:bg-[#5a5fff] text-white font-bold py-3 px-16 rounded-md text-lg transition-all duration-300"
            >
              Let's Go oooo
            </button>
          </div>
        )}

      </div>
    </div>
  );
};        

export default Guide;
