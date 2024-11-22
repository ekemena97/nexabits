import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import keepAlive from './keepAlive.js'; // Import the keep-alive function
import { getStorageItem, setStorageItem } from './storageHelpers.js';
import { GoPlus, ErrorCode } from '@goplus/sdk-node';
import { HermesClient } from '@pythnetwork/hermes-client';
import crypto from 'crypto'; // Importing the crypto module


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION || 'TapUsers';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TELEGRAM_TOKEN);
const validPasscode = process.env.passcode;

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
  bot.launch();
  console.log('Bot launched');
  keepAlive();
});

// verify telegram data before operations for safety

const verifyTelegramWebAppData = (telegramInitData) => {
  console.log('Received Telegram Init Data:', telegramInitData);

  const encoded = decodeURIComponent(telegramInitData);
  console.log('Decoded Data:', encoded);

  const secret = crypto.createHmac("sha256", "WebAppData").update(TELEGRAM_TOKEN);
  console.log('Secret Key:', secret);

  const arr = encoded.split("&");
  console.log('Split Data Array:', arr);

  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  console.log('Extracted Hash:', hash);

  arr.sort((a, b) => a.localeCompare(b));
  console.log('Sorted Data Array:', arr);

  const dataCheckString = arr.join("\n");
  console.log('Data Check String:', dataCheckString);

  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");
  console.log('Generated Hash:', _hash);

  const isVerified = _hash === hash;
  console.log('Verification Result:', isVerified);

  return isVerified;
};

const generateReferralLink = (userId) => `https://t.me/NexaBit_Tap_bot/start?startapp=${userId}`;

const removeUndefinedValues = (obj) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null));

const saveOrUpdateUser = async (user) => {
  user.id = user.id ? user.id.toString() : ''; // Ensure user.id is a string
  if (!user.id || typeof user.id !== 'string' || user.id.trim() === '') {
    console.error('Cannot save or update user without a valid id:', user.id);
    return;
  }
  try {
    const sanitizedUser = removeUndefinedValues(user);
    if (!sanitizedUser.timestamp) {
      sanitizedUser.timestamp = Firestore.FieldValue.serverTimestamp(); // Ensure the server timestamp is used
    }
    await firestore.collection(collectionName).doc(user.id).set(sanitizedUser, { merge: true });
    console.log('User saved or updated:', user);
  } catch (error) {
    console.error('Error saving or updating user:', error);
  }
};

const incrementUserCount = async (userId, increment) => {
  try {
    const user = await getUserById(userId);
    if (user) {
      user.count = (user.count || 0) + increment;
      await saveOrUpdateUser(user);
      console.log(`User count incremented by ${increment}:`, userId, 'New count:', user.count);

      // Increment count in Telegram CloudStorage
      const storageKey = 'count';
      const currentCount = await getStorageItem(storageKey);
      const newCount = (currentCount || 0) + increment;
      await setStorageItem(storageKey, newCount);
      console.log(`Telegram CloudStorage count incremented by ${increment}:`, userId, 'New count:', newCount);
    } else {
      console.error('User not found for count increment:', userId);
    }
  } catch (error) {
    console.error('Error incrementing user count:', error);
  }
};


const saveReferral = async (referral) => {
  referral.referrerId = referral.referrerId ? referral.referrerId.toString() : ''; // Ensure referrerId is a string
  referral.userId = referral.userId ? referral.userId.toString() : ''; // Ensure userId is a string
  if (!referral.referrerId || !referral.userId || typeof referral.referrerId !== 'string' || typeof referral.userId !== 'string' || referral.referrerId.trim() === '' || referral.userId.trim() === '') {
    console.error('Cannot save referral without valid referrerId and userId:', referral);
    return;
  }
  try {
    const referredUser = await getUserById(referral.userId);
    const incrementAmount = referredUser.isPremium ? 10000 : 5000;

    const referrerDoc = firestore.collection('Referrals').doc(referral.referrerId);
    await referrerDoc.set({
      referredUsers: Firestore.FieldValue.arrayUnion(referral.userId),
      timestamp: Firestore.FieldValue.serverTimestamp() // Ensure the server timestamp is used
    }, { merge: true });

    console.log('Referral saved:', referral);
    await incrementUserCount(referral.referrerId, incrementAmount); // Increment referrer's count
    await incrementUserCount(referral.userId, incrementAmount); // Increment referred user's count
  } catch (error) {
    console.error('Error saving referral:', error);
  }
};

const getUserById = async (userId) => {
  userId = userId ? userId.toString() : ''; // Ensure userId is a string
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.error('Cannot get user by invalid id:', userId);
    return null;
  }
  try {
    const userDoc = await firestore.collection(collectionName).doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      userData.referralLink = generateReferralLink(userId); // Include referralLink in the user data
      console.log('User found by ID:', userId);
      return userData;
    } else {
      console.log('User not found by ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

const processUserAndReferral = async (userId, referrerId, userInfo) => {
  let user = await getUserById(userId);
  if (!user) {
    user = {
      id: userId,
      ...userInfo,
      count: 0,
      referralLink: generateReferralLink(userId)
    };
    await saveOrUpdateUser(user);
  } else {
    console.log('User already exists:', userId);
  }

  user = await getUserById(userId);
  console.log('User after saving:', user);

  if (referrerId) {
    console.log('Processing referral:', { referrerId, userId });

    if (referrerId === userId) {
      console.log('User cannot refer himself. No action taken.');
      return;
    }

    const referrer = await getUserById(referrerId);
    if (referrer) {
      console.log('Referrer exists:', referrerId);

      const existingReverseReferralSnapshot = await firestore.collection('Referrals').where('referrerId', '==', userId).where('referredUsers', 'array-contains', referrerId).get();
      if (!existingReverseReferralSnapshot.empty) {
        console.log('Referred user cannot refer the referrer. No action taken.');
        return;
      }

      const existingReferralSnapshot = await firestore.collection('Referrals').where('referredUsers', 'array-contains', userId).get();
      if (existingReferralSnapshot.empty) {
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
};

// Function to handle start command and send welcome message
const handleStartCommand = async (ctx) => {
  const userId = ctx.from.id.toString();
  const referrerId = ctx.startPayload ? ctx.startPayload.toString() : null;
  const userInfo = {
    username: ctx.from.username,
    isBot: ctx.from.is_bot,
    isPremium: ctx.from.is_premium || false,
    firstName: ctx.from.first_name,
    timestamp: Firestore.FieldValue.serverTimestamp(),
  };

  // Send the welcome message to the user with inline buttons immediately
  await ctx.replyWithHTML(
    `Hey ${userInfo.firstName}, welcome to Nexabit 🎉!\nNexabit is an L3 AI protocol powered by Arkham Intelligence and OpenAI.\n\nIt aggregates trading data from whales, big banks and corporations; and then uses this data and AI to identify potential buy and sell levels, thereby helping users to trade more profitably. \n\nOur mini app is live! Farm $NEXAI tokens now. By farming, you train our AI to be able to be more intelligent in spotting great trade opportunities and Airdrops. \n\nWith 60% of the supply going to our community, future rewards are immense. \nInvite your friends and amplify the excitement! Click on Open App to start now`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
          [{ text: '🌐 Join community', url: 'https://t.me/nexabitHQ' }]
        ]
      }
    }
  );

  // Process user and referrals
  await processUserAndReferral(userId, referrerId, userInfo);
};

bot.start(async (ctx) => {
  handleStartCommand(ctx);
});

app.post('/webhook', (req, res) => {
  try {
    console.log('Webhook request received:', JSON.stringify(req.body, null, 2));
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling webhook request:', error);
    res.sendStatus(500);
  }
});

app.post('/user', async (req, res) => {
  try {
    const user = JSON.parse(JSON.stringify(req.body)); // Ensure the payload is parsed and stringified
    user.id = user.id ? user.id.toString() : ''; // Ensure user.id is a string
    console.log('POST /user request received:', user);
    await saveOrUpdateUser(user);
    res.status(201).send(user);
    console.log('User added via REST endpoint:', user);
  } catch (error) {
    console.error('Error processing /user request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/referral', async (req, res) => {
  try {
    const referral = JSON.parse(JSON.stringify(req.body)); // Ensure the payload is parsed and stringified
    const userId = referral.userId ? referral.userId.toString() : '';
    const referrerId = referral.referrerId ? referral.referrerId.toString() : '';
    console.log('POST /referral request received:', referral);

    if (userId && referrerId) {
      const userInfo = {}; // Add any additional user info if needed
      await processUserAndReferral(userId, referrerId, userInfo);
      res.status(201).send(referral);
      console.log('Referral processed via REST endpoint:', referral);
    } else {
      res.status(400).send('Invalid referral data');
      console.error('Invalid referral data:', referral);
    }
  } catch (error) {
    console.error('Error processing /referral request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/user', async (req, res) => {
  const userId = req.query.userId ? req.query.userId.toString() : ''; // Ensure userId is a string
  console.log('GET /user request received for ID:', userId);
  try {
    const user = await getUserById(userId);
    if (user) {
      res.send(user);
      console.log('User fetched by ID:', userId, 'Result:', user);
    } else {
      res.status(404).send('User not found');
      console.log('User not found by ID:', userId);
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id ? req.params.id.toString() : ''; // Ensure userId is a string
    const updateData = JSON.parse(JSON.stringify(req.body)); // Ensure the payload is parsed and stringified
    console.log('PUT /user/:id request received for ID:', userId, 'with data:', updateData);
    let user = await getUserById(userId);
    if (user) {
      user = { ...user, ...updateData };
      await saveOrUpdateUser(user);
      res.send(user);
      console.log('User updated via REST endpoint:', userId, 'New data:', updateData);
    } else {
      res.status(404).send('User not found');
      console.log('User not found for update by ID:', userId);
    }
  } catch (error) {
    console.error('Error processing PUT /user/:id request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/checkref', async (req, res) => {
  const userId = req.query.userId ? req.query.userId.toString() : ''; // Ensure userId is a string
  console.log('GET /checkref request received for userId:', userId);
  
  try {
    const user = await getUserById(userId);
    if (user) {
      // Fetch referred users
      const referralDoc = await firestore.collection('Referrals').doc(userId).get();
      const referredUsers = referralDoc.exists ? referralDoc.data().referredUsers : [];

      // Fetch successful referrals and isPremium status
      const referredUsersDetails = [];
      let successfulReferralsCount = 0;
      let premiumReferredUsersCount = 0;
      let ordinaryReferredUsersCount = 0;

      for (const referredUserId of referredUsers) {
        const referredUserDoc = await firestore.collection(collectionName).doc(referredUserId.toString()).get(); // Ensure referredUserId is a string
        if (referredUserDoc.exists) {
          const userData = referredUserDoc.data();
          const isSuccess = userData.count >= 10000;
          const isPremium = userData.isPremium || false;

          if (isSuccess) {
            successfulReferralsCount++;
          }

          if (isPremium) {
            premiumReferredUsersCount++;
          } else {
            ordinaryReferredUsersCount++;
          }

          referredUsersDetails.push({
            id: referredUserId,
            success: isSuccess,
            isPremium
          });
        }
      }

      const totalReferrals = referredUsers.length;

      res.send({ 
        referralLink: user.referralLink, 
        referredUsersDetails, 
        totalReferrals,
        successfulReferralsCount,
        premiumReferredUsersCount,
        ordinaryReferredUsersCount
      });
      console.log('Checkref response sent for userId:', userId);
    } else {
      res.status(404).send('User not found');
      console.log('User not found for checkref by ID:', userId);
    }
  } catch (error) {
    console.error('Error fetching referral link:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/keep-alive', (req, res) => {
  res.sendStatus(200); // Respond with 200 OK status
  console.log('GET /keep-alive request received');
});

app.post('/log', (req, res) => {
  const { message } = req.body;
  console.log('Log from TapContext.js:', message);
  res.sendStatus(200);
});

// Log IP Address
app.post('/log-ip', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userId = req.body.userId ? req.body.userId.toString() : ''; // Ensure userId is a string

  // Debug log for userId and IP address
  console.log('Received log-ip request with userId:', userId, 'and IP:', ip);

  // Check if userId is valid
  if (!userId) {
    console.error('Invalid userId:', userId);
    res.status(400).json({ error: 'Invalid userId' });
    return;
  }

  try {
    const userDocRef = firestore.collection(collectionName).doc(userId);
    const userDoc = await userDocRef.get();
    const currentTime = Firestore.FieldValue.serverTimestamp();
    let missingFields = [];

    if (userDoc.exists) {
      const userData = userDoc.data();

      // Check for missing fields
      if (!userData.ip) missingFields.push('ip');
      if (!userData.login) missingFields.push('login');
      if (userData.DAU === undefined) missingFields.push('DAU');

      if (missingFields.length > 0) {
        console.warn(`Missing fields for userId ${userId}:`, missingFields);
      }

      const lastLoginTime = userData.login ? userData.login.toMillis() : 0;
      const currentTimeMillis = Date.now();
      const timeDifference = currentTimeMillis - lastLoginTime;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const threeDays = 3 * oneDay; // 3 days in milliseconds
      const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      // Condition 1: Time difference is between 24 hours and 3 days
      if (timeDifference >= oneDay && timeDifference <= threeDays) {
        await userDocRef.update({
          ip,
          login: currentTime,
          DAU: Firestore.FieldValue.increment(1)
        });
        res.status(200).json({ message: 'IP logged, login time updated, and DAU updated' });

      // Condition 2: Time difference is between 12 hours and less than 24 hours
      } else if (timeDifference >= twelveHours && timeDifference < oneDay) {
        await userDocRef.update({
          ip,
          login: currentTime
        });
        res.status(200).json({ message: 'IP logged and login time updated without updating DAU' });

      } else {
        // If the login time does not meet the conditions, ensure only missing fields are updated
        if (missingFields.length > 0) {
          let updateData = {};
          if (!userData.ip) updateData.ip = ip;
          if (!userData.login) updateData.login = currentTime;
          if (userData.DAU === undefined) updateData.DAU = 1;
          await userDocRef.update(updateData);
          res.status(200).json({ message: 'Missing fields updated without changing existing login time or DAU' });
        } else {
          res.status(200).json({ message: 'No updates made' });
        }
      }
    } else {
      // Log missing fields for new user
      missingFields = ['ip', 'login', 'DAU'];
      console.warn(`Missing fields for new userId ${userId}:`, missingFields);

      // New user: initialize all fields
      await userDocRef.set({
        ip,
        login: currentTime,
        DAU: 1,
        timestamp: Firestore.FieldValue.serverTimestamp()
      });
      res.status(200).json({ message: 'IP logged, login time initialized, and DAU initialized' });
    }
  } catch (error) {
    console.error('Error logging IP and updating DAU:', error);
    res.status(500).json({ error: 'Error logging IP and updating DAU' });
  }
});

// Middleware to log HTTP errors
app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.error(`HTTP Error: ${res.statusCode} - ${res.statusMessage} for ${req.method} ${req.originalUrl}`);
    }
  });
  next();
});

// New route to send messages to all users
app.post('/api/send-message', async (req, res) => {
  const { message, inlineKeyboard } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  try {
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    const batchSize = 30; // Adjust based on Telegram's rate limits
    const delay = 1000; // Delay between batches in milliseconds

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await Promise.all(
        batch.map(user => {
          return bot.telegram.sendMessage(user.id, message, {
            reply_markup: inlineKeyboard || undefined, // Pass inline keyboard if provided
            parse_mode: 'Markdown' // Use markdown if necessary
          }).catch(err => console.error(`Failed to send message to ${user.id}:`, err));
        })
      );

      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Messages sent successfully' });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ message: 'Error sending messages' });
  }
});




app.post('/api/trigger-start', async (req, res) => {
  try {
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    const batchSize = 30; // Adjust based on Telegram's rate limits
    const delay = 1000; // Delay between batches in milliseconds

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await Promise.all(
        batch.map(user => {
          const ctx = {
            from: {
              id: user.id,
              username: user.username,
              is_bot: user.isBot,
              is_premium: user.isPremium,
              first_name: user.firstName
            },
            startPayload: null,
            replyWithHTML: (message, options) => bot.telegram.sendMessage(user.id, message, options)
          };

          return handleStartCommand(ctx).catch(err => console.error(`Failed to send start command to ${user.id}:`, err));
        })
      );

      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Start command triggered for all users' });
  } catch (error) {
    console.error('Error triggering start command:', error);
    res.status(500).json({ message: 'Error triggering start command' });
  }
});

//Telegram data verification endpoint

app.post('/verify-telegram-data', (req, res) => {
  const { telegramInitData } = req.body;
  console.log('Request Body:', req.body);

  const verified = verifyTelegramWebAppData(telegramInitData);
  console.log('Verification Status:', verified);

  res.json({ verified });
});

app.post('/api/validate-passcode', (req, res) => {
  const { passcode } = req.body;
  if (passcode === validPasscode) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Token security endpoint
app.post('/token-security', async (req, res) => {
  const { chainId, addresses } = req.body;

  try {
    let result;

    if (chainId === '0') {
      // Solana-specific API call
      const solanaUrl = `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${addresses[0]}`;
      const options = {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      };

      // Fetch from the GoPlus Solana API
      const solanaResponse = await fetch(solanaUrl, options);
      result = await solanaResponse.json();
    } else {
      // General token security API call for other chains
      const options = {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      };

      // Construct the URL for the general API call
      const generalUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${addresses.join(',')}`;
      
      // Fetch from the GoPlus API for other chains
      const generalResponse = await fetch(generalUrl, options);
      result = await generalResponse.json();
    }

    if (!result || (result.code && result.code !== ErrorCode.SUCCESS)) {
      return res.status(400).json({ error: result.message || 'Unknown error' });
    }

    return res.json({ result: result.result || result });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: `Failed to fetch: ${error.message}` });
  }
});

// Backend route to handle POST requests at /trends
app.post('/trends', async (req, res) => {
  const { account_ids } = req.body;

  // Log the data received from the frontend
  console.log('Received data from frontend:', account_ids);

  if (!account_ids || !Array.isArray(account_ids)) {
    return res.status(400).json({ error: 'account_ids must be an array' });
  }

  try {
    // Send POST request to the external API with the Accept header set to '*/*'
    const response = await fetch('https://tonapi.io/v2/jettons/_bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({ account_ids }),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('External API error:', errorMessage);
      return res.status(response.status).json({ error: errorMessage });
    }

    // Parse the response data
    const data = await response.json();
    console.log('Data received from external API:', data);

    // Send the response back to the client
    return res.json(data);
  } catch (error) {
    console.error('Error in POST /trends:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Initialize HermesClient with the endpoint URL
const hermesClient = new HermesClient("https://hermes.pyth.network");

// Map of supported coins and their corresponding price feed IDs
const priceIds = {
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  SUI: "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744",
  TON: "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026",
  SOL: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  BNB: "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
  USDT: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  TRX: "0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b",
};

// Endpoint to fetch price updates based on the selected coin
app.get('/price-updates', async (req, res) => {
  const { coin } = req.query;
  console.log("Received request for coin:", coin);

  const priceId = priceIds[coin];
  console.log("Using price ID:", priceId);

  if (!priceId) {
    console.error("Invalid or unsupported coin type:", coin);
    return res.status(400).json({ error: "Invalid or unsupported coin type." });
  }

  try {
    // Fetch the latest price updates
    const priceUpdates = await hermesClient.getLatestPriceUpdates([priceId]);
    console.log("Price updates received:", JSON.stringify(priceUpdates, null, 2));

    // Check if `priceUpdates.parsed` exists and has valid data
    if (!priceUpdates || !Array.isArray(priceUpdates.parsed) || priceUpdates.parsed.length === 0) {
      console.error("No valid parsed price data found for coin:", coin);
      return res.status(500).json({ error: "No valid price data available." });
    }

    // Loop through parsed items to locate a valid price data structure
    let currentPrice = null;
    for (const priceData of priceUpdates.parsed) {
      if (priceData && priceData.price && priceData.price.price) {
        // Convert price to readable format (e.g., if stored in cents or smaller units)
        currentPrice = (priceData.price.price / 100000000).toFixed(2);
        console.log("Extracted current price:", currentPrice);
        break;  // Stop once we successfully extract a price
      }
    }

    // Check if a valid price was found
    if (!currentPrice) {
      console.error("Failed to locate valid price data for coin:", coin);
      return res.status(500).json({ error: "Price data missing or malformed." });
    }

    res.json({ currentPrice });
  } catch (error) {
    console.error("Error fetching or processing price updates:", error);
    res.status(500).json({ error: "An error occurred while fetching price updates." });
  }
});


// API endpoint for /token-security-v2
// API endpoint for /token-security-v2
app.get('/token-security-v2', async (req, res) => {
  const { chainId, address: tokenAddress } = req.query; // Match the client's query parameters

  if (!chainId || !tokenAddress) {
    return res.status(400).json({ error: 'Missing chainId or tokenAddress' });
  }

  const apiUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;
  const options = {
    method: 'GET',
    headers: {
      accept: '*/*',
    },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch data from GoPlusLabs' });
    }

    const data = await response.json();
    return res.json(data); // Forward the response to the client
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default app;
