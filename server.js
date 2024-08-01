import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import keepAlive from './keepAlive.js'; // Import the keep-alive function
import { getStorageItem, setStorageItem } from '../components/storageHelpers.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION || 'TapUsers';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TELEGRAM_TOKEN);

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
  bot.launch();
  console.log('Bot launched');
  keepAlive();
});

const generateReferralLink = (userId) => `https://t.me/TapLengendBot/start?startapp=${userId}`;

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
    const incrementAmount = referredUser.isPremium ? 10000 : 500;

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
    `Hey ${userInfo.firstName}, Welcome to Nexabit.\nAn L1 that leverages the taps to train AI,\n
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
      
      // Fetch successful referrals
      const successfulReferrals = [];
      for (const referredUserId of referredUsers) {
        const referredUserDoc = await firestore.collection(collectionName).doc(referredUserId.toString()).get(); // Ensure referredUserId is a string
        if (referredUserDoc.exists && referredUserDoc.data().count >= 1000) {
          successfulReferrals.push(referredUserId);
        }
      }
      
      res.send({ 
        referralLink: user.referralLink, 
        referredUsers: referredUsers.map(id => ({ id, success: successfulReferrals.includes(id) })), 
        successfulReferrals: successfulReferrals.length
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


export default app;
