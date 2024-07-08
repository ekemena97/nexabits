import axios from 'axios';
import fallbackImage from '../assets/fallback.png';

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${process.env.REACT_APP_BOT_TOKEN2}`;

export const getTelegramProfilePicture = async (userId) => {
  try {
    const response = await axios.get(`${TELEGRAM_API_BASE_URL}/getUserProfilePhotos`, {
      params: {
        user_id: userId,
        limit: 1
      }
    });
    const photos = response.data.result.photos;
    if (photos && photos.length > 0) {
      const fileId = photos[0][0].file_id;
      const fileResponse = await axios.get(`${TELEGRAM_API_BASE_URL}/getFile`, {
        params: {
          file_id: fileId
        }
      });
      const filePath = fileResponse.data.result.file_path;
      return `https://api.telegram.org/file/bot${process.env.REACT_APP_BOT_TOKEN2}/${filePath}`;
    } else {
      return fallbackImage; // Use fallback image if no profile picture
    }
  } catch (error) {
    console.error('Error fetching Telegram profile picture:', error);
    return fallbackImage; // Use fallback image on error
  }
};

export const getTelegramUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${TELEGRAM_API_BASE_URL}/getChat`, {
      params: {
        chat_id: userId
      }
    });
    const user = response.data.result;
    return user.username || user.first_name; // Prioritize username over first name
  } catch (error) {
    console.error('Error fetching Telegram user info:', error);
    return null; // Return null on error
  }
};
