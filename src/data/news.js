import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpg';
import news3 from '../assets/news3.jpg';
import news4 from '../assets/news4.jpg';
import news5 from '../assets/news5.jpg';

// Function to generate unique random views
const generateRandomViews = () => {
  const viewsSet = new Set();
  while (viewsSet.size < 5) {
    viewsSet.add(`${Math.floor(Math.random() * (50000 - 10000 + 1) + 10000).toLocaleString()}K`);
  }
  return Array.from(viewsSet);
};

// Function to generate unique random times in ascending order
const generateRandomTimes = () => {
  const timesSet = new Set();
  while (timesSet.size < 5) {
    timesSet.add(Math.floor(Math.random() * 48 + 1));
  }
  return Array.from(timesSet).sort((a, b) => a - b).map(hours => `${hours} hours ago`);
};

const views = generateRandomViews();
const times = generateRandomTimes();

export const news = [
  {
    id: "0",
    image: news1,
    title: "How to Join the XION Airdrop: Read this before joining",
    time: times[0],
    views: views[0],
  },
  {
    id: "1",
    image: news2,
    title: "Crypto Market Volatility: Strategies for Investors in a Turbulent Market.",
    time: times[1],
    views: views[1],
  },
  {
    id: "2",
    image: news3,
    title: "Altcoin Season: Top Performing Cryptocurrencies to Watch in 2024",
    time: times[2],
    views: views[2],
  },
  {
    id: "3",
    image: news4,
    title: "Binance to Delist Multiple Tokens in July: Check the Delist list",
    time: times[3],
    views: views[3],
  },
  {
    id: "4",
    image: news5,
    title: "How to Join the Combat Airdrop: Rules Here",
    time: times[4],
    views: views[4],
  },
];
