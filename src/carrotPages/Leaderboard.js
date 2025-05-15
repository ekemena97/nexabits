import React, { useContext, useEffect, useState } from 'react';
import { LeaderboardContext } from '../context/LeaderboardContext.js';
import './Leaderboard.css';
import gold from '../assets/gold.png';
import silver from '../assets/silver.png';
import bronze from '../assets/bronze.png';

const Leaderboard = () => {
  const { leaderboardReferralUsers, leaderboardContentCreatorUsers } = useContext(LeaderboardContext);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Sort referral users by referrals
  const sortedReferralUsers = [...leaderboardReferralUsers].sort((a, b) => b.referrals - a.referrals);

  // Sort content creator users by points
  const sortedContentCreatorUsers = [...leaderboardContentCreatorUsers].sort((a, b) => b.points - a.points);

  useEffect(() => {
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
    if (!showDetails) {
      document.body.style.overflow = 'hidden'; // Disable background scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable background scrolling
    }
  };

  useEffect(() => {
    // Cleanup function to reset body overflow when the component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="leaderboard font-inter"
    >
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <div className="contest-announcement">
        <h2>Join the Ultimate Contest and Claim Your Share of $40,000 ! 🎉</h2>
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
              {sortedReferralUsers.map((user, index) => (
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
              {sortedContentCreatorUsers.map((user, index) => (
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
              We're excited to announce two incredible contests with a total prize pool of $40,000 in NeXAI token! Each contest has a prize pool of $20,000, and everyone is welcome to participate in both contests to maximize their earnings.
            </p>
            <h3>🔥 The Stakes Are High, and the Rewards Are Even Higher! 🔥</h3>
            <ul>
              <li>🥇 <strong>1st Place:</strong> Win up to $6,000 !</li>
              <li>🥈 <strong>2nd Place:</strong> Earn up to $5,000 !</li>
              <li>🥉 <strong>3rd Place:</strong> Take home up to $3,000 !</li>
            </ul>
            <p>
              In addition to the top three prizes, participants who place between 4th and 10th will share $5,000, those between 11th and 20th will share $4,000, and those between 21st and 30th will share $3,500.
            </p>
            <h3>🔥 Content Challenge Scoring Guide 🔥</h3>
            <p>Your content is scored on a scale of 0 to 100 based on the following engagement metrics:</p>
            <ul>
              <li><strong>Views (10%)</strong>: The number of times your content is watched.</li>
              <li><strong>Likes (30%)</strong>: The number of likes significantly boosts your score.</li>
              <li><strong>Shares (35%)</strong>: Shares have the highest impact on your score.</li>
              <li><strong>Comments (25%)</strong>: Comments reflect deeper engagement. Spam or unrelated comments will reduce your score through a penalty applied by the Comment Quality Factor (CQF).</li>
              <li><strong>Follower Factor</strong>: Your score is balanced according to your follower count to ensure fairness.</li>
            </ul>
            <p><strong>Formula to Calculate Final Score</strong>:</p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{`
Raw Score = (Views / Followers * 10) + (Likes / Followers * 30) + (Shares / Followers * 35) + (Comments / Followers * 25 * CQF)

Adjusted Score = Raw Score * Follower Factor

Final Score = min((Adjusted Score / Max Raw Score) * 100, 100)
            `}</pre>
            <p>Scores are updated every 12 hours to reflect the latest engagement metrics. Each content submission can take up to 24 hours to be evaluated by our team of judges. Submit your content link for evaluation within each scoring period to ensure your score is up to date.</p>
            <h3>🔥 Referral Challenge Details 🔥</h3>
            <p>
              The rules for the Referral Challenge are simple: the referral should have earned at least 10,000 points on the NexaBit App (t.me/Nexabit_Tap_Bot/start).
            </p>
            <h3>🎁 Special Surprise Bonus 🎁</h3>
            <p>
              We’re also giving away $1,000, distributed randomly to 10 amazing participants who referred at least 10 users or other affiliates. This is our way of thanking those who go above and beyond!
            </p>
            <h4>🗓 Contest Dates: 30th August 2024 - 30th September 2024</h4>
            <p>
              Both contests run simultaneously, giving you the opportunity to earn from both! Don't miss your chance to participate and win big. Remember, the more you engage, the more you can earn!
            </p>
            <p>
              Please note that citizens of the US, Lebanon, Iraq, Sudan, Syria, North Korea, Afghanistan, Myanmar, and Barbados are not eligible to participate in the contest.
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
