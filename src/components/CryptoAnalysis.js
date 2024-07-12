import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  macd,
  rsi,
  obv,
  bollingerbands,
  sma,
  IchimokuCloud
} from 'technicalindicators';
import coinListData from '../assets/coinlist3.json'; // Adjust the path as necessary

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
    // Ichimoku requires at least 52 data points
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

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const roundNumber = (num) => {
  if (num < 0.1) return num.toFixed(5);
  if (num < 1) return num.toFixed(4);
  return num.toFixed(2);
};

const CryptoAnalysis = () => {
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

  useEffect(() => {
    // Load the coin list from the local JSON file
    setCoinList(coinListData);
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setCoin(input);
    const matchedCoin = coinList.find(
      (c) => c.id === input || c.symbol === input || c.name.toLowerCase() === input
    );
    setCoinSymbol(matchedCoin ? matchedCoin.symbol : '');
  };

  const fetchHighestAndLowestPrice = async (period) => {
    try {
      const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
        params: {
          fsym: coinSymbol.toUpperCase(),
          tsym: 'USD',
          limit: period
        }
      });
      console.log(response.data); // Log the response data
      if (response.data.Response === 'Error') {
        throw new Error(response.data.Message);
      }
      const data = response.data.Data.Data;

      // Extract the highest and lowest prices over the specified period
      let highest = -Infinity;
      let lowest = Infinity;
      
      data.forEach(day => {
        if (day.high > highest) highest = day.high;
        if (day.low < lowest) lowest = day.low;
      });

      return { highest, lowest, data };
    } catch (err) {
      setError(err.message);
      throw err; // Ensure the error is thrown to be caught in the fetchAnalysis function
    }
  };

  const fetchAnalysis = async () => {
    if (!coinSymbol) {
      alert('Please enter a valid coin name or symbol.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [sevenDayResponse, sixtyDayResponse, coinDataResponse, fearGreedResponse] = await Promise.all([
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
        axios.get('https://api.alternative.me/fng/')
      ]);

      console.log(sevenDayResponse.data); // Log the response data
      console.log(sixtyDayResponse.data); // Log the response data
      console.log(coinDataResponse.data); // Log the response data
      console.log(fearGreedResponse.data); // Log the response data

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

      if (!coinData) {
        throw new Error('Coin data not found');
      }

      // Extract the highest and lowest prices over the 7-day period
      let highest7 = -Infinity;
      let lowest7 = Infinity;
      
      sevenDayData.forEach(day => {
        if (day.high > highest7) highest7 = day.high;
        if (day.low < lowest7) lowest7 = day.low;
      });

      setHighestPrice(highest7);
      setLowestPrice(lowest7);

      // Extract the highest and lowest prices over the 60-day period
      let highest60 = -Infinity;
      let lowest60 = Infinity;

      sixtyDayData.forEach(day => {
        if (day.high > highest60) highest60 = day.high;
        if (day.low < lowest60) lowest60 = day.low;
      });

      setHighestPrice60(highest60);
      setLowestPrice60(lowest60);

      // Ensure highestPrice and lowestPrice are set before proceeding
      if (highest7 === -Infinity || lowest7 === Infinity) {
        throw new Error('Failed to fetch highest and lowest prices for 7 days');
      }

      if (highest60 === -Infinity || lowest60 === Infinity) {
        throw new Error('Failed to fetch highest and lowest prices for 60 days');
      }

      const prices = sixtyDayData.map((day) => day.close);
      const volumes = sixtyDayData.map((day) => day.volumefrom);

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

      // Calculate SMA
      const sma20 = sma({ period: 20, values: prices });
      const sma50 = sma({ period: 50, values: prices });

      // Determine market trend based on SMA
      const marketTrend = sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'SMA showing a potential for trend reversal' : 'SMA predicting a continuation of the current market trend';

      // Get current price and changes
      const currentPrice = coinData.USD || 0;

      // Calculate percentage change over the past 24 hours
      const lastDayPrice = prices[prices.length - 1];
      const previousDayPrice = prices[prices.length - 2];
      const percentChange24h = ((lastDayPrice - previousDayPrice) / previousDayPrice) * 100;

      // Calculate percentage change from the weekly lowest price
      const percentChangeFromLow = ((currentPrice - lowest7) / lowest7) * 100;

      // Determine wording for pump or decrease
      const priceMovementWording = percentChangeFromLow > 0 ? 'pump' : 'decrease';

      // Calculate percentage drop from the 7-day high
      const percentDropFromHigh = ((highest7 - currentPrice) / highest7) * 100;

      // Determine capital flow trend
      const capitalFlowTrend = cvdResult[cvdResult.length - 1] - cvdResult[cvdResult.length - 8];
      const capitalFlowSentiment = capitalFlowTrend > 0 ? 'bullish' : 'bearish';

      // Calculate Fibonacci levels
      const fibLevels7 = calculateFibonacciLevels(highest7, lowest7);
      const fibLevels60 = calculateFibonacciLevels(highest60, lowest60);

      // Calculate Ichimoku levels
      const ichimoku60 = calculateIchimoku(sixtyDayData);

      const summaryVariations = [
        `${coin.toUpperCase()} has seen its price ${percentChange24h > 0 ? 'rise' : 'fall'} by ${percentChange24h.toFixed(2)}% over the past 24 hours, currently sitting at $${roundNumber(
          currentPrice
        )}. This follows a ${roundNumber(percentChangeFromLow)}% ${priceMovementWording} from its 7-day low of $${roundNumber(
          lowest7
        )}. Despite the price ${
          percentChange24h > 0 ? 'uptrend' : 'downtrend'
        }, there has been a significant ${capitalFlowTrend > 0 ? 'increase' : 'decrease'} in capital flow into ${
          coin.toUpperCase()
        }, suggesting a ${capitalFlowSentiment} sentiment in the market.`,
        `Over the last 24 hours, ${coin.toUpperCase()} has seen its price ${
          percentChange24h > 0 ? 'rise' : 'fall'
        } by ${percentChange24h.toFixed(2)}%, with the current price at $${roundNumber(
          currentPrice
        )}. This follows a ${roundNumber(percentChangeFromLow)}% ${priceMovementWording} from its 7-day low of $${roundNumber(
          lowest7
        )}. In addition to this ${
          percentChange24h > 0 ? 'positive' : 'negative'
        } price movement, the capital flow into ${coin.toUpperCase()} has ${
          capitalFlowTrend > 0 ? 'risen' : 'dropped'
        }, indicating a ${capitalFlowSentiment} market sentiment.`,
        `In the past 24 hours, ${coin.toUpperCase()}'s price has ${
          percentChange24h > 0 ? 'climbed' : 'declined'
        } by ${percentChange24h.toFixed(2)}%, now standing at $${roundNumber(
          currentPrice
        )}. This follows a ${roundNumber(percentChangeFromLow)}% ${priceMovementWording} from its 7-day low of $${roundNumber(
          lowest7
        )}. Moreover, the capital flow into ${coin.toUpperCase()} has shown a ${
          capitalFlowTrend > 0 ? 'notable increase' : 'significant decrease'
        }, pointing to a ${capitalFlowSentiment} sentiment among investors.`,
        `Over the past 24 hours, ${coin.toUpperCase()} has ${
          percentChange24h > 0 ? 'gained' : 'lost'
        } ${percentChange24h.toFixed(2)}% in value, currently priced at $${roundNumber(
          currentPrice
        )}. This follows a ${
          roundNumber(percentChangeFromLow)
        }% ${priceMovementWording} from its 7-day low of $${roundNumber(lowest7)}. Capital flow into ${
          coin.toUpperCase()
        } has ${capitalFlowTrend > 0 ? 'increased' : 'decreased'}, signaling a ${capitalFlowSentiment} sentiment in the market.`,
        `The value of ${coin.toUpperCase()} has ${
          percentChange24h > 0 ? 'grown' : 'shrunk'
        } by ${percentChange24h.toFixed(2)}% over the last 24 hours, with the current price at $${roundNumber(
          currentPrice
        )}. Following a ${roundNumber(percentChangeFromLow)}% ${priceMovementWording} from its 7-day low of $${roundNumber(
          lowest7
        )}, there has been a ${capitalFlowTrend > 0 ? 'notable increase' : 'significant decrease'} in capital flow into ${
          coin.toUpperCase()
        }, suggesting a ${capitalFlowSentiment} sentiment among investors.`,
        `In the past 24 hours, ${coin.toUpperCase()} has seen its price ${
          percentChange24h > 0 ? 'appreciate' : 'depreciate'
        } by ${percentChange24h.toFixed(2)}%, now standing at $${roundNumber(
          currentPrice
        )}. This follows a ${roundNumber(percentChangeFromLow)}% ${priceMovementWording} from its 7-day low of $${roundNumber(
          lowest7
        )}. The capital flow into ${coin.toUpperCase()} has ${
          capitalFlowTrend > 0 ? 'risen' : 'fallen'
        }, indicating a ${capitalFlowSentiment} sentiment in the market.`,
        // Add 24 more variations...
      ];

      // Technicals variations
      const technicalsVariations = [
        `The MACD indicates a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'cautiously optimistic' : 'bearish'
        } outlook with a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'recent bullish crossover' : 'recent bearish crossover'
        }, while the RSI suggests ${
          rsiResult[rsiResult.length - 1] > 50 ? 'bullish sentiment' : 'bearish sentiment'
        } with the ${marketTrend}. The OBV shows ${
          obvResult[obvResult.length - 1] > 0 ? 'sustained buying pressure' : 'sustained selling pressure'
        }, and the ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'contracting' : 'expanding'
        } Bollinger Bands point to ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'decreased volatility and potential oversold conditions.' : 'increased volatility and overbought condition.'
        }.`,
        `MACD analysis points to a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'positive' : 'negative'
        } trend, featuring a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'bullish crossover' : 'bearish crossover'
        }. RSI values indicate a ${
          rsiResult[rsiResult.length - 1] > 50 ? 'bullish' : 'bearish'
        } market sentiment, with the ${marketTrend}. OBV data shows ${
          obvResult[obvResult.length - 1] > 0 ? 'buying pressure' : 'selling pressure'
        }, and the ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'narrowing' : 'widening'
        } Bollinger Bands suggest ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'lower volatility and potential oversold conditions.' : 'higher volatility and overbought condition.'
        }.`,
        `The latest MACD readings hint at a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'cautiously optimistic' : 'bearish'
        } sentiment, evidenced by a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'bullish crossover' : 'bearish crossover'
        }. Meanwhile, the RSI suggests ${
          rsiResult[rsiResult.length - 1] > 50 ? 'positive' : 'negative'
        } sentiment, with the ${marketTrend}. The OBV data reflects ${
          obvResult[obvResult.length - 1] > 0 ? 'ongoing buying pressure' : 'ongoing selling pressure'
        }, and ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'contracting' : 'expanding'
        } Bollinger Bands point to ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'decreased volatility and a confirmed oversold conditions' : 'increased volatility and a confirmed overbought condition.'
        }.`,
        `MACD readings indicate a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'bullish' : 'bearish'
        } sentiment, with a ${
          macdResult[macdResult.length - 1]?.histogram > 0 ? 'recent bullish crossover' : 'recent bearish crossover'
        }. RSI values suggest ${
          rsiResult[rsiResult.length - 1] > 50 ? 'positive' : 'negative'
        } sentiment with the ${marketTrend}. OBV data shows ${
          obvResult[obvResult.length - 1] > 0 ? 'sustained buying pressure' : 'sustained selling pressure'
        }, and ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'contracting' : 'expanding'
        } Bollinger Bands indicate ${
          bbResult[bbResult.length - 1]?.pb < 0 ? 'reduced volatility and a confirmed oversold conditions.' : 'increased volatility and a confirmed overbought condition.'
        }.`,
        // Add 26 more variations...
      ];

      const summary = getRandomElement(summaryVariations);
      const technicals = getRandomElement(technicalsVariations);

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

      const news = [
        'Hong Kong Virtual Asset ETFs Record Trading Volume',
        'Over 30% Of Bitcoin Supply Remains Unmoved In Wallets',
        'Ethereum ETP Could Be More Successful Than Anticipated',
      ];

      const fearGreedIndex = `Current Fear & Greed Index: ${fearGreedData.value} (${fearGreedData.value_classification})`;

      setAnalysis({
        priceChange24h: percentChange24h.toFixed(2),
        summary,
        technicals,
        fibonacciLevels7,
        fibonacciLevels60,
        ichimokuLevels60,
        news,
        fearGreedIndex,
      });
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="crypto-analysis">
      <input 
        type="text" 
        value={coin} 
        onChange={handleInputChange} 
        placeholder="Enter crypto coin (e.g., bitcoin)" 
        className="crypto-input"
      />
      <button onClick={fetchAnalysis} className="crypto-button">
        Get Analysis
      </button>

      {loading && <p>Loading...</p>}

      {error && <p>Error: {error}</p>}

      {analysis && (
        <div className="analysis-results">
          <p>🔔  {analysis.summary}</p>
          <p>📈 Technicals: {analysis.technicals}</p>
          <p>🔶 7-Day Fibonacci Levels:</p>
          <p>{analysis.fibonacciLevels7}</p>
          <p>🔶 60-Day Fibonacci Levels:</p>
          <p>{analysis.fibonacciLevels60}</p>
          <p>🔶 60-Day Ichimoku Levels:</p>
          <p>{analysis.ichimokuLevels60}</p>
          <p>🔶 {analysis.fearGreedIndex}</p>
          <p>📰 News:</p>
          {analysis.news.map((item, index) => (
            <p key={index}>🔸 {item}</p>
          ))}
          <p className="disclaimer">
            Disclaimer: Digital asset prices can be volatile. The value of your investment may go down or up and you may not get back the amount invested. Not financial advice. For more information, see our Terms of Use and Risk Warning.
          </p>
        </div>
      )}
    </div>
  );
};

export default CryptoAnalysis;
