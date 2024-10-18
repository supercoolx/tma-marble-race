const cron = require('node-cron');

const fetchTransactions = require('./fetch');

const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

const task = {
    isFetching: false
}

const run = async () => {
    try {
        var after_lt = 0;
        const latestTx = await Transaction.find({}).sort({ lt: -1 });
        if (latestTx.length > 0) after_lt = latestTx.lt;

        var data = await fetchTransactions(after_lt);
        while (data.transactions.length) {
            for (const tx of data.transactions) {
                let tmp = await Transaction.findOne({ hash: tx.hash });
                if (tmp === null && tx.in_msg.value > 0) {
                    let transaction = new Transaction({
                        hash: tx.hash,
                        lt: tx.lt,
                        utime: tx.utime,
                        from: tx.in_msg.source.address,
                        to: tx.in_msg.destination.address,
                        amount: tx.in_msg.value,
                    });

                    if (tx.in_msg.decoded_body) {
                        transaction.payload = tx.in_msg.decoded_body.text;
                        let payload = JSON.parse(tx.in_msg.decoded_body.text);
                        if (payload) {
                            transaction.userid = payload.userid;
                            transaction.itemid = payload.itemid;
                        }
                        await transaction.save();

                        if (payload) {
                            let user = await User.findOne({ userid: payload.userid });
                            if (!user) continue;
                            let item = await Item.findOne({ itemid: payload.itemid });
                            if (!item) continue;

                            user.balance += item.balance;
                            await user.save();

                            console.log(`${user.firstname} purchased ${item.itemid}.`);

                            let bonus = Math.floor(item.balance / 10);
                            await User.findOneAndUpdate(
                                {
                                    friends: {
                                        $elemMatch: {
                                            userid: friendId
                                        }
                                    }
                                },
                                {
                                    $inc: {
                                        balance: bonus
                                    }
                                }
                            );
                        }

                    }

                }
            }
            after_lt = data.transactions[0].lt;
            data = await fetchTransactions(after_lt);
        }

        task.isFetching = false;

        return true;
    } catch (error) {
        console.error('Ooops! Cron job error:', error);
        return false;
    }
}

const start = () => cron.schedule('*/10 * * * * *', async () => {
    if (task.isFetching) return;
    task.isFetching = true;
    console.log('CronJob: Fetching transactions...');
    return run();
});

module.exports = {
    run,
    start
}