// src/context/telegramStorageService.js
import axios from 'axios';

// Replace with your Telegram bot token and API endpoint
//const BOT_TOKEN = '6587270924:AAEE_-fPSepKz62ThB9s7SNcUvuiMrBZ4JQ';
const TELEGRAM_API_URL = "https://api.telegram.org/bot6587270924:AAEE_-fPSepKz62ThB9s7SNcUvuiMrBZ4JQ";

const telegramStorageService = {
  setItem: (key, value) => {
    return axios.post(`${TELEGRAM_API_URL}/storage/setItem`, { key, value });
  },
  getItem: (key) => {
    return axios.post(`${TELEGRAM_API_URL}/storage/getItem`, { key });
  },
  getItems: (keys) => {
    return axios.post(`${TELEGRAM_API_URL}/storage/getItems`, { keys });
  },
  removeItem: (key) => {
    return axios.post(`${TELEGRAM_API_URL}/storage/removeItem`, { key });
  },
  removeItems: (keys) => {
    return axios.post(`${TELEGRAM_API_URL}/storage/removeItems`, { keys });
  },
  getKeys: () => {
    return axios.post(`${TELEGRAM_API_URL}/storage/getKeys`);
  },
};

export default telegramStorageService;
