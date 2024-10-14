const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userid: { type: String, unique: true, required: [true, 'Please provide telegram id'] },
  username: { type: String, default: '' },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  inviter: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },
  walletConnected: { type: Boolean, default: false },
  telegramChannelJoined: { type: Boolean, default: false },
  telegramGroupJoined: { type: Boolean, default: false },
  xFollowed: { type: Boolean, default: false },
  xTweet: { type: Boolean, default: false },
  
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  token: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  tge: {type:Number, default: 1000},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
