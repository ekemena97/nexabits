// src/components/CryptoAnalysis.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  macd,
  rsi,
  obv,
  bollingerbands,
} from 'technicalindicators';

const calculateCVD = (prices, volumes) => {
  let cvd = [0];
  for (let i = 1; i < prices.length; i++) {
    const deltaVolume = prices[i] > prices[i - 1] ? volumes[i] : -volumes[i];
    cvd.push(cvd[cvd.length - 1] + deltaVolume);
  }
  return cvd;
};

const CryptoAnalysis = () => {
  const [coin, setCoin] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCoin(e.target.value);
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: '30',
          interval: 'daily',
        },
      });

      const data = response.data;
      const prices = data.prices.map((price) => price[1]);
      const volumes = data.total_volumes.map((volume) => volume[1]);

      // Calculate MACD
      const macdResult = macd({
        values: prices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });

      // Calculate RSI
      const rsiResult = rsi({
        values: prices,
        period: 14,
      });

      // Calculate OBV
      const obvResult = obv({
        close: prices,
        volume: volumes,
      });

      // Calculate Bollinger Bands
      const bbResult = bollingerbands({
        period: 20,
        values: prices,
        stdDev: 2,
      });

      // Calculate CVD
      const cvdResult = calculateCVD(prices, volumes);

      setAnalysis({
        macd: macdResult,
        rsi: rsiResult,
        obv: obvResult,
        bollingerBands: bbResult,
        cvd: cvdResult,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={coin}
        onChange={handleInputChange}
        placeholder="Enter crypto coin (e.g., bitcoin)"
      />
      <button onClick={fetchAnalysis}>Get Analysis</button>

      {loading && <p>Loading...</p>}

      {analysis && (
        <div>
          <p>🔔 Technical Analysis for {coin.toUpperCase()}</p>
          <p>📈 MACD: {JSON.stringify(analysis.macd[analysis.macd.length - 1])}</p>
          <p>📈 RSI: {analysis.rsi[analysis.rsi.length - 1]}</p>
          <p>📈 OBV: {analysis.obv[analysis.obv.length - 1]}</p>
          <p>📈 Bollinger Bands: {JSON.stringify(analysis.bollingerBands[analysis.bollingerBands.length - 1])}</p>
          <p>📈 CVD: {analysis.cvd[analysis.cvd.length - 1]}</p>
          <p>Disclaimer: Digital asset prices can be volatile. The value of your investment may go down or up and you may not get back the amount invested. Not financial advice. For more information, see our Terms of Use and Risk Warning.</p>
        </div>
      )}
    </div>
  );
};

export default CryptoAnalysis;
