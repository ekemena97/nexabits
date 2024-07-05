import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION || 'TapUsers';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = `https://nexabitimage-ancg44yveq-ue.a.run.app/webhook`;

// Initialize Telegraf bot with your bot token
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Helper function to generate referral link
const generateReferralLink = (userId) => {
  return `https://t.me/TapLengendBot?start=${userId}`;
};

// Function to generate unique referral link for the user
const generateUniqueReferralLink = async (userId) => {
  const link = generateReferralLink(userId);
  return link;
};

// Function to remove undefined values from an object
const removeUndefinedValues = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

// Function to save or update user in Firestore
const saveOrUpdateUser = async (user) => {
  try {
    const sanitizedUser = removeUndefinedValues(user);
    await firestore.collection(collectionName).doc(user.id).set(sanitizedUser, { merge: true });
    console.log('User saved or updated:', user);
  } catch (error) {
    console.error('Error saving or updating user:', error);
  }
};

// Function to save referral to Firestore and reward the referrer
const saveReferral = async (referral) => {
  try {
    const referrerDoc = firestore.collection('Referrals').doc(referral.referrerId);
    await referrerDoc.set(
      {
        referredUsers: Firestore.FieldValue.arrayUnion(referral.userId)
      },
      { merge: true }
    );
    console.log('Referral saved:', referral);
    await rewardUser(referral.referrerId);
  } catch (error) {
    console.error('Error saving referral:', error);
  }
};

// Function to get user by ID from Firestore
const getUserById = async (userId) => {
  try {
    const userDoc = await firestore.collection(collectionName).doc(userId).get();
    if (userDoc.exists) {
      console.log('User found by ID:', userId);
      return userDoc.data();
    } else {
      console.log('User not found by ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Function to reward user for a successful referral
const rewardUser = async (referrerId) => {
  try {
    const user = await getUserById(referrerId);
    if (user) {
      user.count = (user.count || 0) + 10; // Example reward count
      await saveOrUpdateUser(user);
      console.log('User rewarded:', referrerId, 'New count:', user.count);
    } else {
      console.error('Referrer not found:', referrerId);
    }
  } catch (error) {
    console.error('Error rewarding user:', error);
  }
};

// Bot start command handler
bot.start(async (ctx) => {
  const userId = ctx.from.id.toString(); // Ensure userId is a string
  const referrerId = ctx.startPayload ? ctx.startPayload.toString() : null; // Ensure referrerId is a string
  const username = ctx.from.username;
  const isBot = ctx.from.is_bot;
  const isPremium = ctx.from.is_premium || false;
  const firstName = ctx.from.first_name;
  const timestamp = new Date().toISOString();

  // Send the welcome message to the user with inline buttons
  await ctx.replyWithHTML(`
Hey ${firstName}, Welcome to Nexabit.\nAn L1 that leverages the taps to train AI,\n
bringing gamification and reward distribution to your fingertip.\n
We launched our mini app to enable you to farm as many count as possible now.\n
These count will be exchanged for the $NEXT token when we launch in Q4.\n
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

  // Proceed with processing the user and referrals
  console.log('Bot start command received:', { userId, referrerId, username, isBot, isPremium, firstName, timestamp });

  // Check if the user is already saved in Firestore
  let user = await getUserById(userId);
  if (!user) {
    // Create a new user object if not exists
    user = {
      id: userId,
      username,
      isBot,
      isPremium,
      firstName,
      timestamp,
      count: 0
    };

    // Save the new user
    await saveOrUpdateUser(user);
  } else {
    console.log('User already exists:', userId);
  }

  // Re-fetch the user to ensure it's saved correctly
  user = await getUserById(userId);
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
    const referrer = await getUserById(referrerId);
    if (referrer) {
      console.log('Referrer exists:', referrerId);

      // Ensure the referred user cannot refer the referrer
      const existingReverseReferralSnapshot = await firestore.collection('Referrals').where('referrerId', '==', userId).where('referredUsers', 'array-contains', referrerId).get();
      if (!existingReverseReferralSnapshot.empty) {
        console.log('Referred user cannot refer the referrer. No action taken.');
        return;
      }

      // Check if the user has already been referred
      const existingReferralSnapshot = await firestore.collection('Referrals').where('referredUsers', 'array-contains', userId).get();
      if (existingReferralSnapshot.empty) {
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
});

// Endpoint for Telegram to send updates to the bot
app.post('/bot', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
  console.log('Telegram update received:', req.body);
});

// REST endpoint to add a user
app.post('/user', async (req, res) => {
  const user = req.body;
  await saveOrUpdateUser(user);
  res.status(201).send(user);
  console.log('User added via REST endpoint:', user);
});

// REST endpoint to add a referral
app.post('/referral', async (req, res) => {
  const referral = req.body;
  await saveReferral(referral);
  res.status(201).send(referral);
  console.log('Referral added via REST endpoint:', referral);
});

// REST endpoint to get a user by ID
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await getUserById(userId);
  if (user) {
    res.send(user);
    console.log('User fetched by ID:', userId, 'Result:', user);
  } else {
    res.status(404).send('User not found');
    console.log('User not found by ID:', userId);
  }
});

// REST endpoint to update a user by ID
app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  let user = await getUserById(userId);
  if (user) {
    user = { ...user, ...req.body };
    await saveOrUpdateUser(user);
    res.send(user);
    console.log('User updated via REST endpoint:', userId, 'New data:', req.body);
  } else {
    res.status(404).send('User not found');
    console.log('User not found for update by ID:', userId);
  }
});

app.get('/api/user/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  try {
    const userRef = firestore.collection(collectionName).doc(uniqueId);
    const doc = await userRef.get();
    if (!doc.exists) {
      res.status(404).send('User not found');
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

app.post('/api/user/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  const user = req.body;
  try {
    const userRef = firestore.collection(collectionName).doc(uniqueId);
    await userRef.set(user, { merge: true });
    res.send('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Error updating user data');
  }
});

// New endpoint to get referral link
app.get('/api/user/:userId/referralLink', async (req, res) => {
  const { userId } = req.params;
  try {
    const link = await generateUniqueReferralLink(userId);
    res.json({ referralLink: link });
  } catch (error) {
    console.error('Error generating referral link:', error);
    res.status(500).send('Error generating referral link');
  }
});

app.get('/api/user/getChatId', async (req, res) => {
  try {
    const usersSnapshot = await firestore.collection(collectionName).get();
    if (usersSnapshot.empty) {
      return res.status(404).send('No users found');
    }
    const user = usersSnapshot.docs[0].data();
    if (!user.chatId) {
      throw new Error('Chat ID not found in user data');
    }
    res.json({ chatId: user.chatId });
  } catch (error) {
    console.error('Error fetching chat ID:', error);
    res.status(500).send('Error fetching chat ID');
  }
});

app.get('/setWebhook', async (req, res) => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: WEBHOOK_URL })
    });
    const result = await response.json();
    res.send(result);
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.send(error);
  }
});

app.post('/webhook', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.from || !message.chat) {
    console.error('Invalid Telegram webhook payload:', req.body);
    return res.status(400).send('Invalid Telegram webhook payload');
  }

  const chat = message.chat;
  const chatId = chat.id.toString();

  try {
    const userDetails = await getUserDetailsFromTelegram(chatId);
    const userRef = firestore.collection(collectionName).doc(chatId);
    const doc = await userRef.get();

    if (doc.exists) {
      const existingData = doc.data();

      // Preserve existing timestamp and chatId
      userDetails.timestamp = existingData.timestamp;
      userDetails.chatId = existingData.chatId;
    } else {
      userDetails.timestamp = new Date().toISOString();
      userDetails.chatId = chatId;
    }

    await userRef.set(userDetails, { merge: true });

    res.send('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).send('Error saving user data');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start the bot
bot.launch();
console.log('Bot launched');

export default app;
