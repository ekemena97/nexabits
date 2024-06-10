const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const getTelegramUserInfo = async (chatId) => {
  try {
    const response = await axios.get(`${telegramApiUrl}/getChat`, {
      params: { chat_id: chatId },
    });
    const { id, username } = response.data.result;
    return { id, username };
  } catch (error) {
    console.error('Error fetching Telegram user info:', error);
    throw error;
  }
};

module.exports = { getTelegramUserInfo };
