const express = require('express');
const router = express.Router();
const {
    authenticateUser,
} = require('../middleware/authentication');

const {
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
} = require('../controllers/userController');

router.get('/get/:userid', authenticateUser, getUser);
router.get('/friends/:userid', authenticateUser, getAllFriends);
router.get('/ranking/:userid/:type', authenticateUser, getLeaderboard);
router.get('/count/all', authenticateUser, getAllUserCount);

router.get('/items',authenticateUser, getItems);
router.post('/buyMarble',authenticateUser, buyMarble);
router.post('/payMarble',authenticateUser,payMarble);
router.post('/winMarble',authenticateUser,winMarble);

router.post('/connect_wallet', authenticateUser, connectWallet);
router.post('/jointg', authenticateUser, joinTelegram);
router.post('/followX', authenticateUser, followX);
router.post('/tweet', authenticateUser, retweet);
router.post('/subscribe_youtube', authenticateUser, subscribe_youtube);
router.post('/visit_website', authenticateUser, visit_website);
router.post('/follow', authenticateUser, follow_task_do);
router.get('/avatar/:userid', getAvatarImage);
router.post('/claim/daily', authenticateUser, claimDailyReward);


module.exports = router;
