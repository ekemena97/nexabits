const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  coinsPerTap: { type: Number, default: 1 },
  energyLimit: { type: Number, default: 500 },
  refillRate: { type: Number, default: 300 },
  energy: { type: Number, default: 500 },
  referredUsers: { type: Array, default: [] },
  successfulReferrals: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
