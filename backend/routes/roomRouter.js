const express = require('express');
const router = express.Router();

const {
  retrieveRoom,
  enteringRoom
} = require('../controllers/roomController');

router.post('/retrieve', retrieveRoom);
router.post('/entering', enteringRoom);

module.exports = router;
