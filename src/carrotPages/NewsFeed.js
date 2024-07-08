import React, { useEffect, useState } from "react";
import { useThemeContext } from "../context/ThemeContext.js";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import './NewsFeed.css';  // Import the CSS file
import axios from 'axios';
import { news } from '../data/news.js'; // Import the news data

const NewsFeed = () => {
  const { theme } = useThemeContext();
  const [trendingCoins, setTrendingCoins] = useState([]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        setTrendingCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };

    fetchTrendingCoins();

  }, []);

  const getPriceChangeClass = (change) => {
    return change > 0 ? 'positive-change' : 'negative-change';
  };

  return (
    <div className="newsfeed-container">
      <div className="carousel-container">
        <Carousel
          autoPlay
          interval={10000}
          infiniteLoop
          showThumbs={false}
          showStatus={false}
        >
          <div>
            <img className="carousel-image" src={image1} alt="Banner 1" />
          </div>
          <div>
            <img className="carousel-image" src={image2} alt="Banner 2" />
          </div>
          <div>
            <img className="carousel-image" src={image3} alt="Banner 3" />
          </div>
          <div>
            <img className="carousel-image" src={image4} alt="Banner 4" />
          </div>
        </Carousel>
      </div>

      <div className="trending-coins-container">
        <h2>Trending Coins</h2>
        <div className="trending-coins-row">
          {trendingCoins.slice(0, 5).map((coin, index) => (
            <div key={index} className="coin-card">
              <div className="coin-header">
                <img src={coin.item.thumb} alt={`${coin.item.name} logo`} className="coin-logo" />
                <h3 className="coin-name">{coin.item.name} ({coin.item.symbol})</h3>
              </div>
              <p className={getPriceChangeClass(coin.item.data.price_change_percentage_24h.usd)}>
                ${coin.item.data.price.toFixed(5)}
              </p>
              <p>
                24H: {coin.item.data.price_change_percentage_24h.usd.toFixed(1)}%
              </p>
              {coin.item.data.sparkline ? (
                <div className="sparkline-container">
                  <img src={coin.item.data.sparkline} alt={`${coin.item.name} sparkline`} className="sparkline-image" />
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="news-section">
        {news.map((newsItem) => (
          <div key={newsItem.id} className="news-item">
            <img src={newsItem.image} alt={newsItem.title} className="news-image" />
            <div className="news-details">
              <h3 className="news-title">{newsItem.title}</h3>
              <div className="news-meta">
                <p className="news-views">👁️ {newsItem.views}</p>
                <p className="news-time">{newsItem.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsFeed;
