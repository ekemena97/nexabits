import React, { useState, useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import { 
  useTelegramUser, 
  useTelegramStartappParam as useTelegramReferrerId, 
  useTelegramFirstName, 
  useTelegramUsername, 
  useTelegramIsBot, 
  useTelegramIsPremium 
} from "../context/TelegramContext.js"; // Import all the hooks
import { FaGift, FaCopy, FaThumbsUp } from "react-icons/fa";
import { GoPersonAdd } from "react-icons/go";
import crypto from "../assets/crypto.png";

const Referrals = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser(); // Get the userId from the context
  const referrerId = useTelegramReferrerId(); // Get the referrerId from the context
  const firstName = useTelegramFirstName(); // Get the firstName from the context
  const username = useTelegramUsername(); // Get the username from the context
  const isBot = useTelegramIsBot(); // Get the isBot from the context
  const isPremium = useTelegramIsPremium(); // Get the isPremium from the context

  const [copySuccess, setCopySuccess] = useState(false);
  const [referredUsers, setReferredUsers] = useState([]);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (userId) {
      console.log('userId in Referrals:', userId); // Log userId to the console
      setReferralLink(`https://t.me/TapLengendBot/start?startapp=${userId}`);
      
      // Fetch referral data from the server
      fetch(`${process.env.REACT_APP_API_URL}/checkref?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          setReferredUsers(data.referredUsers);
          setSuccessfulReferrals(data.successfulReferrals);
        })
        .catch(error => {
          console.error('Error fetching referral data:', error);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (referrerId) {
      console.log('referrerId in Referrals:', referrerId); // Log referrerId to the console
    }
  }, [referrerId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
      console.log('Referral link copied to clipboard');
    });
  };

  const handleShareLink = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${referralLink}&text=${encodeURIComponent(
      "🎁 New and Hot! First Time Gift for Playing with Me\n💵 5K $Squad tokens as a first-time gift."
    )}`;
    window.open(telegramShareUrl, "_blank");
    console.log('Sharing referral link:', telegramShareUrl);
  };

  return (
    <section
      className={`h-full w-[90%] flex flex-col sm:mt-20 mt-12 mb-24 relative ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#19191E] to-[#232323] text-[#fff]"
          : "bg-[#fff] text-[#19191E]"
      } `}
    >
      <h1 className="sm:text-2xl text-xl my-3 text-center font-semibold text-gray-100">
        Referrals
      </h1>

      <div
        className={`w-full min-h-[70vh] sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide ${
          theme === "dark"
            ? "bg-[#19191E] text-[#fff]"
            : "bg-[#F1F2F2] text-[#19191E]"
        }`}
      >
        <div className="flex flex-col items-center sm:p-0 p-3 gap-3">
          <div className="flex flex-col gap-1 sm:w-[80%] w-full items-center py-0 justify-items-center">
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#19191E] text-[#fff]"
                  : "bg-[#F1F2F2] text-[#19191E]"
              } sm:text-6xl text-3xl font-semibold`}
            >
              Invite Friends
            </div>
            <div className="text-sm text-gray-100 text-center">
              You and your friends will receive bonuses
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#fff] border border-[#F1F2F2]"
            } flex flex-row sm:gap-4 gap-1 items-center px-6 sm:w-[80%] w-full py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300`}
          >
            <FaGift className="text-gray-100 sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-gray-100 text-sm">Invite a friend</div>
              <div className="text-gray-100 text-sm flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+500</span> for you and
                  your friend.
                </div>
              </div>
            </div>

          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#fff] border border-[#F1F2F2]"
            } flex flex-row sm:gap-4 gap-1 items-center px-6 sm:w-[80%] w-full py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300`}
          >
            <FaGift className="text-gray-100 sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-gray-100 text-sm">Invite Telegram Premium friend</div>
              <div className="text-gray-100 text-sm flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+10,000</span> for you and
                  your friend.
                </div>
              </div>
            </div>
            
          </div>

          <div className="relative w-full flex flex-col items-center">
            {copySuccess && (
              <div className="absolute top-2 text-red-500 flex items-center justify-center mt-4">
                <FaThumbsUp className="mr-2" />
                Copy Successful
              </div>
            )}

            <div
              className="sm:text-xl text-base font-semibold text-[#5A5FFF] cursor-pointer mt-2"
              onClick={handleCopyLink}
            >
              Tap here to copy your Unique link
            </div>

            <div className="flex flex-row items-center sm:w-[90%] w-[90%] mt-2">
              <div
                className={`${
                  theme === "dark"
                    ? "bg-[#232323] border border-gray-200"
                    : "bg-[#fff] border border-[#F1F2F2]"
                } flex flex-row sm:gap-4 gap-1 items-center px-6 py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300 text-gray-100 sm:w-full w-full`}
                onClick={handleCopyLink}
              >
                <h1 className="text-xs">{referralLink}</h1>
              </div>
              <FaCopy className="cursor-pointer" onClick={handleCopyLink} />
            </div>

            <div
              className="flex flex-row items-center justify-center gap-2 bg-[#5A5FFF] sm:text-xl text-base font-semibold text-[#fff] cursor-pointer py-4 px-8 rounded-md sm:w-[80%] w-full mt-2"
              onClick={handleShareLink}
            >
              <div>Share to your friends</div>
              <GoPersonAdd />
            </div>

            <div className="sm:w-[80%] w-full py-3">
              <div className="text-center">
                Total Referrals: {referredUsers.length}
              </div>
              <div className="text-center">
                Successful Referrals: {successfulReferrals}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
