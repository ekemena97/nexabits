import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  macd,
  rsi,
  obv,
  bollingerbands,
  sma,
  IchimokuCloud
} from 'technicalindicators';
import coinListData from '../assets/coinlist3.json';
import summaryVariations from '../assets/summaryVariations.json';
import technicalsVariations from '../assets/technicalsVariations.json';
import './CryptoAnalysis.css'; // Import the CSS file
import { news } from '../data/news.js'; // Import the news data
import { Link } from 'react-router-dom';
import { useThemeContext } from "../context/ThemeContext.js";

const calculateFibonacciLevels = (high, low) => {
  const diff = high - low;
  return {
    '0.0% (High)': high,
    '23.6%': high - diff * 0.236,
    '38.2%': high - diff * 0.382,
    '50.0%': high - diff * 0.5,
    '61.8%': high - diff * 0.618,
    '78.6%': high - diff * 0.786,
    '100.0% (Low)': low,
  };
};

const calculateIchimoku = (data) => {
  if (data.length < 52) {
    return null;
  }

  const ichimoku = IchimokuCloud.calculate({
    high: data.map(day => day.high),
    low: data.map(day => day.low),
    conversionPeriod: 9,
    basePeriod: 26,
    spanPeriod: 52,
    displacement: 26
  });

  if (ichimoku.length === 0) {
    return null;
  }

  const recentData = ichimoku[ichimoku.length - 1];

  if (!recentData) {
    return null;
  }

  return {
    'Tenkan-sen': recentData.conversion,
    'Kijun-sen': recentData.base,
    'Senkou Span A': recentData.spanA,
    'Senkou Span B': recentData.spanB
  };
};

const calculateCVD = (prices, volumes) => {
  let cvd = [0];
  for (let i = 1; i < prices.length; i++) {
    const deltaVolume = prices[i] > prices[i - 1] ? volumes[i] : -volumes[i];
    cvd.push(cvd[cvd.length - 1] + deltaVolume);
  }
  return cvd;
};

const getRandomElements = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const roundNumber = (num) => {
  if (num < 0.1) return num.toFixed(5);
  if (num < 1) return num.toFixed(4);
  return num.toFixed(2);
};

const CryptoAnalysis = ({ onFetchAnalysis }) => {
  const [coin, setCoin] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [coinSymbol, setCoinSymbol] = useState('');
  const [highestPrice, setHighestPrice] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);
  const [highestPrice60, setHighestPrice60] = useState(null);
  const [lowestPrice60, setLowestPrice60] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const { theme } = useThemeContext();
  const [message, setMessage] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  // Refs for input and button
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setCoinList(coinListData);
    setSelectedNews(getRandomElements(news, 4));
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Scroll to input and button when input is focused
  const handleFocus = () => {
    if (!inputFocused) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      buttonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setInputFocused(true);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setCoin(input);
    const matchedCoin = coinList.find(
      (c) => c.id === input || c.symbol === input || c.name.toLowerCase() === input
    );
    setCoinSymbol(matchedCoin ? matchedCoin.symbol : '');
  };

  const fetchBitcoinData = async () => {
    try {
      const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
        params: {
          fsym: 'BTC',
          tsym: 'USD',
          limit: 60
        }
      });
      if (response.data.Response === 'Error') {
        throw new Error(response.data.Message);
      }
      const data = response.data.Data.Data;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchAnalysis = async () => {
    if (!coinSymbol) {
      setMessage('Coins will come in the future. Check other coins');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');
    setInputFocused(false);

    try {
      const [sevenDayResponse, sixtyDayResponse, coinDataResponse, fearGreedResponse, btcDataResponse] = await Promise.all([
        axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
          params: {
            fsym: coinSymbol.toUpperCase(),
            tsym: 'USD',
            limit: 7
          }
        }),
        axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
          params: {
            fsym: coinSymbol.toUpperCase(),
            tsym: 'USD',
            limit: 60
          }
        }),
        axios.get(`https://min-api.cryptocompare.com/data/price`, {
          params: {
            fsym: coinSymbol.toUpperCase(),
            tsyms: 'USD'
          }
        }),
        axios.get('https://api.alternative.me/fng/'),
        fetchBitcoinData()
      ]);

      if (sevenDayResponse.data.Response === 'Error') {
        throw new Error(sevenDayResponse.data.Message);
      }

      if (sixtyDayResponse.data.Response === 'Error') {
        throw new Error(sixtyDayResponse.data.Message);
      }

      const sevenDayData = sevenDayResponse.data.Data.Data;
      const sixtyDayData = sixtyDayResponse.data.Data.Data;
      const coinData = coinDataResponse.data;
      const fearGreedData = fearGreedResponse.data.data[0];
      const btcData = btcDataResponse;

      if (!coinData) {
        throw new Error('Coin data not found');
      }

      let highest7 = -Infinity;
      let lowest7 = Infinity;

      sevenDayData.forEach(day => {
        if (day.high > highest7) highest7 = day.high;
        if (day.low < lowest7) lowest7 = day.low;
      });

      setHighestPrice(highest7);
      setLowestPrice(lowest7);

      let highest60 = -Infinity;
      let lowest60 = Infinity;

      sixtyDayData.forEach(day => {
        if (day.high > highest60) highest60 = day.high;
        if (day.low < lowest60) lowest60 = day.low;
      });

      setHighestPrice60(highest60);
      setLowestPrice60(lowest60);

      if (highest7 === -Infinity || lowest7 === Infinity) {
        throw new Error('Failed to fetch highest and lowest prices for 7 days');
      }

      if (highest60 === -Infinity || lowest60 === Infinity) {
        throw new Error('Failed to fetch highest and lowest prices for 60 days');
      }

      const prices = sixtyDayData.map((day) => day.close);
      const volumes = sixtyDayData.map((day) => day.volumefrom);

      const macdResult = macd({
        values: prices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });

      const rsiResult = rsi({
        values: prices,
        period: 14,
      });

      const obvResult = obv({
        close: prices,
        volume: volumes,
      });

      const bbResult = bollingerbands({
        period: 20,
        values: prices,
        stdDev: 2,
      });

      const cvdResult = calculateCVD(prices, volumes);

      const sma20 = sma({ period: 20, values: prices });
      const sma50 = sma({ period: 50, values: prices });

      const marketTrend = sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'SMA showing a potential for trend reversal' : 'SMA predicting a continuation of the current market trend';

      const currentPrice = coinData.USD || 0;

      const lastDayPrice = prices[prices.length - 1];
      const previousDayPrice = prices[prices.length - 2];
      const percentChange24h = ((lastDayPrice - previousDayPrice) / previousDayPrice) * 100;

      const percentChangeFromLow = ((currentPrice - lowest7) / lowest7) * 100;

      const priceMovementWording = percentChangeFromLow > 0 ? 'pump' : 'decrease';

      const percentDropFromHigh = ((highest7 - currentPrice) / highest7) * 100;

      const capitalFlowTrend = cvdResult[cvdResult.length - 1] - cvdResult[cvdResult.length - 8];
      const capitalFlowSentiment = capitalFlowTrend > 0 ? 'bullish' : 'bearish';

      const fibLevels7 = calculateFibonacciLevels(highest7, lowest7);
      const fibLevels60 = calculateFibonacciLevels(highest60, lowest60);

      const ichimoku60 = calculateIchimoku(sixtyDayData);
      const btcIchimoku = calculateIchimoku(btcData);

      const summaryTemplate = getRandomElements(summaryVariations, 1)[0];
      const technicalsTemplate = getRandomElements(technicalsVariations, 1)[0];

      const summary = eval('`' + summaryTemplate + '`');
      const technicals = eval('`' + technicalsTemplate + '`');

      const fibonacciLevels7 = `7-Day Fibonacci Levels:
        0% - ${roundNumber(fibLevels7['0.0% (High)'])}
        23.6% - ${roundNumber(fibLevels7['23.6%'])}
        38.2% - ${roundNumber(fibLevels7['38.2%'])}
        50% - ${roundNumber(fibLevels7['50.0%'])}
        61.8% - ${roundNumber(fibLevels7['61.8%'])}
        78.6% - ${roundNumber(fibLevels7['78.6%'])}
        100% - ${roundNumber(fibLevels7['100.0% (Low)'])}`;

      const fibonacciLevels60 = `60-Day Fibonacci Levels:
        0% - ${roundNumber(fibLevels60['0.0% (High)'])}
        23.6% - ${roundNumber(fibLevels60['23.6%'])}
        38.2% - ${roundNumber(fibLevels60['38.2%'])}
        50% - ${roundNumber(fibLevels60['50.0%'])}
        61.8% - ${roundNumber(fibLevels60['61.8%'])}
        78.6% - ${roundNumber(fibLevels60['78.6%'])}
        100% - ${roundNumber(fibLevels60['100.0% (Low)'])}`;

      const ichimokuLevels60 = ichimoku60
        ? `60-Day Ichimoku Levels:
        Tenkan-sen - ${roundNumber(ichimoku60['Tenkan-sen'])}
        Kijun-sen - ${roundNumber(ichimoku60['Kijun-sen'])}
        Senkou Span A - ${roundNumber(ichimoku60['Senkou Span A'])}
        Senkou Span B - ${roundNumber(ichimoku60['Senkou Span B'])}`
        : 'Not enough data for 60-Day Ichimoku Levels';

      const btcKijunSen = btcIchimoku ? btcIchimoku['Kijun-sen'] : 0;

      const fearGreedIndex = `Current Fear & Greed Index is ${fearGreedData.value_classification} (${fearGreedData.value}%)`;

      const allLevels = [
        ...Object.values(fibLevels7),
        ...Object.values(fibLevels60),
        ...(ichimoku60 ? Object.values(ichimoku60) : [])
      ];

      const buyLevels = allLevels.filter(level => level < currentPrice).sort((a, b) => b - a).slice(0, 5);
      const sellLevels = allLevels.filter(level => level > currentPrice).sort((a, b) => a - b).slice(0, 5);

      // Recommendation logic
      const btcPrice = btcData[btcData.length - 1].close;
      const btcPercentageDifference = Math.abs((btcPrice - btcKijunSen) / btcKijunSen);
      let recommendationText = '';

      console.log(`BTC Percentage Difference: ${btcPercentageDifference}`);
      console.log(`BTC Kijun-sen: ${btcKijunSen}`);
      console.log(`${coinSymbol} Kijun-sen: ${ichimoku60 ? ichimoku60['Kijun-sen'] : 'N/A'}`);
      console.log(`Current Price: ${currentPrice}`);
      console.log(`OBV Last Value: ${obvResult[obvResult.length - 1]}`);

      const condition1Met = btcPercentageDifference <= 0.015;
      const condition2Met = ichimoku60 && ichimoku60['Kijun-sen'] >= currentPrice;
      const condition3Met = obvResult[obvResult.length - 1] > 0;

      console.log(`Condition 1 Met: ${condition1Met}`);
      console.log(`Condition 2 Met: ${condition2Met}`);
      console.log(`Condition 3 Met: ${condition3Met}`);

      let additionalText = '';

      if (!condition1Met) {
        additionalText += ` The current uncertainty in Bitcoin's price movement could affect other 
        altcoins negatively.`;
      }
      if (!condition2Met) {
        additionalText += ` The above price movement is also not supported by sufficient volume.`;
      }
      if (!condition3Met) {
        additionalText += ` Furthermore, Ichimoku indicates a downwards movement that is likely to occur soon. 
        It is advisable to wait for more stability and clearer signals before making a purchase.`;
      }

      if (condition1Met && condition2Met && condition3Met) {
        recommendationText = `Target Level 1 or 2. Be sure to set your sell order at the specified Sell levels below`;
        console.log('Condition met for Buy');
      } else if (condition1Met && (condition2Met || condition3Met)) {
        recommendationText = `Expect a minor pull back. Target Level 2 or 3. You can use DCA and be sure to set your
         sell order as specified below`;
        console.log('Condition met for Cautiously Buy');
      } else {
        recommendationText = `Major downtrend soonest. Target level 3 to 5. Be sure to put a stoploss e.g If you bought at level 3, 
        stoploss will be at level 4.`;
        console.log('Condition met for Wait Before You Buy');
      }

      const recommendationRationale = {
        'Recommendation: Buy at level 1 to 2': `
        Technical analysis below indicates that ${coin.toUpperCase()} is ready for the next leg up. Look to buy at buy level 1 or 2.`,
        'Recommendation: Buy at lower levels e.g level 2 to 3': `The MACD and other indicators below shows bullish momentum for ${coin.toUpperCase()}, but a good 
        distributed volume is crucial for further movements. Buy at level 2 to 4 using DCA.`,
        'Recommendation: Buy at the lowest level e.g level 3 to 5.': `Technically, ${coin.toUpperCase()} looks a bit OK, but the it is yet to have a clear direction
         and the volume is a bit manipulated as seen on the OBV data below. Buy levels are from level 3 to 5, also set stoploss e.g if 
         you buy at level 3, set stoploss at level 4 and so on.`,
      };

      setAnalysis({
        priceChange24h: percentChange24h.toFixed(2),
        summary,
        technicals,
        fibonacciLevels7,
        fibonacciLevels60,
        ichimokuLevels60,
        news: selectedNews,
        fearGreedIndex,
        buyLevels,
        sellLevels,
        currentPrice,
        recommendationText,
        recommendationRationale: recommendationRationale[recommendationText],
      });

      // Notify the parent component to hide the introduction
      onFetchAnalysis();
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="analysis-main-container">
      <div className={`crypto-analysis ${
          theme === "dark"
            ? "bg-[#19191E] text-[#fff]"
            : "bg-[#fff] text-[#19191E]"
        }`}
      >
        {message && <p className="message">{message}</p>} {/* Conditionally render the message */}
        <input 
          type="text" 
          value={coin} 
          onChange={handleInputChange} 
          onFocus={handleFocus} // Add onFocus event
          placeholder="Enter crypto coin (e.g., bitcoin or btc)" 
          className="crypto-input scroll-margin"
          ref={inputRef} // Attach ref to the input
        />
        <button 
          onClick={() => {
            fetchAnalysis();
            setInputFocused(false); // Reset the input focus state when button is clicked
          }}
          className="crypto-button scroll-margin"
          ref={buttonRef} // Attach ref to the button
        >
          Get Analysis
        </button>

        {loading && <p>Loading...</p>}

        {error && <p>Error: {error}</p>}

        {analysis && (
          <div className="analysis-results">
            <p>{analysis.summary}</p> 
            <p>✨ {analysis.fearGreedIndex}</p> <br />
            
            {/*<p><strong>Recommendation: </strong>{analysis.recommendationText}</p>*/}
            
            <table className="levels-table">
              <thead>
                <tr>
                  <th>Buy Levels</th>
                  <th>Sell Levels</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {analysis.buyLevels.map((level, index) => (
                      <div key={index}>{index + 1}. {roundNumber(level)}</div>
                    ))}
                  </td>
                  <td>
                    {analysis.sellLevels.map((level, index) => (
                      <div key={index}>{index + 1}. {roundNumber(level)}</div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <p><br />📊 <strong>Technicals:</strong> {analysis.technicals}</p>
            
            <p className="news-header"><br />📰 <strong>News:</strong></p>
            {analysis.news.map((item, index) => (
              <p key={index} className="news-item">
                📢 <Link to={`/blog/${item.id}`} className="crypto-news-title">{item.title}</Link>
              </p>
            ))}
            <p className="disclaimer">
              Disclaimer: Always conduct your own research and consider your risk tolerance before making investment decisions. Cryptocurrency markets are highly volatile, and it is crucial to stay informed and make well-considered choices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoAnalysis;
