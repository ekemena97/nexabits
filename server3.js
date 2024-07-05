// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import axios from 'axios';

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Initialize Telegraf bot with your bot token
const bot = new Telegraf('6587270924:AAEE_-fPSepKz62ThB9s7SNcUvuiMrBZ4JQ');

// In-memory data storage for users and referrals
let users = [];
let referrals = [];

// Helper function to generate referral link
const generateReferralLink = (userId) => {
  return `https://t.me/TapLengendBot?start=${userId}`;
};

// Function to save user to the database (here, in-memory array)
const saveUser = (user) => {
  users.push(user);
  console.log('User saved:', user);
  logUsers();
};

// Function to save referral to the database (here, in-memory array) and reward the referrer
const saveReferral = async (referral) => {
  try {
    referrals.push(referral);
    console.log('Referral saved:', referral);
    await rewardUser(referral.referrerId);
    logReferrals();
  } catch (error) {
    console.error('Error saving referral:', error);
  }
};

// Function to get user by ID from the database (here, in-memory array)
const getUserById = (userId) => {
  console.log('Attempting to get user by ID:', userId, 'Type of userId:', typeof userId);
  const user = users.find(u => u.id === userId);
  console.log('Get user by ID:', userId, 'Result:', user);
  return user;
};

// Function to update user in the database (here, in-memory array)
const updateUser = (user) => {
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    console.log('User updated:', user);
  } else {
    console.error('User not found for update:', user.id);
  }
  logUsers();
};

// Function to reward user for a successful referral
const rewardUser = async (referrerId) => {
  console.log('Attempting to reward user:', referrerId);
  const user = getUserById(referrerId);
  if (user) {
    user.points += 10; // Example reward points
    updateUser(user);
    console.log('User rewarded:', referrerId, 'New points:', user.points);
  } else {
    console.error('Referrer not found:', referrerId);
  }
};

// Function to log all users
const logUsers = () => {
  console.log('All users:', JSON.stringify(users, null, 2));
};

// Function to log all referrals
const logReferrals = () => {
  console.log('All referrals:', JSON.stringify(referrals, null, 2));
};

// Bot start command handler
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString(); // Ensure userId is a string
  const referrerId = ctx.startPayload ? ctx.startPayload.toString() : null; // Ensure referrerId is a string
  const username = ctx.from.username;
  const isBot = ctx.from.is_bot;
  const isPremium = ctx.from.is_premium;
  const firstName = ctx.from.first_name;
  const timestamp = new Date().toISOString();

  console.log('Bot start command received:', { userId, referrerId, username, isBot, isPremium, firstName, timestamp });

  // Check if the user is already saved in the database
  let user = getUserById(userId);
  if (!user) {
    // Create a new user object if not exists
    user = {
      id: userId,
      username,
      isBot,
      isPremium,
      firstName,
      timestamp,
      points: 0
    };

    // Save the new user
    saveUser(user);
  } else {
    console.log('User already exists:', userId);
  }

  // Re-fetch the user to ensure it's saved correctly
  user = getUserById(userId);
  console.log('User after saving:', user);

  // Process the referral if there is a valid referrer ID
  if (referrerId) {
    console.log('Processing referral:', { referrerId, userId });

    // Ensure the user is not referring himself
    if (referrerId === userId) {
      console.log('User cannot refer himself. No action taken.');
      return;
    }

    // Ensure the referrer exists before processing the referral
    const referrer = getUserById(referrerId);
    if (referrer) {
      console.log('Referrer exists:', referrerId);

      // Ensure the referred user cannot refer the referrer
      const existingReverseReferral = referrals.find(referral => referral.referrerId === userId && referral.userId === referrerId);
      if (existingReverseReferral) {
        console.log('Referred user cannot refer the referrer. No action taken.');
        return;
      }

      // Check if the user has already been referred
      const existingReferral = referrals.find(referral => referral.userId === userId);
      if (!existingReferral) {
        // Save the referral
        await saveReferral({ referrerId, userId });
      } else {
        console.log('User already referred by someone. No action taken.');
      }
    } else {
      console.log('Referrer does not exist:', referrerId);
    }
  } else {
    console.log('No valid referrer ID. No referral action taken.');
  }

  // Send the welcome message to the user with inline buttons
  await ctx.replyWithHTML(`
Hey ${firstName}, Welcome to Nexabit.\nAn L1 that leverages the taps to train AI,\n
bringing gamification and reward distribution to your fingertip.\n
We launched our mini app to enable you to farm as many points as possible now.\n
These points will be exchanged for the $NEXT token when we launch in Q4.\n
Got friends? Bring them in, the more, the merrier.\n
Click on <b>Open App</b> to begin.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Open App', url: 'https://t.me/TapLengendBot/start' }],
          [{ text: '🌐 Join community', url: 'https://t.me/nexabitHQ' }]
        ]
      }
    }
  );
});

// Endpoint for Telegram to send updates to the bot
app.post('/bot', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
  console.log('Telegram update received:', req.body);
});

// REST endpoint to add a user
app.post('/user', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send(user);
  console.log('User added via REST endpoint:', user);
  logUsers();
});

// REST endpoint to add a referral
app.post('/referral', (req, res) => {
  const referral = req.body;
  referrals.push(referral);
  res.status(201).send(referral);
  console.log('Referral added via REST endpoint:', referral);
  logReferrals();
});

// REST endpoint to get a user by ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  if (user) {
    res.send(user);
    console.log('User fetched by ID:', userId, 'Result:', user);
  } else {
    res.status(404).send('User not found');
    console.log('User not found by ID:', userId);
  }
});

// REST endpoint to update a user by ID
app.put('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  if (user) {
    Object.assign(user, req.body);
    res.send(user);
    console.log('User updated via REST endpoint:', userId, 'New data:', req.body);
    logUsers();
  } else {
    res.status(404).send('User not found');
    console.log('User not found for update by ID:', userId);
  }
});

// REST endpoint to get all users
app.get('/users', (req, res) => {
  res.send(users);
  console.log('All users fetched');
});

// REST endpoint to get all referrals
app.get('/referrals', (req, res) => {
  res.send(referrals);
  console.log('All referrals fetched');
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Start the bot
bot.launch();
console.log('Bot launched');
