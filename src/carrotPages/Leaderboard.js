import React, { useEffect, useState } from 'react';
import './Leaderboard.css';
import data from '../assets/data.json';
import gold from '../assets/gold.png';
import silver from '../assets/silver.png';
import bronze from '../assets/bronze.png';

const Leaderboard = () => {
  const [referralUsers, setReferralUsers] = useState([]);
  const [contentCreatorUsers, setContentCreatorUsers] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const sortedReferralUsers = data.referralContest.sort((a, b) => b.referrals - a.referrals);
    const sortedContentCreatorUsers = data.contentCreatorContest.sort((a, b) => b.points - a.points);

    setReferralUsers(sortedReferralUsers);
    setContentCreatorUsers(sortedContentCreatorUsers);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getPosition = (index) => {
    if (index === 0) return <img src={gold} alt="Gold" className="medal" />;
    if (index === 1) return <img src={silver} alt="Silver" className="medal" />;
    if (index === 2) return <img src={bronze} alt="Bronze" className="medal" />;
    return index + 1;
  };

  const calculateReward = (position) => {
    if (position === 1) return 3000;
    if (position === 2) return 2500;
    if (position === 3) return 1500;

    const calculateTrancheRewards = (totalAmount, numParticipants) => {
      let rewards = [];
      let currentReward = totalAmount / numParticipants;

      for (let i = 0; i < numParticipants; i++) {
        rewards.push(currentReward);
        currentReward *= 0.9; // Decrease by 10% for the next person
      }

      // Adjust the rewards to ensure the total amount is distributed correctly
      const totalDistributed = rewards.reduce((sum, reward) => sum + reward, 0);
      const adjustmentFactor = totalAmount / totalDistributed;
      rewards = rewards.map(reward => reward * adjustmentFactor);

      return rewards;
    };

    if (position >= 4 && position <= 10) {
      const rewards = calculateTrancheRewards(5000, 7);
      return rewards[position - 4];
    }

    if (position >= 11 && position <= 20) {
      const rewards = calculateTrancheRewards(4000, 10);
      return rewards[position - 11];
    }

    if (position >= 21 && position <= 30) {
      const rewards = calculateTrancheRewards(3500, 10);
      return rewards[position - 21];
    }

    return 0;
  };

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="leaderboard">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="contest-announcement">
        <h2>Join the Ultimate Contest and Claim Your Share of $40,000 in USDC! 🎉</h2>
        <button className="details-button" onClick={handleShowDetails}>
          📜 Click To Read Event Details
        </button>
      </div>
      <div className="leaderboard-container">
        <div className="category">
          <h3>Category 1: Referral Challenge</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>FirstName</th>
                <th>Referrals</th>
                <th>Reward (USD)</th>
              </tr>
            </thead>
            <tbody>
              {referralUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{getPosition(index)}</td>
                  <td>{user.firstname}</td>
                  <td>{user.referrals}</td>
                  <td>{calculateReward(index + 1).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="category">
          <h3>Category 2: Content Challenge</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>FirstName</th>
                <th>Points</th>
                <th>Reward (USD)</th>
              </tr>
            </thead>
            <tbody>
              {contentCreatorUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{getPosition(index)}</td>
                  <td>{user.firstname}</td>
                  <td>{user.points}</td>
                  <td>{calculateReward(index + 1).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-close-icon" onClick={handleShowDetails}>✖</div>
            <h2>🎉 Two Contests, One Huge Opportunity! 🎉</h2>
            <p>
              We're excited to announce two incredible contests with a total prize pool of $40,000 in USDC! Each contest has a prize pool of $20,000, and everyone is welcome to participate in both contests to maximize their earnings.
            </p>
            <h3>🔥 The Stakes Are High, and the Rewards Are Even Higher! 🔥</h3>
            <ul>
              <li>🥇 <strong>1st Place:</strong> Win up to $6,000 in USDC!</li>
              <li>🥈 <strong>2nd Place:</strong> Earn up to $5,000 in USDC!</li>
              <li>🥉 <strong>3rd Place:</strong> Take home up to $3,000 in USDC!</li>
            </ul>
            <p>
              In addition to the top three prizes, participants who place between 4th and 10th will share $5,000, those between 11th and 20th will share $4,000, and those between 21st and 30th will share $3,500.
            </p>
            <h3>🔥 Content Challenge Details 🔥</h3>
            <p>
              The Content Challenge requires participants to create original content, post it on social media, and share the link with your followers, encouraging them to like, comment, and share with others. You can post on your favorite social media platforms such as YouTube, Twitter (X), TikTok, Facebook, and Instagram. On YouTube and TikTok, we check the number of views; on Twitter, Facebook, Instagram, or other platforms, we check the number of likes, retweets, and shares.
            </p>
            <p>
              The content topics for the challenge include:
            </p>
            <ul>
              <li>1. How to sign up on Telegram</li>
              <li>2. How to protect your privacy on Telegram (Stop unknown users from adding you to groups without your consent)</li>
              <li>3. How to search for your favorite mini app on Telegram</li>
              <li>4. How to navigate your way on the NexaBit mini app on Telegram</li>
              <li>5. The role of AI in financial market analysis</li>
              <li>6. How AI is making life easy recently (OpenAI and co)</li>
              <li>7. How to analyze the crypto market using the NexaBit AI</li>
              <li>8. How to read your favorite news updates and get airdrop news on NexaBit</li>
              <li>9. How to earn keys on NexaBit</li>
              <li>10. How to claim daily points in order to get positioned for airdrops</li>
              <li>11. How to pin your favorite Telegram channel or bot to the top of your Telegram</li>
              <li>12. How to maximize your points on NexaBit</li>
              <li>13. What is market analysis (Simple market indicators explained and fear/greed index)</li>
              <li>14. How to trace support and resistance</li>
              <li>15. What is dollar-cost averaging and how does it help a crypto trader</li>
              <li>16. How to set up buying levels and selling levels while trading</li>
              <li>17. How to set stop loss and take profit during trading</li>
              <li>18. What is Telegram mini app</li>
              <li>More topics are released every week.</li>
            </ul>
            <p>
              All links must be submitted every week via this <strong>[form]</strong>, and the leaderboard is updated on the first day of each week.
            </p>
            <h3>🔥 Referral Challenge Details 🔥</h3>
            <p>
              The rules for the Referral Challenge are simple: the referral should have earned at least 10,000 points on the NexaBit App (t.me/Nexabit_Tap_Bot/start).
            </p>
            <h3>🎁 Special Surprise Bonus 🎁</h3>
            <p>
              We’re also giving away $1,000 in USDC, distributed randomly to 10 amazing participants who referred at least 10 users or other affiliates. This is our way of thanking those who go above and beyond!
            </p>
            <h4>🗓 Contest Dates: 30th August 2024 - 30th September 2024</h4>
            <p>
              Both contests run simultaneously, giving you the opportunity to earn from both! Don't miss your chance to participate and win big. Remember, the more you engage, the more you can earn!
            </p>
            <p><strong>Join both contests today and let’s make history together!</strong></p>
            <button className="close-details-button" onClick={handleShowDetails}>Close Details</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
