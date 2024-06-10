const AWS = require('aws-sdk');

// Configure the region
AWS.config.update({ region: 'us-east-2' });

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.REACT_APP_DYNAMODB_TABLE || 'TapUsers';

const addUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };

  try {
    await dynamodb.put(params).promise();
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const getUser = async (username) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
    },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error('Error getting user:', error);
  }
};

const updateUser = async (username, updateData) => {
  const updateExpression = 'set ';
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updateData).forEach((key, index) => {
    updateExpression += `#${key} = :${key}`;
    if (index < Object.keys(updateData).length - 1) {
      updateExpression += ', ';
    }
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = updateData[key];
  });

  const params = {
    TableName: TABLE_NAME,
    Key: {
      username: username,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.update(params).promise();
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
};
