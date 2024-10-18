const mongoose = require('mongoose');

// Define the Follow schema
const TransactionSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    lt: { type: Number, required: true },
    utime: { type: Number, required: true },
    from: { type: String },
    to: { type: String },
    amount: { type: Number },
    claimed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaction', TransactionSchema);