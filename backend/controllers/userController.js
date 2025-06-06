const fs = require('fs');
const path = require('path');
const { StatusCodes } = require('http-status-codes');


const User = require('../models/User');
const Follow = require('../models/Follow');
const Item = require('../models/Item');

const logger = require('../helper/logger');
const { BONUS, TELEGRAM, LEADERBOARD_SHOW_USER_COUNT } = require('../helper/constants');
const { isUserTGJoined } = require('../helper/botHelper');
const cronJob = require('../cron/transactions');

const getUser = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid });
  res.status(StatusCodes.OK).json(user);
}

const getAllFriends = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    logger.error(`cannot find userid=${userid}`);
    return res.status(StatusCodes.OK).json({});
  }
  const user = await User.findOne({ userid }).populate('friends').select('friends');

  res.status(StatusCodes.OK).json(user);
};

const getAllUserCount = async (req, res) => {
  const userCount = await User.countDocuments();
  res.status(StatusCodes.OK).json({ count: userCount });
};

const getItems = async (req, res) => {
  const items = await Item.find({ visible: true }).sort({ price: 1 });
  res.status(StatusCodes.OK).json({ success: true, items });
}

const buyMarble = async (req, res) => {
  // const { userid } = req.body;

  const result = await cronJob.run();

  // const user = await User.findOne({ userid });
  // if (!user) return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });

  res.status(StatusCodes.OK).json({ success: result })
}

const payMarble = async (req, res) => {
  const { userid, balance } = req.body;
  const user = await User.findOne({ userid });
  user.balance -= balance;
  user.tge = user.balance * 2;
  user.save()
  res.status(StatusCodes.OK).json({ success: true, user })
}

const winMarble = async (req, res) => {
  const { userid, balance } = req.body;
  const user = await User.findOne({ userid });
  user.balance += balance;
  user.tge = user.balance * 2;
  user.save()
  res.status(StatusCodes.OK).json({ success: true, user })
}

const connectWallet = async (req, res) => {
  const { userid } = req.body;
  var user = await User.findOne({ userid });
  if (user) {
    if (user.walletConnected) {
      return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }
    user.walletConnected = true;
    const bonus = BONUS.WALLET_CONNECT;
    user.balance += bonus;

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received wallet connect bonus', balance: user.balance, bonus: bonus });
  }
  return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
}

const joinTelegram = async (req, res) => {
  const { userid, type } = req.body;
  var user = await User.findOne({ userid });
  if (user) {
    const isDBTGJoined = type == 'channel' ? user.telegramChannelJoined : user.telegramGroupJoined;
    if (isDBTGJoined) {
      return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'already received!' });
    }
    const isTGJoined = await isUserTGJoined(userid, type == 'channel' ? TELEGRAM.CHANNEL_ID : TELEGRAM.GROUP_ID);
    if (!isTGJoined) {
      return res.status(StatusCodes.OK).json({ success: false, status: 'notyet', msg: `not joined telegram ${type} yet!` });
    }
    var bonus = 0;
    if (type == 'channel') {
      bonus = BONUS.JOIN_TG_CHANNEL;
      user.telegramChannelJoined = true;
    } else {
      bonus = BONUS.JOIN_TG_GROUP;
      user.telegramGroupJoined = true;
    }
    user.balance += bonus;

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'received telegram joined bonus', balance: user.balance, bonus: bonus });
  }
  return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'there is no userid!' });
};
const followX = async (req, res) => {
  const { userid, username } = req.body;
  if (!username || username == '') {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
  }
  var user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
  }

  if (user.xFollowed) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
  }

  var follow = await Follow.findOne({ userid, platform: 'X' });
  if (!follow) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not follow yet!' });
  }
  follow.username = username;
  await follow.save();

  user.xFollowed = true;
  user.balance += BONUS.FOLLOW_X_ACCOUNT;

  await user.save();
  return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received follow X bonus', balance: user.balance, bonus: BONUS.FOLLOW_X_ACCOUNT });
};

const retweet = async (req, res) => {
  const { userid, username } = req.body;

  if (!username || username == '') {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
  }

  var user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
  }
  if (user.xTweet) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
  }

  var follow = await Follow.findOne({ userid, platform: 'Tweet' });
  if (!follow) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not tweet @Onion yet!' });
  }
  follow.username = username;
  await follow.save();

  user.xTweet = true;
  user.balance += BONUS.RETWEET_POST;

  await user.save();
  return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'received visit website bonus', balance: user.balance, bonus: BONUS.RETWEET_POST });
};

const subscribe_youtube = async (req, res) => {
  const { userid, username } = req.body;

  if (!username || username == '') {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
  }

  var user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
  }

  if (user.youtubeSubscribed) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
  }

  var follow = await Follow.findOne({ userid, platform: 'YouTube' });
  if (!follow) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not subscribe yet!' });
  }
  follow.username = username;
  await follow.save();

  user.youtubeSubscribed = true;
  user.balance += BONUS.SUBSCRIBE_YOUTUBE;

  await user.save();
  return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'received subscribe youtube bonus', balance: user.balance, bonus: BONUS.SUBSCRIBE_YOUTUBE });
};

const visit_website = async (req, res) => {
  const { userid } = req.body;
  const username = "test";

  if (!username || username == '') {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
  }

  var user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
  }
  if (user.visitWebSite) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
  }

  var follow = await Follow.findOne({ userid, platform: 'Site' });
  if (!follow) {
    follow = await Follow.create({
      userid,
      platform: 'Site'
    });
  }
  follow.username = username;
  await follow.save();

  user.visitWebSite = true;
  user.balance += BONUS.VISIT_WEBSITE;

  await user.save();
  return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received visit website bonus', balance: user.balance, bonus: BONUS.VISIT_WEBSITE });
};

const follow_task_do = async (req, res) => {
  const { userid, platform } = req.body;

  var follow = await Follow.findOne({ userid, platform });
  if (follow) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already followed!' });
  }
  follow = await Follow.create({
    userid,
    platform
  });
  return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Follow success!' });
};

const getAvatarImage = (req, res) => {
  const { userid } = req.params;
  const url = path.join(__dirname, '..', 'uploads/avatars', userid + '.jpg');
  const isExist = fs.existsSync(url);
  if (isExist) {
    res.sendFile(url);
  }
  else res.sendFile(path.join(__dirname, '..', 'uploads/avatars', 'default.png'));
}

const claimDailyReward = async (req, res) => {
  const oneDay = 24 * 60 * 60 * 1000;
  try {
    const { userid } = req.body;
    const user = await User.findOne({ userid });

    if (!user) {
      return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Can not find user!' });
    }

    const now = new Date();
    const lastRewardDate = user.lastRewardDate || new Date(0);

    const timeSinceLastReward = now - lastRewardDate;

    const isConsecutiveDay = timeSinceLastReward < 2 * oneDay;
    user.rewardStreak = isConsecutiveDay ? (user.rewardStreak + 1) : 1;
    const reward = BONUS.DAILY_REWARD * user.rewardStreak;

    var status = 'notyet';
    if (timeSinceLastReward >= oneDay) {
      user.balance += reward;
      user.lastRewardDate = now;
      if (req.body.status == 1) {
        await user.save();
        status = 'success';
        console.log('Daily reward claimed successfully');
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        status,
        reward,
        ms: req.body.status == 1 ? oneDay : 0,
      });
    } else {
      const ms = oneDay - timeSinceLastReward;
      return res.status(StatusCodes.OK).json({ success: true, ms, status, reward });
    }
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return res.status(StatusCodes.OK).json({ success: false, status: 'error', msg: 'Server unknown error!' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { userid, type } = req.params;
    var users = [];
    const self = await User.findOne({ userid }).select('-password');
    var rank = -1;
    if (type == "week") {
      users = await User.find({}).sort({ weeklyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ weeklyScore: { $gt: self.weeklyScore } });
    } else if (type == "month") {
      users = await User.find({}).sort({ monthlyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ monthlyScore: { $gt: self.monthlyScore } });
    } else if (type == "total") {
      users = await User.find({}).sort({ totalScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ totalScore: { $gt: self.totalScore } });
    }
    return res.status(StatusCodes.OK).json({ users, rank: rank + 1, self });

  } catch (error) {
    console.log("getLeaderboard error=", error);
  }
}

module.exports = {
  getUser,
  getAllFriends,
  getLeaderboard,
  getAllUserCount,

  connectWallet,
  joinTelegram,
  followX,
  retweet,
  subscribe_youtube,
  visit_website,
  follow_task_do,

  getAvatarImage,

  claimDailyReward,

  getItems,
  buyMarble,
  payMarble,
  winMarble
};
