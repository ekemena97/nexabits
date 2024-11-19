import React, { useEffect, useState } from 'react';
import './TonTrend.css';

// Import the SVG file as a React component
import { ReactComponent as TrendingIcon } from '../assets/trending.svg'; 

const TonTrend = () => {
  const [trendsData, setTrendsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem('trendsData');
    if (savedData) {
      setTrendsData(JSON.parse(savedData));
    } else {
      fetchBaseIds();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 5) % 60); // Rotate every 4 items
    }, 4000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const fetchBaseIds = async () => {
    try {
      const response = await fetch('https://api.ston.fi/export/cmc/v1');
      const data = await response.json();

      const ids = Object.values(data).map((item) => item.base_id);
      const formattedIds = { account_ids: ids.slice(0, 60) };

      const requestUrl = `${process.env.REACT_APP_API_URL}/trends`;
      const requestHeaders = {
        'Content-Type': 'application/json',
      };

      const trendsResponse = await fetch(requestUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(formattedIds, null, 2),
      });

      if (!trendsResponse.ok) {
        const errorText = await trendsResponse.text();
        throw new Error(`Failed to fetch trends data: ${trendsResponse.status} - ${errorText}`);
      }

      const trendsData = await trendsResponse.json();
      const uniqueJettons = filterUniqueJettons(trendsData.jettons);
      setTrendsData(uniqueJettons);
      localStorage.setItem('trendsData', JSON.stringify(uniqueJettons));
    } catch (error) {
      console.error('Error fetching or posting data:', error);
    }
  };

  const filterUniqueJettons = (jettons) => {
    const seenSymbols = new Map();
    return jettons
      .filter((jetton) => !jetton.metadata.symbol.toLowerCase().includes('usd')) // Exclude symbols with "usd"
      .sort((a, b) => b.holders_count - a.holders_count) // Sort by holders count
      .filter((jetton) => {
        const symbolLower = jetton.metadata.symbol.toLowerCase();
        if (seenSymbols.has(symbolLower)) {
          return false;
        } else {
          seenSymbols.set(symbolLower, true);
          return true;
        }
      });
  };

  const visibleItems = trendsData.slice(currentIndex, currentIndex + 5);

  return (
    <div className="ton-trend-container font-inter">
      <div className="trending-title">
        <TrendingIcon className="trending-icon" />
        <h2>Trending Coins Today</h2>
      </div>
      <div className="trending-boxes">
        {visibleItems.map((jetton, index) => (
          <div key={index} className="trending-item">
            <img
              src={jetton.metadata.image}
              alt={jetton.metadata.symbol}
              className="trending-image"
            />
            <div className="trending-number-symbol">
              <span className="trending-number">{currentIndex + index + 1}.</span>
              <span className="trending-symbol">{jetton.metadata.symbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TonTrend;
