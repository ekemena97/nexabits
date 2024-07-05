const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const bot = new Telegraf('YOUR_BOT_TOKEN');
const app = express();

app.use(bodyParser.json());

// Generate referral link
const generateReferralLink = (userId) => {
  return `https://t.me/YourBotUsername?start=${userId}`;
};

// Save user to database
const saveUser = async (user) => {
  // Implement your database save logic here
};

// Save referral to database
const saveReferral = async (referral) => {
  // Implement your database save logic here
};

// Reward user for referral
const rewardUser = async (referrerId) => {
  // Implement your reward logic here
};

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const referrerId = ctx.startPayload;

  const user = { id: userId, points: 0 };
  await saveUser(user);

  if (referrerId) {
    await saveReferral({ referrerId, userId });
    await ctx.reply(`You were referred by ${referrerId}`);
    await bot.telegram.sendMessage(referrerId, `You have referred a new user: ${userId}`);
  } else {
    await ctx.reply('Welcome!');
  }

  const referralLink = generateReferralLink(userId);
  await ctx.reply(`Share this link to refer others: ${referralLink}`);
});

app.post('/bot', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
