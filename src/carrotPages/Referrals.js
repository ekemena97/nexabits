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
      className="h-full w-full flex flex-col sm:mt-2 mt-2 mb-5 relative"
    >
      {/* Contest Button */}
      <div
        className="w-full sm:pb-12 pb-0 rounded"
      >
        <div className="flex flex-col items-center sm:p-0 p-3 gap-3">
          {/* Task Header */}
          <div className="flex flex-col gap-1 sm:w-[80%] w-full items-center py-0 justify-items-center">
            <h2 className="text-center text-white">
              <span className="text-sm font-semibold">Task 3: </span>
              <span className="text-xs">Invite 2 of your active friends</span>
            </h2>

            <div className="text-xs text-white text-center">
              You and your friends will receive exclusive NFT unlocks
            </div>
          </div>

          {/* Invite Card */}
          <div
            className="border border-purple bg-black/15 flex flex-row sm:gap-4 gap-2 items-center px-4 sm:px-6 w-full max-w-[600px] py-2 rounded-md cursor-pointer"
          >
            <FaGift className="text-blue sm:text-5xl text-4xl" />
            <div className="flex flex-col gap-1">
              <div className="text-white text-xs">Invite a friend</div>
              <div className="text-white text-[10px] leading-tight">
                <span className="text-[#EBD14C] text-sm font-bold text-sm">+50</span> for you and
                <br />
                your friend.
              </div>
            </div>
            <div className="flex flex-col ml-auto text-right text-xs text-white justify-center">
              <div className="flex flex-row items-center gap-2 w-full text-[10px] whitespace-nowrap">
                <span className="font-bold text-white">Friends invited:</span>
                <span className="text-[#EBD14C] font-bold text-sm flex-shrink-0">
                  {totalReferrals} <span className="text-white font-normal">/</span> 2
                </span>
              </div>
              <div className="flex flex-col items-start text-[9px]">
                <div>
                  <span className="text-[#EBD14C] font-bold text-xs">+{successfulReferrals}</span>{" "}
                  are active.
                </div>
                <div>
                  <span className="text-[#EBD14C] font-bold text-xs">+{premiumReferredUsers}</span>{" "}
                  are Premium.
                </div>
              </div>
            </div>
          </div>





          {/* Referral Link */}
          <div className="relative w-full flex flex-col items-center mb-16">
            {copySuccess && (
              <div className="absolute top-2 text-red-500 flex items-center justify-center mt-4">
                <FaThumbsUp className="mr-2" />
                Copy Successful
              </div>
            )}
            <div
              className="sm:text-xl text-base font-semibold text-white cursor-pointer mt-2 mb-2"
              onClick={handleCopyLink}
            >
              Tap here to copy your Unique link
            </div>
            <div className="flex flex-row items-center sm:w-[95%] w-full max-w-[500px] mt-2">
              <div
                className="border border-purple flex flex-row gap-2 items-center justify-center px-6 py-3 rounded-md cursor-pointer text-gray-100 w-full"
                onClick={handleCopyLink}
              >
                <h1 className="text-sm text-center items-center justify-center">{referralLink ? `${referralLink.slice(0, 6)}...${referralLink.slice(-6)}` : "No Ref link"}</h1>
              </div>
              <FaCopy className="cursor-pointer text-xl" onClick={handleCopyLink} />
            </div>

            <div
              className="flex flex-row items-center justify-center gap-2 bg-purple sm:text-xl text-base font-semibold text-[#fff] cursor-pointer py-4 px-8 rounded-md sm:w-[80%] w-full mt-4 mb-5"
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
