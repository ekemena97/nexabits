const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { getUser, updateUser } = require('./dynamoDBHandler');
const { getTelegramUserInfo } = require('./telegramApiHandler'); // Corrected path

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const data = await getUser(username);
    res.json(data.Item);
  } catch (error) {
    res.status(500).send('Error fetching user data');
  }
});

app.post('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const user = req.body;
  user.username = username;
  try {
    await updateUser(user);
    res.send('User data updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user data');
  }
});

app.get('/api/telegram-username/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userInfo = await getTelegramUserInfo(userId);
    res.json(userInfo);
  } catch (error) {
    res.status(500).send('Error fetching Telegram user info');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
