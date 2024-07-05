const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firestore = new Firestore();
const collectionName = process.env.FIRESTORE_COLLECTION || 'TapUsers';

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
    res.status(500).send('Error fetching user data');
  }
});

app.post('/api/user/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  const user = req.body;
  try {
    const userRef = firestore.collection(collectionName).doc(uniqueId);
    await userRef.set(user);
    res.send('User data updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user data');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
