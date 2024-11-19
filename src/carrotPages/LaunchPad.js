import React, { useState, useEffect } from "react";
import { FaDollarSign, FaBitcoin, FaEthereum, FaChevronDown } from "react-icons/fa";
import { BiArrowFromRight, BiDownArrow } from "react-icons/bi";
import { FiMenu, FiUser } from "react-icons/fi";
import { SiBinance, SiSolana } from "react-icons/si"; // Using available icons
import logo from "../assets/logo.png";  // Including the logo import
import Payment from '../components/Payment.js';
import { useWalletContext } from '../context/WalletContext.js';


const LaunchPad = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 60, hours: 0, minutes: 0, seconds: 0 });
  const [sellAmount, setSellAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("TON");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [currentPrice, setCurrentPrice] = useState(null); // To store the current price
  const [timeRemaining, setTimeRemaining] = useState(20); // Start with 30 seconds countdown
  const [showPayment, setShowPayment] = useState(false);
  const {
    wallet,
    walletAddress,
    fullUserFriendlyAddress,
    walletDetails,
    handleConnect,
    handleDisconnect: originalHandleDisconnect,
  } = useWalletContext();  

  const handleApprove = () => {
    setShowPayment(true);
  }    

  const tokenOptions = [
    { name: "USDT", icon: <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025" alt="USDT" className="w-5 h-5" /> },
    { name: "TON", icon: <img src="https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=025" alt="TON" className="w-5 h-5" /> },
    { name: "SUI", icon: <img src="https://cryptologos.cc/logos/sui-sui-logo.svg?v=025" alt="SUI" className="w-5 h-5" /> },
    { name: "SOL", icon: <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=025" alt="SOL" className="w-5 h-5" /> },
    { name: "BNB", icon: <img src="https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=025" alt="BNB" className="w-5 h-5" /> },
    { name: "BTC", icon: <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025" alt="BTC" className="w-5 h-5" /> },
    { name: "ETH", icon: <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025" alt="ETH" className="w-5 h-5" /> },
    { name: "TRX", icon: <img src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=025" alt="TRON" className="w-5 h-5" /> } // Added TRON
  ];


  useEffect(() => {
    const fetchPrice = async () => {
      const url = `${process.env.REACT_APP_API_URL}/price-updates?coin=${selectedToken}`;
      console.log("Fetching price from:", url);

      try {
        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Received data:", data);

        if (data && data.currentPrice) {
          setCurrentPrice(data.currentPrice);
          console.log("Current Price set to:", data.currentPrice);
        }
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    // Fetch the price for the first time and set the interval
    fetchPrice();

    // Set interval to fetch price every 30 seconds
    const intervalId = setInterval(() => {
      fetchPrice();
    }, 30000); // 30000 ms = 30 seconds

    // Countdown timer for the loader
    const countdownId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) return 30; // Reset countdown to 30 after it reaches 0
        return prevTime - 1;
      });
    }, 1000); // Update countdown every second

    // Cleanup interval when component is unmounted
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [selectedToken]); // Dependency on selectedToken to refetch price when it changes

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 60);

    const countdown = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(countdown);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Handle dropdown toggle and position
  const handleDropdownClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
    setShowDropdown(!showDropdown);
  };

  // Function to calculate $WTH amount
  const calculateWTHAmount = () => {
    if (sellAmount && currentPrice) {
      return (sellAmount * currentPrice / 0.0001).toFixed(2); // Calculates and formats the amount
    }
    return "0.00";
  };

  return (
    <div className="flex flex-col items-center p-2 text-[f7f9fb] font-sans mb-4 font-inter">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full max-w-md py-2">
        <div className="flex-1">
          <img src={logo} alt="Logo" className="w-10" />
        </div>
        <div className="flex items-center gap-2">
          <FaBitcoin className="text-[#f7f9fb] text-xl" />
          <BiArrowFromRight
            className="text-[#f7f9fb] text-xl cursor-pointer"
            onClick={() => {
              if (wallet) {
                originalHandleDisconnect(); // Trigger disconnect if wallet is connected
              }
            }}
          />

          <div>
            {wallet ? (
              <span className="bg-[#1e2337] text-[#f7f9fb] px-2 py-1 rounded-lg text-sm">
                {walletAddress}
              </span>
            ) : (
              <button
                onClick={handleConnect}
                className="text-[#f7f9fb] px-4 py-1 rounded-lg text-sm"
                style={{
                  backgroundColor: '#0098ea',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#2A314A')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#0098ea')}
              >
                Connect
              </button>

            )}
          </div>

          <FiUser className="text-xl text-[#fddc00]" />
          <FiMenu className="text-xl text-[#0098ea]" />
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center mt-2 max-w-md">
        <h1 className="text-2xl font-bold mb-2">$Next LaunchPad</h1>
        <p className="text-[#f7f9fb] text-base leading-relaxed">
          NexaBit Launchpad propels vetted meme tokens to the moon, giving users the chance to join early. Access the next big meme on TON now!
        </p>
      </div>

      {/* IDO Progress Section */}
      <div className="mt-8 w-full max-w-md p-4 bg-[rgba(30,35,55,0.3)] rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4 w-full max-w-xs mx-auto whitespace-nowrap">
          <div className="text-[#f7f9fb] text-xs sm:text-sm">TOTAL RAISED</div>
          <div className="flex items-center text-[#f7f9fb] font-bold text-lg sm:text-xl md:text-2xl">
            <FaDollarSign className="text-[#fddc00] mr-1" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              139,819.72 / 250,000 USDT
            </span>
          </div>
        </div>

        {/* Progress Bar and Text */}
        <div className="text-center text-[#f7f9fb] text-sm mb-2">
          Progress 55.92%
        </div>
        <div 
          className="relative rounded-full h-3 mb-4" 
          style={{ backgroundColor: '#D2B48C' }}
        >
          <div
            className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-[#5A5FFF] to-[#6B7CFE]"
            style={{ width: '55.92%', }}
          ></div>
        </div>

        {/* Allocation Info */}
        <div className="flex justify-between text-[#f7f9fb] text-sm mb-4">
          <div>
            <p>User Cap: 0</p>
            <p>HardCap: <span className="text-[#f7f9fb] text-xs">$500,000</span></p>
            <p>SoftCap: <span className="text-[#f7f9fb] text-xs">$250,000</span></p>
          </div>
          <div>
            <p>PARTICIPANTS: <span className="text-[#fddc00] font-bold"> 1287</span></p>
          </div>
        </div>

        {/* Swap Interface */}
        <label className="block text-[#f7f9fb] text-sm mb-1">Indicate the amount of $WarThog that you want to secure below</label>
        <div className="mt-6 w-full max-w-lg p-4 rounded-lg" >
          <div className="mb-4">
            <div
              className="flex items-center p-2 rounded-lg border border-purple"
               // Darker background for input field container
            >
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="bg-transparent text-[#f7f9fb] w-full outline-none placeholder-[#f7f9fb] bg-[rgba(30,35,55,0.1)]"
                // Ensure input area has the same background color
                placeholder="Enter amount"
              />
              <div
                className="flex items-center gap-1 ml-2 text-[#f7f9fb] cursor-pointer relative shadow-md"
                onClick={handleDropdownClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "2rem",
                  flexShrink: 0,
                  // Subtle gray background for the container
                  padding: "0.2rem 0.6rem", // Padding to make it look more like a button
                  borderRadius: "0.4rem", // Slight rounding of the container
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.4)", // Custom shadow for more precise control
                }}
              >
                {/* Coin icon added back */}
                <span className="text-[f7f9fb] text-sm ml-1">${currentPrice}</span> {/* Smaller, white price */}
                {tokenOptions.find((token) => token.name === selectedToken)?.icon}
                <span className="ml-1 text-[f7f9fb]">{selectedToken}</span>
                <FaChevronDown className="ml-1 text-[f7f9fb]" size={14} />
              </div>

              {showDropdown && (
                <div
                  className="absolute w-20 shadow-lg rounded-lg"
                  style={{
                    backgroundColor: "#0098ea", // Purple background for dropdown
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                  }}
                >
                  {tokenOptions.map((token) => (
                    <div
                      key={token.name}
                      className="flex items-center gap-2 p-2 text-[f7f9fb] hover:cursor-pointer"
                      onClick={() => {
                        setSelectedToken(token.name);
                        setShowDropdown(false);
                      }}
                    >
                      {token.icon} {token.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-[#f7f9fb] text-sm mt-2">
            You will get <span style={{ color: '#fddc00', fontWeight: 'bold', fontSize: '1.2em' }}>
              {Number(calculateWTHAmount()).toLocaleString()}
            </span> <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>$WTH</span> for contributing {sellAmount || 0} {selectedToken}.

          </p>
        </div>


        {/* Approve Button */}
        <button
          onClick={handleApprove}
          className="w-full text-[f7f9fb] font-semibold py-2 rounded-lg mt-4"
          style={{ backgroundColor: "#0098ea" }}
        >
          Approve
        </button>

        {showPayment && (
          <Payment
            sellAmount={sellAmount}
            selectedToken={selectedToken}
            calculateWTHAmount={calculateWTHAmount}
            setShowPayment={setShowPayment}
          />
        )}        

        {/* Timer */}
        <div
          className="-mt-4 mb-20 text-center py-4 px-8 rounded-lg shadow-lg"
        >
          <p className="text-sm mt-2">Round One ends in: </p>
          <div className="flex justify-center gap-2">
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.minutes}m</span>
            <span>{timeLeft.seconds}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPad;
