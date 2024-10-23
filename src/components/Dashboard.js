import "./Dashboard.css";
import React from "react";
import { FaCrown } from "react-icons/fa"; // import the crown icon from react-icons

const Dashboard = ({ tokenData }) => {
  if (!tokenData) {
    return null; // render nothing if data is not available
  }

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
    holders,
    buy_tax,
    sell_tax,
    dex,
    lp_holder_count,
    lp_holders,
  } = tokenData;

  function formatNumber(number) {
    if (number >= 1e12) { // Check for trillions
      return (number / 1e12).toFixed(1) + "T"; // Trillions
    } else if (number >= 1e9) { // Check for billions
      return (number / 1e9).toFixed(1) + "B"; // Billions
    } else if (number >= 1e6) { // Check for millions
      return (number / 1e6).toFixed(1) + "M"; // Millions
    } else if (number >= 1e3) { // Check for thousands
      return (number / 1e3).toFixed(1) + "K"; // Thousands
    } else {
      return number.toFixed(1); // Return as-is for smaller numbers
    }
  }


  const topHolders = holders && holders.length > 0 ? holders.slice(0, 10) : [];
  const topLpHolders = lp_holders && lp_holders.length > 0 ? lp_holders.slice(0, 10) : [];

  return (
    <div className="dashboard">
      <div className="token-info">
        <h2>
          <i className="icon-coin"></i> {token_name}
        </h2>
        <p>
          <i className="icon-symbol"></i> Symbol: {token_symbol}
        </p>
        <p>Total Supply: {total_supply}</p>
      </div>

      <div className="creator-info">
        <h3>Creator</h3>
        <p>Address: {creator_address}</p>
        <p>Balance: {creator_balance}</p>
        <p>Holding: {creator_percent}%</p>
      </div>

      <div className="owner-info">
        <h3>Owner</h3>
        <p>Address: {owner_address}</p>
        <p>Balance: {owner_balance}</p>
        <p>Holding: {owner_percent}%</p>
      </div>

      <div className="tax-info">
        <h3>Tax Info</h3>
        <p>Buy Tax: {buy_tax}%</p>
        <p>Sell Tax: {sell_tax}%</p>
      </div>

      <div className="holders-info">
        <h3>Top Holders</h3>
        <p>Total Holders: {holder_count}</p>
        <p>
          These people are holding{" "}
          {topHolders.length > 0
            ? topHolders
                .reduce((total, holder) => total + holder.percent * 100, 0)
                .toFixed(1)
            : 0}
          % of the token total supply
        </p>
        <p>See the biggest holders wallet below</p>
        <ul>
          {topHolders.length > 0 ? (
            topHolders.map((holder, index) => (
              <li key={index}>
                {holder.address} - {formatNumber(parseFloat(holder.balance))} (
                {(holder.percent * 100).toFixed(1)}%)
              </li>
            ))
          ) : (
            <li>Not available</li>
          )}
        </ul>
      </div>

      <div className="lp-info">
        <p>Total Liquidity Providers: {lp_holder_count}</p>
        <ul>
          {topLpHolders.length > 0 ? (
            topLpHolders
              .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance)) // sort based on value
              .map((lpHolder, index) => (
                <li key={index} className="lp-holder-item">
                  <span className="lp-holder-address">
                    {lpHolder.is_contract ? (
                      <>
                        {lpHolder.address} <FaCrown className="icon-king" style={{ marginLeft: '5px', display: 'inline-flex', alignItems: 'center' }} />
                      </>
                    ) : (
                      <>{lpHolder.address}</>
                    )}
                  </span>
                  <span className="lp-holder-info">
                    &nbsp;- Tokens: {formatNumber(parseFloat(lpHolder.balance))}
                    - Value in USD: ${formatNumber(parseFloat(lpHolder.value))}
                    - {(lpHolder.percent * 100).toFixed(1)}%
                    - {lpHolder.is_locked ? "Liquidity Locked" : "Liquidity Unlocked"}
                  </span>
                </li>
              ))
          ) : (
            <li>Not available</li>
          )}
        </ul>
      </div>

      <div className="dex-info">
        <h3>Where the coin is listed</h3>
        {dex && dex.length > 0 ? (
          dex.map((dexInfo, index) => (
            <p key={index}>
              {dexInfo.name}: {dexInfo.liquidity} put link
            </p>
          ))
        ) : (
          <p>Not available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
