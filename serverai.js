import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import keepAlive from './keepAlive.js'; // Import the keep-alive function
import { NlpManager } from 'node-nlp'; // Import NlpManager from node-nlp
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION || 'TapUsers';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TELEGRAM_TOKEN);

const manager = new NlpManager({ languages: ['en'] }); // Initialize NlpManager

const modelPath = './model.nlp';

// Check if the file is a valid JSON
const isValidJson = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
};

const loadModel = async () => {
  if (fs.existsSync(modelPath) && isValidJson(modelPath)) {
    manager.load(modelPath);
  } else {
    // Add training data
    manager.addDocument('en', 'goodbye for now', 'greetings.bye');
    manager.addDocument('en', 'bye bye take care', 'greetings.bye');
    manager.addDocument('en', 'okay see you later', 'greetings.bye');
    manager.addDocument('en', 'bye for now', 'greetings.bye');
    manager.addDocument('en', 'i must go', 'greetings.bye');
    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', 'hi', 'greetings.hello');
    manager.addDocument('en', 'howdy', 'greetings.hello');

    // Train also the NLG
    manager.addAnswer('en', 'greetings.bye', 'Till next time');
    manager.addAnswer('en', 'greetings.bye', 'see you soon!');
    manager.addAnswer('en', 'greetings.hello', 'Hey there!');
    manager.addAnswer('en', 'greetings.hello', 'Greetings!');

    await manager.train();
    manager.save(modelPath);
  }
};

// Load the model
(async () => {
  await loadModel();
  console.log('NLP model loaded or trained');
})();

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${server.address().port}`);
  bot.launch();
  console.log('Bot launched');
  keepAlive();
});

const generateReferralLink = (userId) => `https://t.me/TapLengendBot?start=${userId}`;

const removeUndefinedValues = (obj) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null));

const saveOrUpdateUser = async (user) => {
  if (!user.id) {
    console.error('Cannot save or update user without id');
    return;
  }
  try {
    const sanitizedUser = removeUndefinedValues(user);
    await firestore.collection(collectionName).doc(user.id).set(sanitizedUser, { merge: true });
    console.log('User saved or updated:', user);
  } catch (error) {
    console.error('Error saving or updating user:', error);
  }
};

const saveReferral = async (referral) => {
  try {
    const referrerDoc = firestore.collection('Referrals').doc(referral.referrerId);
    await referrerDoc.set({
      referredUsers: Firestore.FieldValue.arrayUnion(referral.userId)
    }, { merge: true });
    console.log('Referral saved:', referral);
    await rewardUser(referral.referrerId);
  } catch (error) {
    console.error('Error saving referral:', error);
  }
};

const getUserById = async (userId) => {
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

const rewardUser = async (referrerId) => {
  try {
    const user = await getUserById(referrerId);
    if (user) {
      user.count = (user.count || 0) + 5000; // Example reward count
      await saveOrUpdateUser(user);
      console.log('User rewarded:', referrerId, 'New count:', user.count);
    } else {
      console.error('Referrer not found:', referrerId);
    }
  } catch (error) {
    console.error('Error rewarding user:', error);
  }
};

// Function to handle start command and send welcome message
const handleStartCommand = async (ctx) => {
  const userId = ctx.from.id.toString();
  const referrerId = ctx.startPayload ? ctx.startPayload.toString() : null;
  const username = ctx.from.username;
  const isBot = ctx.from.is_bot;
  const isPremium = ctx.from.is_premium || false;
  const firstName = ctx.from.first_name;
  const timestamp = Firestore.FieldValue.serverTimestamp();
  const referralLink = generateReferralLink(userId);

  // Send the welcome message to the user with inline buttons immediately
  await ctx.replyWithHTML(
    `Hey ${firstName}, Welcome to Nexabit.\nAn L1 that leverages the taps to train AI,\n
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

  // Proceed with processing the user and referrals asynchronously
  (async () => {
    console.log('Bot start command received:', { userId, referrerId, username, isBot, isPremium, firstName, timestamp, referralLink });

    let user = await getUserById(userId);
    if (!user) {
      user = {
        id: userId,
        username,
        isBot,
        isPremium,
        firstName,
        timestamp,
        count: 0,
        referralLink // Save the referral link in the user data
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
  })();
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
  const user = req.body;
  console.log('POST /user request received:', user);
  await saveOrUpdateUser(user);
  res.status(201).send(user);
  console.log('User added via REST endpoint:', user);
});

app.post('/referral', async (req, res) => {
  const referral = req.body;
  console.log('POST /referral request received:', referral);
  await saveReferral(referral);
  res.status(201).send(referral);
  console.log('Referral added via REST endpoint:', referral);
});

app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('GET /user/:id request received for ID:', userId);
  const user = await getUserById(userId);
  if (user) {
    res.send(user);
    console.log('User fetched by ID:', userId, 'Result:', user);
  } else {
    res.status(404).send('User not found');
    console.log('User not found by ID:', userId);
  }
});

app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('PUT /user/:id request received for ID:', userId, 'with data:', req.body);
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

app.get('/checkref', async (req, res) => {
  const userId = req.query.userId; // Use the appropriate method to get userId
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
        const referredUserDoc = await firestore.collection(collectionName).doc(referredUserId).get();
        if (referredUserDoc.exists && referredUserDoc.data().count >= 100) {
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

// Add this route to log IP addresses and update DAU
app.post('/log-ip', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userId = req.body.userId; // Assuming userId is sent in the request body

  // Debug log for userId
  console.log('Received log-ip request with userId:', userId);

  // Check if userId is valid
  if (!userId) {
    console.error('Invalid userId:', userId);
    res.status(400).send('Invalid userId');
    return;
  }

  // Ensure userId is a string
  const userIdStr = userId.toString();

  try {
    const userDocRef = firestore.collection(collectionName).doc(userIdStr);
    const userDoc = await userDocRef.get();
    const currentTime = Firestore.FieldValue.serverTimestamp();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const lastLoginTime = userData.login ? userData.login.toMillis() : 0;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (Date.now() - lastLoginTime < oneDay) {
        await userDocRef.update({
          ip,
          login: currentTime,
          DAU: Firestore.FieldValue.increment(1)
        });
        res.status(200).send('IP logged and DAU updated');
      } else {
        await userDocRef.update({
          ip,
          login: currentTime
        });
        res.status(200).send('IP logged without updating DAU');
      }
    } else {
      await userDocRef.set({
        ip,
        login: currentTime,
        DAU: 1
      });
      res.status(200).send('IP logged and DAU initialized');
    }
  } catch (error) {
    console.error('Error logging IP and updating DAU:', error);
    res.status(500).send('Error logging IP and updating DAU');
  }
});

// Route for generating text using NLP
app.post('/generate-text', async (req, res) => {
  const { question } = req.body;
  try {
    const response = await manager.process('en', question);
    res.json({ response: response.answer });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).send('Error generating text');
  }
});

export default app;
