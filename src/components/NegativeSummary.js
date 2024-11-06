import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const NegativeSummary = ({ tokenData }) => {
  if (!tokenData) return null; // No data, render nothing

  // Destructure the relevant fields from tokenData
  const {
    cannot_buy,
    is_open_source,
    owner_change_balance,
    transfer_pausable,
    is_honeypot,
    cannot_sell_all,
    trading_cooldown,
    is_anti_whale,
    anti_whale_modifiable,
    slippage_modifiable,
    is_blacklisted,
    is_whitelisted,
    personal_slippage_modifiable,
    selfdestruct,
    hidden_owner,
    external_call,
    can_take_back_ownership,
    is_proxy,
    is_mintable,
  } = tokenData;

  // Define summary texts and corresponding colors
  const summaries = {
    cannot_buy: {
      text: "This coin is often issued as rewards rather than through direct purchases. Restricting buying limits access to liquidity or prevents it entirely.",
      iconColor: "orange",
    },
    is_open_source: {
      text: "This coin’s lack of open-source transparency hides unknown mechanisms. Raising values introduces barriers to selling, blocking exit options.",
      iconColor: "red",
    },
    owner_change_balance: {
      text: "This coin allows owners to modify any holder’s balance, potentially zeroing it out. Raising values here leads to balance changes that stop holders from selling.",
      iconColor: "red",
    },
    transfer_pausable: {
      text: "The coin includes a transfer pause feature, allowing suspension of trading at any time. When activated or values are raised, holders are blocked from selling, impacting liquidity.",
      iconColor: "red",
    },
    is_honeypot: {
      text: "The coin includes honeypot-like restrictions, where selling is blocked by contract code. Raising limits on selling prevents holders from selling the coin, risking serious losses.",
      iconColor: "red",
    },
    cannot_sell_all: {
      text: "This coin prevents holders from selling all tokens in a single transaction. Raising values here stops any significant sales, impacting liquidity and flexibility.",
      iconColor: "red",
    },
    trading_cooldown: {
      text: "The coin includes a trading cooldown mechanism enforcing a minimum time between trades. When raised, holders are prevented from selling within restricted timeframes, limiting liquidity.",
      iconColor: "red",
    },
    is_anti_whale: {
      text: "This coin has an anti-whale feature limiting the maximum tokens an address can trade or hold. Reducing this limit stops holders from selling, impacting liquidity.",
      iconColor: "red",
    },
    anti_whale_modifiable: {
      text: "The coin has a modifiable anti-whale feature, allowing adjustments to maximum transaction amounts or holdings. Reducing these limits blocks holders from selling, creating serious risks.",
      iconColor: "red",
    },
    slippage_modifiable: {
      text: "The coin has a modifiable slippage feature, allowing adjustable buy/sell taxes that make trading costly or impractical. Raising values entirely blocks holders from selling, leaving them trapped.",
      iconColor: "red",
    },
    is_blacklisted: {
      text: "The coin includes a blacklist function that can prevent specified addresses from trading. Triggering this blocks any holder from selling, fully locking up their assets.",
      iconColor: "red",
    },
    is_whitelisted: {
      text: "The coin allows certain addresses to be whitelisted, granting early trading access or exemptions from taxes. Changing whitelist privileges restricts selling for non-whitelisted holders.",
      iconColor: "red",
    },
    personal_slippage_modifiable: {
      text: "The coin has an ability to modify personal slippage, allowing high taxes to be set for certain addresses and holders, potentially blocking them from trading.",
      iconColor: "red",
    },
    selfdestruct: {
      text: "This coin includes a selfdestruct feature, allowing the contract to be erased and assets rendered inaccessible. Triggering this prevents holders from selling or reclaiming assets.",
      iconColor: "red",
    },
    hidden_owner: {
      text: "This coin includes hidden ownership, allowing control even after renouncement. Raising values prevents holders from selling as desired.",
      iconColor: "orange",
    },
    external_call: {
      text: "This coin relies on external calls, depending on other contracts that introduce additional risks. Raising values restricts the ability to transact or sell freely.",
      iconColor: "orange",
    },
    can_take_back_ownership: {
      text: "This coin’s take-back-ownership feature allows control to be restored, enabling minting or tax increases. Reclaiming ownership and raising values blocks holders from selling.",
      iconColor: "orange",
    },
    is_proxy: {
      text: "This coin has a proxy feature, relying on external code that hides risks. Raising values restricts sell options, trapping holders.",
      iconColor: "orange",
    },
    is_mintable: {
      text: "The coin includes a mintable feature, allowing creation of new tokens that affect value. Minting floods the market and stops holders from selling the coin at a favorable rate.",
      iconColor: "orange",
    },
  };

  // Function to create a summary item
  const createSummaryItem = (summary) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
      <FaExclamationCircle color={summary.iconColor} style={{ fontSize: '1.5rem', marginRight: '0.6rem' }} />
      <span style={{ fontSize: '0.6rem', color: 'grey', textAlign: 'left', marginRight: '0.3rem' }}>{summary.text}</span>
    </div>
  );

  // Generate negative summaries based on conditions
  const generateNegativeSummary = () => {
    const negative_summary = [];

    // Add summaries based on conditions
    if (cannot_buy === "1") {
      negative_summary.push(createSummaryItem(summaries.cannot_buy));
    }
    if (is_open_source === "0") {
      negative_summary.push(createSummaryItem(summaries.is_open_source));
    }
    if (owner_change_balance === "1") {
      negative_summary.push(createSummaryItem(summaries.owner_change_balance));
    }

    // Check other fields
    const negativeFields = [
      'transfer_pausable',
      'is_honeypot',
      'cannot_sell_all',
      'trading_cooldown',
      'is_anti_whale',
      'anti_whale_modifiable',
      'slippage_modifiable',
      'is_blacklisted',
      'is_whitelisted',
      'personal_slippage_modifiable',
      'selfdestruct',
      'hidden_owner',
      'external_call',
      'can_take_back_ownership',
      'is_proxy',
      'is_mintable',
    ];

    // Add summaries for each field
    negativeFields.forEach((field) => {
      if (tokenData[field] === "1") {
        negative_summary.push(createSummaryItem(summaries[field]));
      }
    });

    return negative_summary;
  };

  return (
    <div>
      {generateNegativeSummary()}
    </div>
  );
};

export default NegativeSummary;
