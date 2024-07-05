import axios from 'axios';

const KEEP_ALIVE_URL = 'https://nexabitimage-ancg44yveq-ue.a.run.app/keep-alive'; // Your server's keep-alive endpoint
const INTERVAL = 5 * 60 * 1000; // 5 minutes

const keepAlive = () => {
  setInterval(async () => {
    try {
      const response = await axios.get(KEEP_ALIVE_URL);
      console.log('Keep-alive request sent:', response.status);
    } catch (error) {
      console.error('Error in keep-alive request:', error.message);
    }
  }, INTERVAL);
};

export default keepAlive;
