import React, { useEffect, useState } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { FaGift, FaCopy, FaThumbsUp } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import crypto from "../assets/crypto.png";
import { useTapContext } from "../context/TapContext";

// Utility function to generate a unique referral link
const generateUniqueReferralLink = () => {
  const baseUrl = "https://t.me/TapLengendBot/start?startapp=ID";
  const uniqueNumber = Math.floor(100000000 + Math.random() * 900000000);
  const referralText = `🎁 New and Hot! First Time Gift for Playing with Me\n💵 5K $Squad tokens as a first-time gift.\n🔥 25K $Squad tokens if you have Telegram Premium.`;
  return {
    link: `${baseUrl}${uniqueNumber}`,
    textLink: `${baseUrl}${uniqueNumber}&text=${encodeURIComponent(referralText)}`,
  };
};

const Referrals = () => {
  const { theme } = useThemeContext();
  const [uniqueReferralLink, setUniqueReferralLink] = useState("");
  const [textReferralLink, setTextReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    let storedLink = localStorage.getItem("uniqueReferralLink");
    let storedTextLink = localStorage.getItem("textReferralLink");
    if (!storedLink || !storedTextLink) {
      const { link, textLink } = generateUniqueReferralLink();
      storedLink = link;
      storedTextLink = textLink;
      localStorage.setItem("uniqueReferralLink", link);
      localStorage.setItem("textReferralLink", textLink);
    }
    setUniqueReferralLink(storedLink);
    setTextReferralLink(storedTextLink);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(uniqueReferralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    });
  };

  const handleShareLink = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${uniqueReferralLink}&text=${encodeURIComponent(
      "🎁 New and Hot! First Time Gift for Playing with Me\n💵 5K $Squad tokens as a first-time gift.\n🔥 25K $Squad tokens if you have Telegram Premium."
    )}`;
    window.open(telegramShareUrl, "_blank");
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
              Your and your friends will receive bonuses
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
                  <span className="text-[#EBD14C]">+5,000</span> for you and
                  your friend
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
              <div className="text-gray-100 text-sm">
                Invite a friend with telegram premium
              </div>
              <div className="text-gray-100 text-sm flex flex-row gap-2 sm:items-center items-start">
                <img src={crypto} className="sm:w-6 w-4 hidden sm:flex" />
                <div>
                  <span className="text-[#EBD14C]">+25,000</span> for you and
                  your friend
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
          </div>

          <div className="flex flex-row items-center sm:w-[80%] w-full mt-2">
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#232323] border border-gray-200"
                  : "bg-[#fff] border border-[#F1F2F2]"
              } flex flex-row sm:gap-4 gap-1 items-center px-6 py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300 text-gray-100 sm:w-[80%] w-full`}
              onClick={handleCopyLink}
            >
              <h1 className="text-sm">{uniqueReferralLink}</h1>
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

          <div className="flex flex-row items-center justify-between sm:w-[80%] w-full mt-6">
            <div className="sm:text-base text-sm">List of your friends</div>
            <FiRefreshCw />
          </div>
          <div
            className={`${
              theme === "dark"
                ? "bg-[#232323] border border-gray-200"
                : "bg-[#fff] border border-[#F1F2F2]"
            } flex flex-row sm:gap-4 gap-1 items-center px-6 sm:w-[80%] w-full py-3 rounded-md cursor-pointer transition-all duration-150 ease-in hover:bg-gray-300 text-gray-100`}
          >
            You haven't invited anyone yet
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
