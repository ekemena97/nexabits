import React, { useState } from "react";
import { FaCrown, FaEthereum, FaBitcoin } from "react-icons/fa"; // Import icons
import { FiCopy } from "react-icons/fi";
import PropTypes from "prop-types";


const Dashboard = ({ tokenData }) => {
  if (!tokenData) return null; // No data, render nothing

  const {
    token_name,
    token_symbol,
    total_supply,
    creator_address,
    creator_balance,
    creator_percent,
    owner_address,
    owner_balance,
    owner_percent,
    holder_count,
    holders = [],
    buy_tax,
    sell_tax,
    dex,
    lp_holder_count,
    lp_holders = [],
  } = tokenData;
  function formatNumber(value) {
      const number = Number(value);
      if (isNaN(number)) return "N/A";

      if (number >= 1e27) return (number / 1e27).toFixed(1) + "D"; // Decillion
      if (number >= 1e24) return (number / 1e24).toFixed(1) + "N"; // Nonillion
      if (number >= 1e21) return (number / 1e21).toFixed(1) + "O"; // Octillion
      if (number >= 1e18) return (number / 1e18).toFixed(1) + "S"; // Septillion
      if (number >= 1e15) return (number / 1e15).toFixed(1) + "Q"; // Quadrillion
      if (number >= 1e12) return (number / 1e12).toFixed(1) + "T"; // Trillion
      if (number >= 1e9) return (number / 1e9).toFixed(1) + "B"; // Billion
      if (number >= 1e6) return (number / 1e6).toFixed(1) + "M";   // Million
      if (number >= 1e3) return (number / 1e3).toFixed(1) + "K";   // Thousand
      return number.toFixed(1); // Default formatting
  }



  const AddressDisplay = ({ address }) => {
    const [copyNotification, setCopyNotification] = useState(false);

    // Check if address exists before slicing
    const truncatedAddress = address
      ? `${address.slice(0, 10)}....${address.slice(-10)}`
      : "N/A"; // Fallback in case address is undefined

    const handleCopy = () => {
      if (address) {
        navigator.clipboard.writeText(address);
        setCopyNotification(true);
        setTimeout(() => setCopyNotification(false), 2000);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span className="whitespace-nowrap">{truncatedAddress}</span>
        <FiCopy
          onClick={handleCopy}
          style={{ color: 'lime', cursor: 'pointer', fontSize: '0.8rem' }}
        />
        {copyNotification && <span className="text-green-500 ml-2">Address copied!</span>}
      </div>
    );
  };


  const topHolders = holders && holders.length > 0 ? holders.slice(0, 10) : [];
  const topLpHolders = lp_holders && lp_holders.length > 0 ? lp_holders.slice(0, 10) : [];

  return (
    <div className="dashboard-container bg-gray-900 text-white p-2 rounded-sm shadow-sm -mt-6">

        {/* Wrapper for Coin Info and Holder Count */}
        <div className="flex flex-wrap items-center gap-x-6 space-y-2 sm:space-y-0"> {/* Adjusted gap-x for horizontal space */}

          {/* Coin Info Section */}
          <div className="coin-info flex items-center space-x-1 w-2/3">
            <h2 className="coin-name text-[0.6rem] sm:text-[0.7rem] font-bold flex items-center space-x-1 whitespace-nowrap">
              <FaBitcoin className="text-cyan-500" />
              <span style={{ color: '#22c55e', fontSize: '0.65rem' }}>Name:</span>
              <span style={{ color: '#d1d5db', fontWeight: 'bold', fontSize: '0.65rem' }}>
                {token_name && token_name.split(' ').slice(0, 2).join(' ')} ({token_symbol})
              </span>
            </h2>
          </div>

          {/* Holder Count Section */}
          <div className="holder-count bg-gray-900 p-2 rounded-lg shadow-lg flex items-center justify-center w-1/4" style={{ maxWidth: '45%' }}>
            <span style={{ color: '#22c55e', fontSize: '0.8rem', marginRight: '0.5rem' }}>Holders:</span>
            <span style={{ color: '#d1d5db', fontSize: '0.9rem', fontWeight: '600' }}>{holder_count}</span>
          </div>

        </div>

        
      {/* Buy/Sell Tax Section */}
      <section className="tax-section flex justify-between text-center space-x-4 mt-4">

        {/* Total Supply */}
        <div className="total-supply bg-gray-800 p-2 rounded-sm shadow-md flex items-center justify-center space-x-1 flex-grow-0 flex-shrink-0" style={{ flexBasis: 'auto' }}>
          <span style={{ color: '#22c55e', fontSize: '0.7rem' }}>Total Supply:</span>
          <span className="ml-1" style={{ color: '#d1d5db', fontSize: '0.6rem', fontWeight: '600' }}>{formatNumber(total_supply)}</span>
        </div>        

        {/* Buy Tax */}
        <div className="buy-tax bg-gray-800 p-2 rounded-sm shadow-md flex items-center justify-center space-x-1 flex-grow-0 flex-shrink-0" style={{ flexBasis: 'auto' }}>
          <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>Buy Tax:</span>
          <span className="ml-1" style={{ color: '#d1d5db', fontSize: '0.8rem', fontWeight: '600' }}>{buy_tax * 100}%</span>
        </div>

        {/* Sell Tax */}
        <div className="sell-tax bg-gray-800 p-2 rounded-sm shadow-md flex items-center justify-center space-x-1 flex-grow-0 flex-shrink-0" style={{ flexBasis: 'auto' }}>
          <span style={{ color: '#22c55e', fontSize: '0.8rem' }}>Sell Tax:</span>
          <span className="ml-1" style={{ color: '#d1d5db', fontSize: '0.8rem', fontWeight: '600' }}>{sell_tax * 100}%</span>
        </div>

      </section>
     

      {/* Creator & Owner Section in a card */}
      <section className="flex space-x-8">
        {/*<div className="creator-owner bg-gray-800 p-2 rounded-lg shadow-md w-1/2">
          <div className="creator mb-4">
            <h3 className="text-xl flex items-center">
              <span className="text-lime-500">Creator:</span>
              <span className="whitespace-nowrap text-gray-400 ml-2" style={{ fontSize: '0.8rem', color: 'white'}}>
                <AddressDisplay address={creator_address} />
              </span>
            </h3>
            <p className="text-xs text-gray-400">Balance: {formatNumber(creator_balance)} ({creator_percent * 100}%)</p>
          </div>
          <div className="owner">
            <h3 className="text-xl flex items-center">
              <span className="text-lime-500">Owner:</span>
              <span className="whitespace-nowrap text-gray-400 ml-2" style={{ fontSize: '0.8rem', color: 'white' }}>
                <AddressDisplay address={owner_address} />
              </span>
            </h3>
            <p className="text-xs text-gray-400">Balance: {formatNumber(owner_balance)} ({owner_percent * 100}%)</p>
          </div>
        </div> */}

        <div className="flex flex-col space-y-4"> {/* Flexbox wrapper for vertical alignment */}
          {/* Liquidity Providers Section */}
          <div className="liquidity-providers bg-gray-800 p-2 rounded-lg shadow-md">
            <h4 className="text-lime-500 text-sm font-semibold mb-4">
              Liquidity Providers: <span style={{ fontWeight: 'bold', color: 'white', fontSize: '0.8rem' }}>{lp_holder_count} (${formatNumber(lp_holders.reduce((total, lpHolder) => total + parseFloat(lpHolder.value), 0))})</span>
            </h4>

            {/* Details of LP providers */}
            <ul className="mt-4">
              {topLpHolders.length > 0 ? (
                topLpHolders
                  .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
                  .slice(0, 2)
                  .map((lpHolder, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center gap-4 p-2 rounded-md text-xs hover:bg-gray-700"
                    >
                      <span className="flex items-center flex-[1_1_55%] min-w-0 pl-1 mr-2">
                        {lpHolder.is_contract && (
                          <FaCrown className="inline text-yellow-400 mr-2" />
                        )}
                        {/* Crown icon before the address */}
                        <AddressDisplay address={lpHolder.address} />
                      </span>
                      <span
                        className="flex-[1_1_40%] min-w-0 text-right"
                        style={{ color: 'pink', fontSize: '0.7rem' }}
                      >
                        {formatNumber(parseFloat(lpHolder.balance))} - $
                        {formatNumber(parseFloat(lpHolder.value))} -{" "}
                        {lpHolder.is_locked ? "Locked" : "Unlocked"}
                      </span>
                    </li>
                  ))
              ) : (
                <li>Not available</li>
              )}
            </ul>


            {/* Calculate total liquidity and percentage locked */}
            {(() => {
              const totalLiquidity = lp_holders.reduce((total, lpHolder) => total + parseFloat(lpHolder.value), 0);
              const lockedLiquidity = lp_holders
                .filter(lpHolder => lpHolder.is_locked)
                .reduce((total, lpHolder) => total + parseFloat(lpHolder.value), 0);

              if (lockedLiquidity === 0) {
                return (
                  <p
                    style={{
                      color: 'orange',
                      fontSize: '0.875rem', // Smaller font size
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    Note: Liquidity is unlocked, and this is risky.
                  </p>
                );
              } else {
                const lockedPercentage = ((lockedLiquidity / totalLiquidity) * 100).toFixed(1);
                return (
                  <p className="text-green-500 font-semibold">
                    {lockedPercentage}% of total liquidity is locked.
                  </p>
                );
              }
            })()}
          </div>

        </div>

      </section>

      {/* Listings Section in another card */}
      <div className="listings bg-gray-800 p-2 rounded-lg shadow-md w-full md:w-3/4"> {/* Make this responsive */}
        <h4 className="text-lime-500 text-sm font-semibold mb-4">
          {token_symbol} is currently trading on:
        </h4>
        {dex && dex.length > 0 ? (
          dex
            .filter((dexInfo) => parseFloat(dexInfo.liquidity) >= 1)
            .map((dexInfo, index) => (
              <p key={index} className="hover:text-cyan-400 transition-colors text-xs font-semibold">
                {dexInfo.name} with liquidity of ${formatNumber(parseFloat(dexInfo.liquidity))}
              </p>
            ))
        ) : (
          <p>Not available</p>
        )}
      </div>

      {/* Top Holders & Liquidity Providers */}
      <section className="holders-liquidity w-full">
        <div className="top-holders bg-gray-800 p-2 rounded-lg shadow-md">
          <h4 className="text-lime-500 text-xl font-semibold mb-4">Top Holders</h4>
          <p style={{ fontSize: '0.9rem' }}>
            These people hold{" "}
            {topHolders.reduce((total, holder) => total + holder.percent * 100, 0).toFixed(1)}% of
            the supply.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* First Sector: First 5 Results */}
            <div className="sector sm:w-1/2">
              <ul className="space-y-2">
                {topHolders.slice(0, 5).map((holder, index) => (
                  <li key={index} className="hover:bg-gray-700 p-2 rounded-md text-xs -ml-1 mr-18" style={{ fontSize: '0.6rem' }} >
                    <AddressDisplay address={holder.address} /> - {formatNumber(parseFloat(holder.balance))} ({(holder.percent * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
            {/* Second Sector: Next 5 Results */}
            <div className="sector sm:w-1/2">
              <ul className="space-y-2">
                {topHolders.slice(5, 10).map((holder, index) => (
                  <li key={index} className="hover:bg-gray-700 p-2 rounded-md text-xs -ml-18 mr-1" style={{ fontSize: '0.6rem' }} >
                    <AddressDisplay address={holder.address} /> - {formatNumber(parseFloat(holder.balance))} ({(holder.percent * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
            {/* Third Sector: Remaining Results (Hidden on Small Screens) */}
            <div className="sector hidden md:block md:w-1/3">
              <ul className="space-y-2">
                {topHolders.slice(10).map((holder, index) => (
                  <li key={index} className="hover:bg-gray-700 p-2 rounded-md text-xs">
                    <AddressDisplay address={holder.address} /> - {formatNumber(parseFloat(holder.balance))} ({(holder.percent * 100).toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Fallback if no holders are available */}
          {topHolders.length === 0 && <p className="mt-4 text-gray-400">Not available</p>}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
