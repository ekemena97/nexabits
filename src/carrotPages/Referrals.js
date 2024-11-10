import React, { useState, useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import {
  useTelegramUser,
  useTelegramStartappParam as useTelegramReferrerId,
  useTelegramFirstName,
  useTelegramUsername,
  useTelegramIsBot,
  useTelegramIsPremium,
} from "../context/TelegramContext.js";
import { useReferralContext } from "../context/ReferralContext.js";
import { FaGift, FaCopy, FaThumbsUp, FaTrophy, FaChevronRight } from "react-icons/fa"; // Import the FaTrophy icon
import { GoPersonAdd } from "react-icons/go";
import { Link } from "react-router-dom"; // Import Link for navigation
import crypto from "../assets/crypto.png";

const Referrals = () => {
  const { theme } = useThemeContext();
  const userId = useTelegramUser();
  const referrerId = useTelegramReferrerId();
  const firstName = useTelegramFirstName();
  const username = useTelegramUsername();
  const isBot = useTelegramIsBot();
  const isPremium = useTelegramIsPremium();

  const [copySuccess, setCopySuccess] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const { totalReferrals, successfulReferrals, ordinaryReferredUsers, premiumReferredUsers } = useReferralContext();

  useEffect(() => {
    if (userId) {
      console.log('userId in Referrals:', userId);
      setReferralLink(`https://t.me/NexaBit_Tap_bot/start?startapp=${userId}`);
    }
  }, [userId]);

  useEffect(() => {
    if (referrerId) {
      console.log('referrerId in Referrals:', referrerId);
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
      className="h-full w-[90%] flex flex-col sm:mt-2 mt-2 mb-5 relative"
    >

      {/* Contest Button */}
      {/*<Link
        to={`/leaderboard`}
        className="absolute flex items-center gap-2 p-2 text-white rounded-md text-lg font-bold cursor-pointer transition-transform duration-150 ease-in hover:bg-[#4A4FFF] hover:scale-105"
        style={{ top: '-2.9rem', right: '-0.3rem', zIndex: 1500 }}
      >
        <span className="inline-flex items-center gap-1" style={{ borderBottom: '2px solid purple' }}>
          <FaTrophy className="text-2xl" style={{ color: 'gold' }} /> Contest
          <FaChevronRight className="ml-0 text-lg" style={{ fontSize: '0.6rem' }} />
        </span>
        <span className="absolute text-xs text-yellow-300 animate-pulse" style={{ top: '2.5rem', right: '1rem' }}>
          Join Now!🔥
        </span>
      </Link> */}



      <div
        className="w-full min-h-[70vh] sm:pb-12 pb-0 rounded overflow-y-scroll scrollbar-hide"
      >
        <div className="flex flex-col items-center sm:p-0 p-3 gap-3">
          <div className="flex flex-col gap-1 sm:w-[80%] w-full items-center py-0 justify-items-center">
            <div className="sm:text-l text-xl">
              <span className="text-l font-semibold">Task 3:</span> 
              <span className="font-normal text-lg"> Invite 2 of your active friends</span>
            </div>


            <div className="text-sm text-gray-100 text-center">
              You and your friends will receive bonuses and NFT unlocks
            </div>
          </div>

          <div
            className="border border-gray-200 flex flex-row sm:gap-4 gap-1 items-center px-4 sm:px-6 sm:w-[80%] w-full py-2 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300"
          >
            <FaGift className="text-gray-100 sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-gray-100 text-xs">Invite a friend</div>
              <div className="text-gray-100 text-xs flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+50</span> for you and your friend.
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-auto text-right text-xs text-white justify-center">
              <div className="text-[10px]">
                <span className="font-bold">Friends invited:</span> <span className="text-[#EBD14C] font-bold text-sm">{totalReferrals} <span className="text-white font-normal">/</span> 2</span>
              </div>
              <div className="flex flex-col items-start text-[9px]">
                <div>
                  <span className="text-[#EBD14C] font-bold text-xs">+{successfulReferrals}</span> are active.
                </div>
                <div>
                  <span className="text-[#EBD14C] font-bold text-xs">+{premiumReferredUsers}</span> are Premium.
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
                className="border border-gray-200 flex flex-row sm:gap-4 gap-1 items-center px-6 py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300 text-gray-100 sm:w-full w-full"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
