import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import keepAlive from './keepAlive.js'; // Import the keep-alive function
import { getStorageItem, setStorageItem } from './storageHelpers.js';
import { GoPlus, ErrorCode } from '@goplus/sdk-node';
import { HermesClient } from '@pythnetwork/hermes-client';
import crypto from 'crypto'; // Importing the crypto module
import axios from 'axios'; // Use import syntax for axios
import multer from 'multer';
import toml from "toml";
import tomlify from "tomlify-j0.4";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import xrpl from "xrpl";

const secretClient = new SecretManagerServiceClient();
const PROJECT_ID = "858950055775";
const ALGORITHM = "aes-256-cbc";
const TRANSFER_AMOUNT = 1200000;


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


app.get("/referral", async (req, res) => {
  try {
    const { referrerId } = req.query;

    // Validate input
    if (!referrerId) {
      return res.status(400).json({ error: "referrerId is required" });
    }

    // Query the Firestore collection to find the document with matching userId
    const usersSnapshot = await db.collection("collectionName")
      .where("userId", "==", referrerId)
      .limit(1)
      .get();

    // Check if any matching document is found
    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the first user's data
    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Return username or firstName
    const response = {
      referrerId: referrerId,
      username: userData.username || null,
      firstName: userData.firstName || null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user by referrerId:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
const upload = multer(); // Middleware for parsing FormData
app.post('/api/send-message', upload.single('attachment'), async (req, res) => {
  const { messageTemplate, inlineKeyboard, latitude, longitude, question, options, type, emoji } = req.body;
  const attachment = req.file; // Attachment if provided

  if (!messageTemplate && !attachment && !latitude && !longitude && !question && !emoji) {
    return res.status(400).json({ message: 'Message or attachment must be provided' });
  }

  try {
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    const batchSize = 30;
    const delay = 1000;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            const personalizedMessage = messageTemplate
              ? messageTemplate.replace('{{firstName}}', user.firstName || 'User')
              : null;

            if (attachment) {
              const mimeType = attachment.mimetype;

              if (mimeType.startsWith('image/')) {
                await bot.telegram.sendPhoto(user.id, { source: attachment.buffer }, {
                  caption: personalizedMessage || '',
                  reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
                });
              } else if (mimeType.startsWith('video/')) {
                await bot.telegram.sendVideo(user.id, { source: attachment.buffer }, {
                  caption: personalizedMessage || '',
                  reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
                });
              } else if (mimeType === 'image/gif') {
                await bot.telegram.sendAnimation(user.id, { source: attachment.buffer }, {
                  caption: personalizedMessage || '',
                  reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
                });
              } else if (mimeType === 'application/x-sticker') {
                await bot.telegram.sendSticker(user.id, { source: attachment.buffer });
              } else {
                await bot.telegram.sendDocument(user.id, { source: attachment.buffer }, {
                  caption: personalizedMessage || '',
                  reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
                });
              }
            } else if (latitude && longitude) {
              await bot.telegram.sendLocation(user.id, parseFloat(latitude), parseFloat(longitude), {
                reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
              });
            } else if (question && options) {
              const pollOptions = JSON.parse(options); // Ensure `options` is passed as a JSON string
              await bot.telegram.sendPoll(user.id, question, pollOptions, {
                is_anonymous: type === 'quiz' ? false : true,
                type,
              });
            } else if (emoji) {
              await bot.telegram.sendDice(user.id, { emoji });
            } else if (messageTemplate) {
              await bot.telegram.sendMessage(user.id, personalizedMessage, {
                reply_markup: inlineKeyboard ? JSON.parse(inlineKeyboard) : undefined,
                parse_mode: 'HTML',
              });
            }
          } catch (err) {
            console.error(`Failed to send message to ${user.id}:`, err);
          }
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
      const solanaUrl = `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${addresses}`;
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
          'accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      };

      // Construct the URL for the general API call
      const generalUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${addresses}`;
      
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


// Endpoint: /token-security-v0
app.get('/token-security-v0', async (req, res) => {
    const { chainId, addresses } = req.query;

    if (!chainId || !addresses) {
        return res.status(400).json({ error: "Missing chainId or addresses parameter." });
    }

    try {
        const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${addresses}`;
        const response = await axios.get(url);

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch token security data." });
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

app.get('/token-security-v3', async (req, res) => {
  const { chainId, tokenAddress } = req.query;

  // Log the received query parameters for debugging
  console.log('Received chainId:', chainId);
  console.log('Received addresses:', tokenAddress);

  if (!chainId || !tokenAddress) {
    console.log('Missing required parameters: chainId or addresses');
    return res.status(400).json({ error: 'chainId and addresses are required' });
  }

  // Construct GoPlus API URL
  const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;
  console.log('Constructed GoPlus API URL:', url);

  try {
    // Log the request being made to the GoPlus API
    console.log('Making request to GoPlus API...');
    const response = await axios.get(url, {
      headers: {
        'Accept': '*/*',
      }
    });

    // Log the response status and data for debugging
    console.log('GoPlus API Response Status:', response.status);
    console.log('GoPlus API Response Data:', response.data);

    // Check for valid response from GoPlus API
    if (response.data.code === 0) {
      console.log('Successfully received valid data from GoPlus API');
      return res.json({ result: response.data.result });
    } else {
      console.log('GoPlus API returned an error:', response.data.message);
      return res.status(400).json({ error: response.data.message || 'Unknown error' });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Request to GoPlus API failed:', error);

    // Provide a more specific error message for the client
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
});


//send meesages to users that didnt claim between 13 hours to 20 hours

const ONE_HOUR_MS = 3600000; // Milliseconds in one hour
const TWELVE_HOURS_MS = 43200000;  // 12 hours in milliseconds
const THIRTEEN_HOURS_MS = ONE_HOUR_MS * 13;
const TWENTY_HOURS_MS = ONE_HOUR_MS * 20;

app.post('/api/send-unclaimed-reminder1', async (req, res) => {
  const currentTime = Date.now(); // Get the current time in milliseconds

  // Define the inline keyboard
  const inlineKeyboard = JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
      [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
    ]
  });

  // Define 10 message templates with personalization and FOMO
  const messageTemplates = [
    "🎉 <b>Rewards Alert!</b> <b>{{count}}</b> $Next tokens are waiting just for you. <i>Claim them now</i> before they're gone! 🚀 <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🔥 You've earned <b>{{count}}</b> $Next tokens! <i>Don’t let them slip away</i>—<u>log in now</u> to claim your rewards. <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "⏰ Tick-tock, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are on hold. <i>Act now</i> to secure them before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "💎 Big news, <b>{{firstName}}</b>! Your balance just grew by <b>{{count}}</b> $Next. <i>Claim now</i> to keep the momentum going! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🌟 <b>{{firstName}}</b>, you’re on a roll! <b>{{count}}</b> $Next tokens are waiting in your account. <i>Log in</i> and grab them now! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🚨 Limited Time! Your <b>{{count}}</b> $Next tokens are ready to claim. <i>Don’t let them go unclaimed!</i> <u>Log in now</u> to claim them. <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "✨ Surprise! You’ve got <b>{{count}}</b> $Next tokens waiting to be claimed. <i>Login now</i> and enjoy your rewards! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🚀 Boost your balance now! <b>{{count}}</b> $Next tokens are available for you. <i>Claim fast</i> and stay ahead! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎁 Reward Unlocked! <b>{{firstName}}</b>, <b>{{count}}</b> $Next tokens are ready. <i>Log in now</i> to claim them before time runs out! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "⚡ Urgent, <b>{{firstName}}</b>! Don’t miss your <b>{{count}}</b> $Next tokens. <i>Claim them now</i> or risk losing out! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🎉 <b>Congrats</b>, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are waiting for you. Don’t let them expire! <a href='https://t.me/nexabit_tap_bot/start'>Claim them now</a>",
    "🚨 Attention, <b>{{firstName}}</b>! You have <b>{{count}}</b> $Next tokens available. <u>Don’t wait!</u> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "💎 Your balance has <b>{{count}}</b> $Next tokens, <i>{{firstName}}</i>. Log in to grab them before time runs out! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🔥 <b>{{firstName}}</b>, you’ve earned <b>{{count}}</b> $Next tokens! <i>Claim now</i> to continue your journey! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "⏰ Don’t miss out, <b>{{firstName}}</b>! <b>{{count}}</b> $Next tokens are waiting. Log in to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 <i>{{firstName}}</i>, your <b>{{count}}</b> $Next tokens are up for grabs! <i>Claim now</i> before they vanish! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🌟 Big rewards are here, <b>{{firstName}}</b>! <b>{{count}}</b> $Next tokens are waiting for you. <i>Don’t wait</i>, <u>log in</u> now! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🚀 Your <b>{{firstName}}</b> account is glowing with <b>{{count}}</b> $Next tokens! <i>Claim now</i> to boost your balance! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🔥 Hurry up, <i>{{firstName}}</i>! Your <b>{{count}}</b> $Next tokens are about to expire. <i>Log in now</i> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "⚡ Quick, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are ready to claim! <i>Don’t miss out</i>! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎉 Great job, <b>{{firstName}}</b>! You’ve earned <b>{{count}}</b> $Next tokens. Log in to claim your rewards now! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 Claim your <b>{{count}}</b> $Next tokens, <i>{{firstName}}</i>. <b>Log in now</b> to keep earning rewards! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🚨 <b>{{firstName}}</b>, your rewards are waiting! <b>{{count}}</b> $Next tokens are here. <i>Claim now</i> before it’s too late! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🌟 Time’s running out! You have <b>{{count}}</b> $Next tokens waiting, <i>{{firstName}}</i>. <u>Log in now</u> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🔥 Don’t let these <b>{{count}}</b> $Next tokens slip away, <i>{{firstName}}</i>. Log in now to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🚀 Boost your balance today, <b>{{firstName}}</b>! <b>{{count}}</b> $Next tokens are ready. <i>Claim now</i> to power up your game! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "✨ Log in now, <b>{{firstName}}</b>! <b>{{count}}</b> $Next tokens are waiting for you. Don’t miss out! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "⚡ Claim your <b>{{count}}</b> $Next tokens, <i>{{firstName}}</i>. <u>Hurry up!</u> They’re waiting for you! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎉 Congratulations, <b>{{firstName}}</b>! You’ve got <b>{{count}}</b> $Next tokens waiting! <i>Log in</i> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🚨 Attention, <b>{{firstName}}</b>! You’ve earned <b>{{count}}</b> $Next tokens. Log in now to claim them before time runs out! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🌈 It’s time to claim your <b>{{count}}</b> $Next tokens, <i>{{firstName}}</i>. <u>Log in now</u> to grab them! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🔥 Big rewards waiting! <b>{{firstName}}</b>, you’ve got <b>{{count}}</b> $Next tokens. <i>Log in now</i> and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 Claim your <b>{{count}}</b> $Next tokens, <b>{{firstName}}</b>. <i>Don't let them expire</i>! Log in now! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "⏰ Time’s ticking, <b>{{firstName}}</b>! You’ve got <b>{{count}}</b> $Next tokens. <i>Claim them now</i> before it’s too late! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎉 <b>{{count}}</b> $Next tokens waiting for you, <b>{{firstName}}</b>! <i>Claim now</i> and keep your balance growing! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "⚡ Quick, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are available for a limited time! <i>Claim now</i> before they disappear! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🚀 Don’t miss this, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are ready for you. <i>Claim now</i> and keep going! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "💎 It’s time to claim your <b>{{count}}</b> $Next tokens, <i>{{firstName}}</i>. <i>Log in now</i> before they’re gone! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🚨 <b>{{firstName}}</b>, <b>{{count}}</b> $Next tokens are waiting! <i>Log in now</i> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 Time to grab your <b>{{count}}</b> $Next tokens, <b>{{firstName}}</b>! <i>Log in</i> and don’t miss your reward! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "⚡ Get moving, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are ready to be claimed. <i>Don’t wait!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🚨 Act fast! <b>{{firstName}}</b>, your <b>{{count}}</b> $Next tokens are waiting to be claimed. <i>Claim them now</i> before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎉 <b>{{firstName}}</b>, you’ve earned <b>{{count}}</b> $Next tokens. <i>Claim them</i> before they vanish! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>"
  ];


  try {
    // Fetch all users from Firestore
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Filter users whose last claim time is between 13 and 20 hours ago
    const usersToNotify = users.filter(user => {
      const lastClaimTime = user.lastClaimTime;
      if (!lastClaimTime) {
        // If there's no lastClaimTime, we can choose to skip the user
        // or treat it as "never claimed" and consider them for the reminder.
        return false; // Skip users without lastClaimTime
      }      
      const timeSinceLastClaim = currentTime - lastClaimTime;
      // The user can be notified only if the claim button is available again (12 hours passed) + 5 minutes to 5 hours range
      return (
        lastClaimTime &&
        timeSinceLastClaim >= THIRTEEN_HOURS_MS &&
        timeSinceLastClaim < TWENTY_HOURS_MS 
      );
    });

    const batchSize = 30;
    const delay = 1000;

    // Send messages in batches
    for (let i = 0; i < usersToNotify.length; i += batchSize) {
      const batch = usersToNotify.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            // Randomly select a message template and personalize it
            const randomMessage =
              messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
            const personalizedMessage = randomMessage
              .replace('{{firstName}}', user.firstName || 'User')
              .replace('{{count}}', user.count || 0); // Default to 0 if count is unavailable

            // Send the message
            await bot.telegram.sendMessage(user.id, personalizedMessage, {
              reply_markup: JSON.parse(inlineKeyboard),
              parse_mode: 'HTML',
            });
          } catch (err) {
            console.error(`Failed to send reminder to ${user.id}:`, err);
          }
        })
      );

      if (i + batchSize < usersToNotify.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Reminder messages sent successfully' });
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ message: 'Error sending reminders' });
  }
});


 //send messages to users that are incative for 20 to 48 hours
const FORTY_EIGHT_HOURS_MS = ONE_HOUR_MS * 48;

app.post('/api/send-unclaimed-reminder2', async (req, res) => {
  const currentTime = Date.now(); // Get the current time in milliseconds

  // Define 10 message templates
  const messageTemplates = [
    "You received <b>10 $Next</b> reward tokens! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "💰 Your balance: <b>{{count}}</b> $Next<br><br><i>Earn more daily $Next.</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
    "<b>10 $Next</b> credited to your balance💰<br><br><i>Long time no see!</i><br><u>Log in to the game</u> to claim these coins, or they’ll expire in 12 hours. <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🎗Congrats! You mined <b>10 $Next</b> token.<br><br>🔥<i>Don't forget to claim tokens</i> to make room for new tokens. Keep claiming and check <u>daily missions</u> 🦄. <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "Hey <b>{{firstName}}</b>, your balance: <b>{{count}}</b> $Next 💸. <i>Claim now</i> to keep earning! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🎉 Good news, <b>{{firstName}}</b>! You’ve earned <b>10 $Next</b> tokens. Check your balance: <b>{{count}}</b> $Next. <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
    "Time to claim, <b>{{firstName}}</b>! Don’t lose out on <b>10 $Next</b> tokens waiting for you! <a href='https://t.me/nexabit_tap_bot/start'>Claim them here</a>",
    "<b>{{firstName}}</b>, your $Next balance: <b>{{count}}</b>. <u>Log in now</u> to secure your coins before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎁 <b>{{firstName}}</b>, rewards are waiting! You’ve mined <b>10 $Next</b> tokens. Check your balance: <b>{{count}}</b>. <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "Hi <b>{{firstName}}</b>! Your $Next balance is <b>{{count}}</b>. <i>Keep up the streak</i> by claiming your rewards today! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "<b>{{firstName}}</b>, your <b>$Next</b> balance is <b>{{count}}</b>. <i>Don’t miss out!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "<i>Your balance:</i> <b>{{count}}</b> $Next. <u>Log in now</u> to secure them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎉 Congratulations, <b>{{firstName}}</b>! You've earned <b>10 $Next</b> tokens. Don't wait, <u>claim them now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🚨 You've got <b>{{count}}</b> $Next tokens waiting for you! <i>Claim them now</i> before they expire. <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🔥 You mined <b>10 $Next</b> tokens, <b>{{firstName}}</b>! Come claim your reward. <u>Don’t miss out!</u> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎁 Big rewards, <b>{{firstName}}</b>! Your <b>{{count}}</b> $Next tokens are waiting. <i>Log in to claim them</i>. <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "💎 Your balance is growing, <b>{{firstName}}</b>! You’ve got <b>{{count}}</b> $Next tokens waiting. <i>Claim now</i> and keep the streak going! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "<b>{{firstName}}</b>, you’ve got <b>{{count}}</b> $Next tokens ready! <u>Log in to grab them before they expire.</u> <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🌟 Your account is glowing! <b>{{firstName}}</b>, you’ve earned <b>10 $Next</b> tokens. <i>Claim them now!</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "<u>{{firstName}}</u>, your balance: <b>{{count}}</b> $Next. Don't let them expire. <i>Claim now</i> to keep earning more! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🎉 Great news, <b>{{firstName}}</b>! You’ve mined <b>10 $Next</b> tokens. <i>Log in</i> to claim your rewards. <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🔥 Your $Next tokens are waiting, <b>{{firstName}}</b>! You’ve got <b>{{count}}</b> waiting for you. <i>Don’t miss out!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "<u>{{firstName}}</u>, you’ve got <b>{{count}}</b> $Next tokens! <i>Log in now</i> and claim your rewards before they disappear. <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎁 Hey <b>{{firstName}}</b>, rewards are here! You’ve earned <b>10 $Next</b> tokens. <u>Log in now</u> to claim them. <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "<b>{{firstName}}</b>, don’t miss out! You’ve got <b>{{count}}</b> $Next tokens waiting. <u>Claim now</u> and keep earning! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "💰 Your balance: <b>{{count}}</b> $Next. <i>Keep claiming to earn more!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🔥 Time is ticking, <b>{{firstName}}</b>! You’ve got <b>{{count}}</b> $Next tokens waiting. <i>Log in now</i> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎉 <b>{{firstName}}</b>, your rewards are here! You’ve mined <b>10 $Next</b> tokens. <i>Don’t wait</i>, claim them now! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "💎 Congrats, <b>{{firstName}}</b>! You've earned <b>10 $Next</b> tokens. Log in to claim them now! <i>Hurry!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🛡️ <b>{{firstName}}</b>, protect your rewards! You’ve got <b>{{count}}</b> $Next tokens waiting for you. <u>Claim them now</u> before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "<i>Hurry,</i> <b>{{firstName}}</b>, you’ve got <b>{{count}}</b> $Next tokens waiting! Log in now and <u>claim them</u>. <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎉 Congrats! You’ve mined <b>10 $Next</b> tokens, <b>{{firstName}}</b>. <u>Claim now</u> before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🔥 Look what’s waiting for you, <b>{{firstName}}</b>! <b>{{count}}</b> $Next tokens! <i>Claim them now!</i> <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "💰 You’ve earned <b>10 $Next</b> tokens, <b>{{firstName}}</b>. <u>Log in now</u> and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
    "🎁 Good news, <b>{{firstName}}</b>! You’ve mined <b>10 $Next</b> tokens. <i>Claim your rewards today!</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
    "💸 Your balance: <b>{{count}}</b> $Next. <i>Log in to claim your rewards now!</i> <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎉 Your rewards are in! You’ve got <b>{{count}}</b> $Next tokens, <b>{{firstName}}</b>. <i>Claim them now</i> to keep your balance growing. <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "💎 <b>{{firstName}}</b>, your balance is looking good! <b>{{count}}</b> $Next tokens are waiting for you. <u>Claim now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🎉 <b>{{firstName}}</b>, you've earned <b>10 $Next</b> tokens. <i>Log in now</i> to claim them and start mining more! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "💰 <b>{{firstName}}</b>, your balance is <b>{{count}}</b> $Next! <i>Claim your rewards now</i> before they expire. <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 Hey <b>{{firstName}}</b>, your balance is growing! <b>{{count}}</b> $Next tokens are ready for you. <u>Claim them now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "🔥 Congrats, <b>{{firstName}}</b>! Your total balance is <b>{{count}}</b> $Next tokens. <i>Claim them now!</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
    "<u>It’s time to claim</u>, <b>{{firstName}}</b>. Your <b>{{count}}</b> $Next tokens are waiting. <i>Log in now</i> and claim your rewards! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
    "🎉 Woohoo! You’ve earned <b>10 $Next</b> tokens, <b>{{firstName}}</b>. <i>Log in to claim now</i> before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
    "🎁 You’ve got <b>{{count}}</b> $Next tokens waiting, <b>{{firstName}}</b>. <i>Log in now</i> to claim your rewards! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>"
  ];



  // Define the inline keyboard
  const inlineKeyboard = JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
      [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
    ]
  });

  try {
    // Fetch all users from Firestore
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Filter users whose last claim time is greater than 20 hours but less than 48 hours
    const usersToNotify = users.filter(user => {
      const lastClaimTime = user.lastClaimTime;
      if (!lastClaimTime) {
        // If there's no lastClaimTime, we can choose to skip the user
        // or treat it as "never claimed" and consider them for the reminder.
        return false; // Skip users without lastClaimTime
      }      
      const timeSinceLastClaim = currentTime - lastClaimTime;
      return (
        lastClaimTime &&
        timeSinceLastClaim >= TWENTY_HOURS_MS &&
        timeSinceLastClaim < FORTY_EIGHT_HOURS_MS
      );
    });

    const batchSize = 30;
    const delay = 1000;

    // Send messages in batches
    for (let i = 0; i < usersToNotify.length; i += batchSize) {
      const batch = usersToNotify.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            // Randomly select a message template
            const randomMessage =
              messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

            // Personalize the message
            const personalizedMessage = randomMessage
              .replace('{{firstName}}', user.firstName || 'User')
              .replace('{{count}}', user.count || 0); // Use 0 if count is not available

            // Send the message
            await bot.telegram.sendMessage(user.id, personalizedMessage, {
              reply_markup: JSON.parse(inlineKeyboard),
              parse_mode: 'HTML',
            });
          } catch (err) {
            console.error(`Failed to send reminder to ${user.id}:`, err);
          }
        })
      );

      if (i + batchSize < usersToNotify.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Long unclaimed reminder messages sent successfully' });
  } catch (error) {
    console.error('Error sending long unclaimed reminders:', error);
    res.status(500).json({ message: 'Error sending long unclaimed reminders' });
  }
});

//message users who didnt claim between 48 hours to 1 week

const ONE_WEEK_MS = 3600000 * 24 * 7;

app.post('/api/send-unclaimed-reminder3', async (req, res) => {
  const currentTime = Date.now(); // Get the current time in milliseconds

  // Inline keyboard for messages
  const inlineKeyboard = JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
      [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
    ]
  });

  // Define 20 message templates
  const messageTemplates = [
      "🚨 You've been away, <b>{{firstName}}</b>! <u>{{count}}</u> $Next tokens are waiting. <i>Log in now</i> and claim them before they’re gone! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🌟 We miss you, <i>{{firstName}}</i>! Your balance has <b>{{count}}</b> $Next tokens waiting to be claimed. <u>Come back</u> and see what’s new! <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "🎁 <b>{{firstName}}</b>, did you forget? <u>{{count}}</u> $Next tokens are still unclaimed. <i>Log in now</i> to grab them! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "🔥 Time is ticking, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are waiting for you. <i>Claim them</i> before they disappear! <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
      "✨ <b>{{firstName}}</b>, your rewards are growing! <u>{{count}}</u> $Next tokens are waiting to be claimed. <i>Log in</i> and don’t miss out! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "📣 Hey <i>{{firstName}}</i>, <b>{{count}}</b> $Next tokens are here for you! Come back and make the most of your rewards. <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "⏰ It’s been too long, <b>{{firstName}}</b>! Your <u>{{count}}</u> $Next tokens are still here. <i>Log in</i> and claim them today! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "💎 <i>{{firstName}}</i>, don’t let your rewards go to waste! <b>{{count}}</b> $Next tokens are waiting for you. <u>Grab them now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
      "🚀 Long time no see, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are ready. <u>Come back</u> and claim them before it’s too late! <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "🌈 Ready to play again, <u>{{firstName}}</u>? Your balance has <b>{{count}}</b> $Next tokens waiting just for you. <i>Don’t wait</i>! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🎉 Welcome back, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are here to greet you. <u>Log in</u> and claim them now! <a href='https://t.me/nexabit_tap_bot/start'>Rejoin now</a>",
      "⚡ Don’t let <b>{{count}}</b> $Next tokens slip away, <i>{{firstName}}</i>! <u>Log in</u> and get back to the action! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "🛡️ Protect your rewards, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens need your attention. <u>Log in and claim now!</u> <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🌟 Your account is glowing, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are waiting for you. <i>Come back to the app</i>! <a href='https://t.me/nexabit_tap_bot/start'>Rejoin now</a>",
      "🚨 Attention, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are at risk of expiring. <u>Log in and claim them now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🎁 Big rewards await, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are ready for you. <i>Don’t miss out</i>—log in today! <a href='https://t.me/nexabit_tap_bot/start'>Rejoin now</a>",
      "🕒 Time flies, <b>{{firstName}}</b>! <u>{{count}}</u> $Next tokens are waiting for you. Come back now and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
      "💰 Look what’s waiting for you, <i>{{firstName}}</i>! <b>{{count}}</b> $Next tokens. Claim them now before they vanish! <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "🔥 Back to the game, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are here to power up your journey. <u>Log in now</u> and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🎗️ Don’t let <i>{{count}}</i> $Next tokens go unclaimed, <b>{{firstName}}</b>! <u>Log in now</u> and secure your rewards! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "🚨 It’s not too late, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are here waiting for you. <i>Come back and claim them now!</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "🌟 We’ve missed you, <b>{{firstName}}</b>! <u>{{count}}</u> $Next tokens are waiting. Come back and grab them before they expire! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
      "🎁 Your <u>{{count}}</u> $Next tokens are still unclaimed, <i>{{firstName}}</i>! <b>Don’t miss out</b>—log in and claim them now! <a href='https://t.me/nexabit_tap_bot/start'>Rejoin</a>",
      "🔥 Time is running out, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are here. <u>Claim them before they vanish!</u> <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "✨ Your rewards are growing, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are waiting for you. <i>Don’t let them slip away</i>—log in now! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "📣 Exciting things are happening, <i>{{firstName}}</i>! <b>{{count}}</b> $Next tokens are still unclaimed. <u>Log in</u> to grab them now! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "⏰ Hurry, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are waiting. <i>Claim them now</i> before time runs out! <a href='https://t.me/nexabit_tap_bot/start'>Log in</a>",
      "💎 Don’t let your rewards go unclaimed, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are waiting for you. <u>Claim them now</u>! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🚀 It’s time to <b>{{firstName}}</b>, <i>{{count}}</i> $Next tokens are here! <u>Log in</u> and claim your reward today! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "🎉 Time to return, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are waiting. <u>Log in</u> now and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "⚡ You’ve got rewards waiting, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens. <i>Don’t miss them!</i> Log in now! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "🛡️ <b>{{firstName}}</b>, your $Next tokens are still waiting! <i>{{count}}</i> tokens are available. <u>Don’t let them expire</u>—log in now! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
      "🌟 Ready for more, <i>{{firstName}}</i>? Your <b>{{count}}</b> $Next tokens are just a click away. <u>Claim now</u> before they’re gone! <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
      "🚨 Your tokens are waiting, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are still unclaimed. <u>Don’t let them go</u>—log in now! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "🎁 Don’t leave your rewards behind, <i>{{firstName}}</i>! <b>{{count}}</b> $Next tokens are yours to claim. <u>Log in now</u> and grab them! <a href='https://t.me/nexabit_tap_bot/start'>Claim here</a>",
      "🔥 <b>{{firstName}}</b>, your rewards won’t wait forever! <i>{{count}}</i> $Next tokens are still unclaimed. <u>Log in now</u> to grab them! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>",
      "✨ Come back, <i>{{firstName}}</i>! You’ve got <b>{{count}}</b> $Next tokens to claim! <u>Log in</u> now and take them before time runs out! <a href='https://t.me/nexabit_tap_bot/start'>Claim now</a>",
      "📣 Your tokens are still here, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are waiting for you. <u>Log in now</u> to claim them! <a href='https://t.me/nexabit_tap_bot/start'>Rejoin</a>",
      "⏰ The countdown is on, <u>{{firstName}}</u>! <b>{{count}}</b> $Next tokens are waiting for you. <i>Don’t miss out!</i> <a href='https://t.me/nexabit_tap_bot/start'>Log in here</a>",
      "💰 Don’t miss your reward, <b>{{firstName}}</b>! <i>{{count}}</i> $Next tokens are still unclaimed. <u>Come back</u> and claim them! <a href='https://t.me/nexabit_tap_bot/start'>Log in now</a>",
      "🔥 <u>{{firstName}}</u>, it’s time to come back! You’ve got <b>{{count}}</b> $Next tokens waiting for you. <i>Claim them</i> today! <a href='https://t.me/nexabit_tap_bot/start'>Click here</a>"
  ];


  try {
    // Fetch all users from Firestore
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Filter users whose last claim time is more than 48 hours but less than a week ago
    const usersToNotify = users.filter(user => {
      const lastClaimTime = user.lastClaimTime;
      if (!lastClaimTime) {
        // If there's no lastClaimTime, we can choose to skip the user
        // or treat it as "never claimed" and consider them for the reminder.
        return false; // Skip users without lastClaimTime
      }      
      const timeSinceLastClaim = currentTime - lastClaimTime;
      return (
        // The user can be notified only if the claim button is available again (12 hours passed) + 5 minutes to 5 hours range
        lastClaimTime &&
        timeSinceLastClaim > FORTY_EIGHT_HOURS_MS &&
        timeSinceLastClaim < ONE_WEEK_MS
      );
    });

    const batchSize = 30;
    const delay = 1000;

    // Send messages in batches
    for (let i = 0; i < usersToNotify.length; i += batchSize) {
      const batch = usersToNotify.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            // Randomly select a message template and personalize it
            const randomMessage =
              messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
            const personalizedMessage = randomMessage
              .replace('{{firstName}}', user.firstName || 'User')
              .replace('{{count}}', user.count || 0); // Default to 0 if count is unavailable

            // Send the message
            await bot.telegram.sendMessage(user.id, personalizedMessage, {
              reply_markup: JSON.parse(inlineKeyboard),
              parse_mode: 'HTML',
            });
          } catch (err) {
            console.error(`Failed to send long-unclaimed reminder to ${user.id}:`, err);
          }
        })
      );

      if (i + batchSize < usersToNotify.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Long-unclaimed reminder messages sent successfully' });
  } catch (error) {
    console.error('Error sending long-unclaimed reminders:', error);
    res.status(500).json({ message: 'Error sending long-unclaimed reminders' });
  }
});

//message users that didnt claim between 1 week to 30 days

const THIRTY_DAYS_MS = 3600000 * 24 * 30;

app.post('/api/send-unclaimed-reminder4', async (req, res) => {
  const currentTime = Date.now(); // Get the current time in milliseconds

  // Inline keyboard for messages
  const inlineKeyboard = JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
      [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
    ]
  });

  // Define 50 message templates with feature highlights and engaging content
  const messageTemplates = [
      "🚨 <b>{{firstName}}</b>, it's been over a <u>week</u>! <b>{{count}}</b> <a href='https://t.me/nexabit_tap_bot/start'><i>$Next tokens</i></a> are waiting for you. Don't miss out on the <i>new features</i>. Log in now!",
      "🌟 <b>{{firstName}}</b>, you've been away <i>too long</i>! We’ve introduced <a href='https://t.me/nexabit_tap_bot/start'><u>exciting upgrades</u></a>. Your <b>{{count}} $Next tokens</b> are ready. Check it out!",
      "🎉 <i>{{firstName}}</i>, we <b>miss you</b>! <a href='https://t.me/nexabit_tap_bot/start'><b><u>{{count}} $Next tokens</u></b></a> are waiting, and so are <i>new features</i>. Rejoin the fun today!",
      "🔥 Long time no see, <b>{{firstName}}</b>! <i>{{count}} $Next tokens</i> and <u>awesome updates</u> are here. Come back and <a href='https://t.me/nexabit_tap_bot/start'><b>claim your rewards</b></a>!",
      "✨ <b>{{firstName}}</b>, did you <i>hear</i>? We’ve added thrilling <a href='https://t.me/nexabit_tap_bot/start'>new features</a>. Your <u>{{count}} $Next tokens</u> are <i>calling</i>—log in <b>now</b>!",
      "💎 <u>{{firstName}}</u>, we’ve saved <a href='https://t.me/nexabit_tap_bot/start'><b>{{count}} $Next tokens</b></a> just for you! Explore the <i>latest updates</i> and claim your reward <b>today</b>.",
      "⏳ Time flies, <b>{{firstName}}</b>! It’s been over a <u>week</u>. <a href='https://t.me/nexabit_tap_bot/start'><b>{{count}} $Next tokens</b></a> are <i>waiting</i>. Don’t wait—log in now!",
      "📣 Breaking news, <b>{{firstName}}</b>! We’ve launched <i>amazing updates</i>. Your <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are ready—log in and <b>explore them</b>.",
      "🚀 Hey <i>{{firstName}}</i>, it’s <u>reward time</u>! <b>{{count}} $Next tokens</b> and <a href='https://t.me/nexabit_tap_bot/start'><i>exciting features</i></a> await. Don’t miss out!",
      "💰 <u>{{firstName}}</u>, we’ve made it even better for you! <b>{{count}} $Next tokens</b> and <a href='https://t.me/nexabit_tap_bot/start'><i>new updates</i></a> await. Log in and claim them <b>now</b>.",
      "🎁 Surprises await, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and some <u>exciting changes</u> are ready for you. Rejoin now!",
      "⚡ <b>{{firstName}}</b>, you've got <i>unclaimed rewards</i>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are waiting, along with <b>new challenges</b>. Come back today!",
      "🕒 Tick-tock, <b>{{firstName}}</b>! It’s been <u>too long</u>. <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and <b>amazing updates</b> await—log in now.",
      "🌟 <b>{{firstName}}</b>, we’ve missed you! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and <i>exciting features</i> are here for you. Join us again!",
      "🚨 Don’t miss out, <u>{{firstName}}</u>! We’ve saved <b>{{count}} $Next tokens</b> just for you. Explore the <a href='https://t.me/nexabit_tap_bot/start'><i>new updates</i></a> today!",
      "🎉 Time to return, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and <b>thrilling features</b> are ready for you. Log in now!",
      "🔥 We’re back with <i>new missions</i>, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and <i>exciting updates</i> await you.",
      "✨ Your <b>journey</b> continues, <i>{{firstName}}</i>! Claim <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and discover our <b>latest upgrades</b> today.",
      "📣 Big news, <b>{{firstName}}</b>! We’ve added <u>exciting new features</u>. <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> are waiting—don’t miss out!",
      "🚀 <i>{{firstName}}</i>, <b>adventure awaits</b>! Your <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and <b>new updates</b> are ready. Rejoin us today!",
      "💎 Long time no see, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are waiting. We’ve added some <i>incredible updates</i>—log in now!",
      "⏰ Time to return, <u>{{firstName}}</u>! Your <a href='https://t.me/nexabit_tap_bot/start'><b>{{count}} $Next tokens</b></a> and <i>exciting features</i> are here. Log in today!",
      "🎁 Did you know, <b>{{firstName}}</b>? We’ve upgraded your experience. <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are waiting. Claim them now!",
      "⚡ Don’t let your rewards <b>expire</b>, <u>{{firstName}}</u>! <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and <b>thrilling new features</b> await you.",
      "🕒 <b>{{firstName}}</b>, it’s been <i>too long</i>! Rejoin now to claim <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and explore <b>what’s new</b>.",
      "🌟 Ready for action, <b>{{firstName}}</b>? <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and <u>exciting upgrades</u> await. Join us now!",
      "🚀 Big things are happening, <i>{{firstName}}</i>! <b>{{count}} $Next tokens</b> are ready—log in today and explore the <a href='https://t.me/nexabit_tap_bot/start'><u>upgrades</u></a>.",
      "💰 Claim your <b>fortune</b>, <i>{{firstName}}</i>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and <b>exciting updates</b> are waiting. Log in now!",
      "🎉 It’s time, <b>{{firstName}}</b>! Rejoin now to claim <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and discover <b>what’s new</b>.",
      "🔥 Don’t miss out, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> and some <b>exciting updates</b> await. Log in today!",
      "✨ <b>{{firstName}}</b>, we’ve got <i>something special</i> for you! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are ready. Explore the <b>new features</b> now!",
      "⚡ Quick reminder, <u>{{firstName}}</u>: <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> are waiting. Check out the <b>latest upgrades</b> now!",
      "🎁 Your <b>reward</b> is here, <i>{{firstName}}</i>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> await. Log in and discover the <b>new features</b>.",
      "📣 <b>{{firstName}}</b>, it’s time to claim your <i>$Next tokens</i>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> are waiting—don’t wait!",
      "💎 Come back, <u>{{firstName}}</u>! We've saved your <b>{{count}} $Next tokens</b> and <a href='https://t.me/nexabit_tap_bot/start'>exciting updates</a> are ready. Log in today!",
      "⏳ Time to <i>reclaim your rewards</i>, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><u>{{count}} $Next tokens</u></a> and <b>new features</b> await!",
      "🎉 Come see what's new, <b>{{firstName}}</b>! <i>{{count}} $Next tokens</i> and <a href='https://t.me/nexabit_tap_bot/start'><u>exciting upgrades</u></a> are waiting for you.",
      "🔥 Don’t miss your chance, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'><i>{{count}} $Next tokens</i></a> are <b>waiting</b> for you. Log in now!",
      "✨ It’s time, <b>{{firstName}}</b>! <a href='https://t.me/nexabit_tap_bot/start'>{{count}} $Next tokens</a> await. Come back and explore the <i>new features</i>!"
  ];




  try {
    // Fetch all users from Firestore
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Filter users whose last claim time is more than a week but less than 30 days ago
    const usersToNotify = users.filter(user => {
      const lastClaimTime = user.lastClaimTime;
      if (!lastClaimTime) {
        // If there's no lastClaimTime, we can choose to skip the user
        // or treat it as "never claimed" and consider them for the reminder.
        return true; // add users without lastClaimTime
      }      
      const timeSinceLastClaim = currentTime - lastClaimTime;
      return (
        lastClaimTime &&
        timeSinceLastClaim > ONE_WEEK_MS &&
        timeSinceLastClaim <= THIRTY_DAYS_MS
      );
    });

    const batchSize = 30;
    const delay = 1000;

    // Send messages in batches
    for (let i = 0; i < usersToNotify.length; i += batchSize) {
      const batch = usersToNotify.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            // Randomly select a message template and personalize it
            const randomMessage =
              messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
            const personalizedMessage = randomMessage
              .replace('{{firstName}}', user.firstName || 'User')
              .replace('{{count}}', user.count || 0); // Default to 0 if count is unavailable

            // Send the message
            await bot.telegram.sendMessage(user.id, personalizedMessage, {
              reply_markup: JSON.parse(inlineKeyboard),
              parse_mode: 'HTML',
            });
          } catch (err) {
            console.error(`Failed to send long-unclaimed reminder to ${user.id}:`, err);
          }
        })
      );

      if (i + batchSize < usersToNotify.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(200).json({ message: 'Long-unclaimed reminder messages sent successfully' });
  } catch (error) {
    console.error('Error sending long-unclaimed reminders:', error);
    res.status(500).json({ message: 'Error sending long-unclaimed reminders' });
  }
});



//Immediate to 5 hours reminder to claim

const FIVE_MINUTES_MS = 300000;  // 5 minutes in milliseconds
const FIVE_HOURS_MS = 18000000;  // 5 hours in milliseconds

app.post('/api/send-unclaimed-reminder5', async (req, res) => {
  const currentTime = Date.now(); // Get the current time in milliseconds

  // Inline keyboard for messages
  const inlineKeyboard = JSON.stringify({
    inline_keyboard: [
      [{ text: '🚀 Open App', url: 'https://t.me/NexaBit_Tap_bot/start' }],
      [{ text: '🌐 Join Group', url: 'https://t.me/nexabitHQ' }]
    ]
  });

  // Define 50 message templates
  const messageTemplates = [
    "🎉 <b>{{firstName}}</b>, you have <b>{{count}} $Next tokens</b> available to claim now! Don't miss out on your daily claim—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🚨 Hey <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are ready to be claimed today! It's available now, <a href='https://t.me/NexaBit_Tap_bot/start'>claim now</a>!",
    "⏳ Claim is available now, <i>{{firstName}}</i>! You have <b>{{count}} $Next tokens</b> to claim today. Don’t wait, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Here</a>!",
    "🔥 Your <b>{{count}} $Next tokens</b> are available to claim today! Time is ticking, <i>{{firstName}}</i>—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "🌐 <i>{{firstName}}</i>, your daily claim is available today! You've got <b>{{count}} $Next tokens</b> to grab. Hurry up! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🚀 Don’t miss out, <b>{{firstName}}</b>! You have <i>{{count}} $Next tokens</i> available to claim now. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "💎 <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are waiting to be claimed today! Don’t let them slip away. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎁 Claim available now, <i>{{firstName}}</i>! You’ve got <b>{{count}} $Next tokens</b> to grab today. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim them here</a>!",
    "⚡ Hey <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are available to claim now. Act fast, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>!",
    "🌟 <i>{{firstName}}</i>, your <b>{{count}} $Next tokens</b> are waiting to be claimed! Available now, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Here</a>!",
    "⏰ It’s time to claim, <b>{{firstName}}</b>! You’ve got <i>{{count}} $Next tokens</i> to claim today. Hurry before time runs out! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🔥 Your <b>{{count}} $Next tokens</b> are available for claim today! Come back and <a href='https://t.me/NexaBit_Tap_bot/start'>claim them now</a>!",
    "💰 Don't forget, <i>{{firstName}}</i>! You have <b>{{count}} $Next tokens</b> waiting to be claimed today. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎉 Claim available now, <b>{{firstName}}</b>! Your <i>{{count}} $Next tokens</i> are waiting. Don’t miss out! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Here</a>",
    "💎 <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are available today! Come and <a href='https://t.me/NexaBit_Tap_bot/start'>claim them</a> now!",
    "🌟 Your <b>{{count}} $Next tokens</b> are waiting for you, <i>{{firstName}}</i>! Available now, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>!",
    "🎁 <b>{{firstName}}</b>, your daily claim is available today! You’ve got <i>{{count}} $Next tokens</i> ready to claim. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "⏳ <i>{{firstName}}</i>, don’t miss your <b>{{count}} $Next tokens</b> that are available for claim today! Time is running out, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "⚡ Quick reminder, <b>{{firstName}}</b>! Your <i>{{count}} $Next tokens</i> are available for claim today. Don’t wait, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>!",
    "🚀 Your <b>{{count}} $Next tokens</b> are available now to claim, <i>{{firstName}}</i>! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "🎉 Don’t forget, <i>{{firstName}}</i>! You’ve got <b>{{count}} $Next tokens</b> waiting to be claimed today. Hurry up and <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>!",
    "⏳ You have <b>{{count}} $Next tokens</b> available for claim now, <i>{{firstName}}</i>. Don't wait too long—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim Here</a>!",
    "🔥 Limited time offer! Your <b>{{count}} $Next tokens</b> are available for claim today, <i>{{firstName}}</i>. Hurry, <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>!",
    "🚨 Time is running out! <i>{{firstName}}</i>, <b>{{count}} $Next tokens</b> are available to claim today. Claim them before it's too late! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "💎 <i>{{firstName}}</i>, your <b>{{count}} $Next tokens</b> are ready to be claimed. Don’t let them go to waste—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim Here</a>!",
    "⚡ Quick, <b>{{firstName}}</b>! You’ve got <i>{{count}} $Next tokens</i> available now. Don’t wait—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "⏰ Reminder: Your <b>{{count}} $Next tokens</b> are available to claim, <i>{{firstName}}</i>! Act now! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎉 Don't miss out on your <b>{{count}} $Next tokens</b>, <i>{{firstName}}</i>! Claim them today <a href='https://t.me/NexaBit_Tap_bot/start'>here</a>!",
    "🚀 Your <b>{{count}} $Next tokens</b> are waiting, <i>{{firstName}}</i>! Claim them today before time runs out! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🌟 You’ve got <b>{{count}} $Next tokens</b> to claim today, <i>{{firstName}}</i>! Don’t wait—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎁 Act fast! Your <b>{{count}} $Next tokens</b> are available now, <i>{{firstName}}</i>—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim them here</a>!",
    "💰 It’s time to claim, <b>{{firstName}}</b>! Your <i>{{count}} $Next tokens</i> are available. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🔥 Time to claim your <b>{{count}} $Next tokens</b>, <i>{{firstName}}</i>! Hurry! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🚨 Claim your <b>{{count}} $Next tokens</b>, <i>{{firstName}}</i>! Time is running out! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🌐 Your <b>{{count}} $Next tokens</b> are available today, <i>{{firstName}}</i>! Don't miss them. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "💎 Hey <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are waiting to be claimed! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎉 <i>{{firstName}}</i>, your <b>{{count}} $Next tokens</b> are available to claim! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🔥 <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are available for claim today! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "⚡ Don’t miss your <b>{{count}} $Next tokens</b>, <i>{{firstName}}</i>! <a href='https://t.me/NexaBit_Tap_bot/start'>Claim them now</a>!",
    "🎁 Your <b>{{count}} $Next tokens</b> are available for you, <i>{{firstName}}</i>! Claim them now. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "⏳ <b>{{firstName}}</b>, your <i>{{count}} $Next tokens</i> are waiting for you! Claim them before they expire. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "💰 Don’t wait, <i>{{firstName}}</i>! Claim your <b>{{count}} $Next tokens</b> now—<a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>",
    "🎉 It’s your time to claim, <i>{{firstName}}</i>! <b>{{count}} $Next tokens</b> available now. <a href='https://t.me/NexaBit_Tap_bot/start'>Claim Now</a>"
  ];

  try {
    // Fetch all users from Firestore
    const usersSnapshot = await firestore.collection(collectionName).get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    // Filter users whose last claim time is between 5 minutes and 5 hours ago
    const usersToNotify = users.filter(user => {
      const lastClaimTime = user.lastClaimTime;
      if (!lastClaimTime) {
        return false; // No claim time means user can be notified
      }
      const timeSinceLastClaim = currentTime - lastClaimTime;
      // The user can be notified only if the claim button is available again (12 hours passed) + 5 minutes to 5 hours range
      return timeSinceLastClaim >= TWELVE_HOURS_MS + FIVE_MINUTES_MS &&
        timeSinceLastClaim <= TWELVE_HOURS_MS + FIVE_HOURS_MS;
    });

    const batchSize = 30;
    const delay = 1000;

    // Send messages in batches
    for (let i = 0; i < usersToNotify.length; i += batchSize) {
      const batch = usersToNotify.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (user) => {
          try {
            // Randomly select a message template and personalize it
            const randomMessage = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
            const personalizedMessage = randomMessage
              .replace('{{firstName}}', user.firstName || 'User')
              .replace('{{count}}', user.count || 0); // Default to 0 if count is unavailable

            // Send the message
            await bot.telegram.sendMessage(user.id, personalizedMessage, {
              reply_markup: JSON.parse(inlineKeyboard),
              parse_mode: 'HTML',
            });
          } catch (err) {
            console.error(`Failed to send claim reminder to ${user.id}:`, err);
          }
        })
      );

      if (i + batchSize < usersToNotify.length) {
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before sending the next batch
      }
    }

    res.status(200).send('Claim reminders sent successfully!');
  } catch (error) {
    console.error('Error sending claim reminders:', error);
    res.status(500).send('Error sending claim reminders.');
  }
});

const storage = new Storage();
const bucketName = 'xrp-token-images';
const bucket = storage.bucket(bucketName);

app.post('/api/get-upload-url', async (req, res) => {
    try {
        const { fileName, contentType } = req.body;

        // Generate a unique filename if a file with the same name exists
        const file = bucket.file(fileName);
        const [exists] = await file.exists();
        let uniqueFileName = fileName;

        if (exists) {
            const timestamp = Date.now();
            uniqueFileName = `${timestamp}_${fileName}`;
        }

        const fileToUpload = bucket.file(uniqueFileName);

        // Generate a signed URL for uploading
        const [url] = await fileToUpload.getSignedUrl({
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType,
        });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

        console.log("Generated Signed URL:", url);
        console.log("Expected Public URL:", publicUrl);

        res.json({ uploadUrl: url, publicUrl });

    } catch (error) {
        console.error("Error generating upload URL:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/store-metadata", async (req, res) => {
    try {
        const { tokenName, tokenSymbol, tokenDescription, totalSupply, tokenImage, website, twitter, telegram, issuerData, walletAddress, ISSUER_WALLET } = req.body;

        if (!tokenName || !tokenSymbol) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const metadata = {
            currency: tokenSymbol,
            issuer: issuerData.classicAddress,
            meta: {
                token: {
                    name: tokenName,
                    description: tokenDescription,
                    icon: tokenImage,
                    self_assessment: true,
                    asset_class: "cryptocurrency",
                    trust_level: 3,
                    WEBLINKS: [
                        ...(website ? [{ url: website, type: "info", title: "Official Website" }] : []),
                        ...(twitter ? [{ url: twitter, type: "socialmedia" }] : []),
                        ...(telegram ? [{ url: telegram, type: "community" }] : [])
                    ]
                },
                issuer: {
                    name: "NexaBit Lab",
                    description: "The AI agent that unites all networks",
                    domain: "nexabit.xyz",
                    icon: "https://storage.googleapis.com/xrp-token-images/logo.png",
                    kyc: true,
                    trust_level: 3,
                    issuerData,
                    security: ISSUER_WALLET,
                    distributor: walletAddress,
                    WEBLINKS: [
                        { url: "https://nexabit.xyz", type: "info", title: "NexaBit Lab" },
                        { url: "https://x.com/nexabitHQ", type: "socialmedia" },
                        { url: "https://t.me/nexabitHQ", type: "community" }
                    ]
                }
            },
            metrics: {
                trustlines: 0,
                holders: 0,
                supply: totalSupply.toString(),
                marketcap: "0",
                price: "0",
                volume_24h: "0",
                volume_7d: "0",
                exchanges_24h: "0",
                exchanges_7d: "0",
                takers_24h: "0",
                takers_7d: "0"
            }
        };

        // Ensure unique filename
        let fileName = `${tokenSymbol.toLowerCase()}_metadata.json`;
        let file = bucket.file(fileName);
        const [exists] = await file.exists();
        if (exists) {
            let timestamp = Date.now();
            fileName = `${tokenSymbol.toLowerCase()}_${timestamp}_metadata.json`;
            file = bucket.file(fileName);
        }
        await file.save(JSON.stringify(metadata, null, 2), { contentType: "application/json" });
        const publicUrl = `https://nexabit.xyz/${fileName}`;

        // Retrieve existing .toml data
        const tomlFile = bucket.file(".well-known/xrp-ledger.toml");
        let tomlData = { ISSUERS: [], TOKENS: [] };

        try {
            const [tomlExists] = await tomlFile.exists();
            if (tomlExists) {
                const [contents] = await tomlFile.download();
                tomlData = toml.parse(contents.toString());

                console.log("Existing TOML data:", JSON.stringify(tomlData, null, 2));

                if (!Array.isArray(tomlData.TOKENS)) {
                    console.warn("TOKENS section is missing or invalid. Initializing as an empty array.");
                    tomlData.TOKENS = [];
                }
            }
        } catch (err) {
            console.warn("No existing .toml file found, creating a new one.");
        }

        // Ensure issuer exists
        let issuerEntry = tomlData.ISSUERS.find(acc => acc.address === issuerData.classicAddress);

        if (!issuerEntry) {
            issuerEntry = {
                address: issuerData.classicAddress,
                name: "NexaBit Lab",
                description: "The AI agent that unites all networks",
                icon: "https://storage.googleapis.com/xrp-token-images/logo.png",
                WEBLINKS: [
                    { url: "https://nexabit.xyz", type: "info", title: "NexaBit Lab" },
                    { url: "https://x.com/nexabitHQ", type: "socialmedia" },
                    { url: "https://t.me/nexabitHQ", type: "community" }
                ]
            };
            tomlData.ISSUERS.push(issuerEntry);
        }

        // Add token entry
        tomlData.TOKENS.push({
            currency: metadata.currency,
            issuer: issuerData.classicAddress,
            name: metadata.meta.token.name,
            desc: metadata.meta.token.description,
            icon: metadata.meta.token.icon,
            asset_class: "cryptocurrency",
            WEBLINKS: metadata.meta.token.WEBLINKS
        });

        console.log("Updated TOKENS section:", JSON.stringify(tomlData.TOKENS, null, 2));

        // Convert JSON to TOML and save
        const newTomlContent = tomlify.toToml(tomlData, { space: 2 });
        console.log("Final TOML content:\n", newTomlContent);
        await tomlFile.save(newTomlContent, { contentType: "text/plain" });

        res.json({ 
            message: "Metadata stored successfully", 
            metadataUrl: publicUrl, 
            tomlData,
            debugLogs: {
                generatedMetadata: metadata,
                updatedTokens: tomlData.TOKENS,
                finalTomlContent: newTomlContent
            }
        });
    } catch (error) {
        console.error("Error storing metadata:", error);
        res.status(500).json({ error: error.message });
    }
});


async function getSecret(secretName) {
    const [version] = await secretClient.accessSecretVersion({
        name: `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString("utf8");
}

function decryptSeed(encryptedSeed, encryptionKey) {
    const iv = Buffer.from(encryptedSeed.slice(0, 32), "hex");
    const encryptedText = Buffer.from(encryptedSeed.slice(32), "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(encryptionKey, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

app.post("/sign-transaction", async (req, res) => {
    try {
        const { destination } = req.body;

        if (!destination) {
            return res.status(400).json({ success: false, error: "Destination address is required." });
        }

        // Retrieve and decrypt the fee wallet seed
        const encryptedSeed = await getSecret("FEE_ACCOUNT_ENCRYPTED_SEED");
        const encryptionKey = await getSecret("ENCRYPTION__KEY");
        let feeWalletSeed = decryptSeed(encryptedSeed, encryptionKey);

        const feeWallet = xrpl.Wallet.fromSeed(feeWalletSeed);
        feeWalletSeed = null; // Clear from memory

        const TRANSFER_AMOUNT = "1200000"; // 1.2 XRP in drops

        const transferTx = {
            TransactionType: "Payment",
            Account: feeWallet.classicAddress,
            Destination: destination,
            Amount: TRANSFER_AMOUNT,
            Flags: 2147483648,
        };

        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();
        const signedTx = await client.submitAndWait(transferTx, { wallet: feeWallet });
        client.disconnect();

        res.json({
            success: true,
            tx: signedTx,
            feeWalletAddress: feeWallet.classicAddress,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});






export default app;
