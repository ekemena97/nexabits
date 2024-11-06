import React, { useEffect, useState } from 'react';
import './TonTrend.css';

const TonTrend = () => {
  const [baseIds, setBaseIds] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem('trendsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      initializeData(parsedData);
    }

    fetchBaseIds();
  }, []);

  const fetchBaseIds = async () => {
    try {
      const response = await fetch('https://api.ston.fi/export/cmc/v1');
      const data = await response.json();

      const ids = Object.values(data).map(item => item.base_id);
      setBaseIds(ids);

      const idChunks = chunkArray(ids, 100);
      let allTrendsData = [];

      for (const chunk of idChunks) {
        const formattedIds = { account_ids: chunk };
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

        const chunkData = await trendsResponse.json();
        allTrendsData = allTrendsData.concat(chunkData.jettons);
      }

      const uniqueJettons = filterUniqueJettons(allTrendsData);
      const sortedJettons = uniqueJettons
        .sort((a, b) => b.holders_count - a.holders_count)
        .slice(0, 60);

      initializeData(sortedJettons);

      localStorage.setItem('trendsData', JSON.stringify(sortedJettons));
    } catch (error) {
      console.error('Error fetching or posting data:', error);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const filterUniqueJettons = (jettons) => {
    const seenSymbols = new Map();
    return jettons
      .filter(jetton => !jetton.metadata.symbol.toLowerCase().includes('usd')) // Exclude symbols with "usd"
      .sort((a, b) => b.holders_count - a.holders_count) // Sort by holders count
      .filter(jetton => {
        const symbolLower = jetton.metadata.symbol.toLowerCase();
        if (seenSymbols.has(symbolLower)) {
          return false;
        } else {
          seenSymbols.set(symbolLower, true);
          return true;
        }
      });
  };


  const initializeData = (data) => {
    setTrendsData([data.slice(0, 20), data.slice(20, 40), data.slice(40, 60)]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBatch((prevBatch) => (prevBatch + 1) % 3);
    }, 20000); // Change interval to 20 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePreviousBatch = () => {
    setCurrentBatch((prevBatch) => (prevBatch === 0 ? 2 : prevBatch - 1));
  };

  const handleNextBatch = () => {
    setCurrentBatch((prevBatch) => (prevBatch + 1) % 3);
  };

  return (
    <div className="ton-trend-container">
      <h2>Top 60 Unique Jettons by Holders Count</h2>

      <div className="carousel">
        <button className="chevron left" onClick={handlePreviousBatch}>◀</button>

        <div className="carousel-content">
          {trendsData.length > 0 &&
            trendsData[currentBatch].map((jetton, index) => (
              <div key={jetton.metadata.address} className="jetton-item">
                <div className="jetton-info">
                  <span className="jetton-number">{index + 1 + currentBatch * 20}. </span>
                  <span className="jetton-symbol">{jetton.metadata.symbol}</span>
                </div>
                <img
                  src={jetton.metadata.image}
                  alt={jetton.metadata.name}
                  className="jetton-image"
                />
              </div>
            ))}
        </div>

        <button className="chevron right" onClick={handleNextBatch}>▶</button>
      </div>
    </div>
  );
};

export default TonTrend;
