const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE || 'TapUsers';

app.get('/api/user/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  try {
    const params = {
      TableName: tableName,
      Key: { username: uniqueId },
    };
    const response = await dynamoDB.get(params).promise();
    res.json(response.Item || {});
  } catch (error) {
    res.status(500).send('Error fetching user data');
  }
});

app.post('/api/user/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  const user = req.body;
  user.username = uniqueId;
  try {
    const params = {
      TableName: tableName,
      Item: user,
    };
    await dynamoDB.put(params).promise();
    res.send('User data updated successfully');
  } catch (error) {
    res.status(500).send('Error updating user data');
  }
});

module.exports = app;
