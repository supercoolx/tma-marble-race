const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemid: { type: String, unique: true },
    balance: {type:Number, default: 1},
    lastBalance: { type: Number, default: 0 },
    price: { type: Number, default: 1},
    visible: { type: Boolean, default: true }
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
