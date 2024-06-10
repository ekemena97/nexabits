const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const checkTelegramUserStatus = async (chatId) => {
  try {
    const response = await axios.get(`${telegramApiUrl}/getChat`, {
      params: { chat_id: chatId },
    });
    const { is_premium } = response.data.result;
    return is_premium ? 'premium' : 'normal';
  } catch (error) {
    console.error('Error fetching Telegram user status:', error);
    throw error;
  }
};

module.exports = checkTelegramUserStatus;
