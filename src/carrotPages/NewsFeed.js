import React, { Suspense, lazy, memo, useRef } from "react";
import { Link } from 'react-router-dom'; // Ensure Link is imported
import { useThemeContext } from "../context/ThemeContext.js";
import { useTreasureContext } from "../context/treasureContext.js";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './NewsFeed.css';
import { useQuery } from "react-query";

import { news } from '../data/news.js';
import axios from 'axios';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';

const Carousel = lazy(() => import('react-responsive-carousel').then(module => ({ default: module.Carousel })));

const fetchTrendingCoins = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
  return response.data.coins;
};

const NewsFeed = () => {
  const { theme } = useThemeContext(); // If `theme` is not used, you can remove this line.
  const { addTreasurePoint } = useTreasureContext();
  const { data: trendingCoins, error, isLoading } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins
  });

  const getPriceChangeClass = (change) => {
    return change > 0 ? 'positive-change' : 'negative-change';
  };

  const handleLinkClick = (id) => {
    const currentTime = new Date().getTime();
    sessionStorage.setItem(`startTime-${id}`, currentTime);
    console.log(`Start time for ${id} stored in session storage:`, currentTime);

    const pointAdded = sessionStorage.getItem(`pointAdded-${id}`) === 'true';

    const checkTimeOnPage = () => {
      if (!pointAdded) {
        const startTime = sessionStorage.getItem(`startTime-${id}`);
        const currentTime = new Date().getTime();
        const timeSpent = (currentTime - startTime) / 1000;
        console.log(`Time spent on ${id}:`, timeSpent, 'seconds');
        if (timeSpent >= 60) {
          addTreasurePoint();
          sessionStorage.setItem(`pointAdded-${id}`, 'true');
        }
      }
    };

    setTimeout(checkTimeOnPage, 60000);
  };

  return (
    <div className="newsfeed-container font-inter h-screen overflow-hidden">
      <div className="carousel-container">
        <Suspense fallback={null}>
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
              <img className="carousel-image" src={image5} alt="Banner 5" />
            </div>
            <div>
              <img className="carousel-image" src={image3} alt="Banner 3" />
            </div>
            <div>
              <img className="carousel-image" src={image4} alt="Banner 4" />
            </div>
          </Carousel>
        </Suspense>
      </div>

      <div className="h-[calc(100vh-220px)] overflow-auto scrollbar-hide">

        <div className="trending-coins-container">
          <h2>Trending Coins globally</h2>
          {isLoading ? null : error ? (
            <div>Error fetching trending coins: {error.message}</div>
          ) : (
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
          )}
        </div>

        <div className="news-section">
          {news.map((newsItem) => (
            <div key={newsItem.id} className="news-item">
              <Link to={`/blog/${newsItem.id}`} className="news-link" onClick={() => handleLinkClick(newsItem.id)}>
                <img src={newsItem.image} alt={newsItem.title} className="news-image" />
                <div className="news-details">
                  <h3 className="news-title">{newsItem.title}</h3>
                  <div className="news-meta">
                    <p className="news-views">👁️ {newsItem.views}</p>
                    <p className="news-time">{newsItem.time}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>  
    </div>
  );
};

export default memo(NewsFeed);
