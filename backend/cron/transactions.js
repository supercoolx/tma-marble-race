const cron = require('node-cron');

const fetchTransactions = require('./fetch');
const Transaction = require('../models/Transaction');

const task = {
    isFetching: false
}

const run = async () => {
    try {
        var after_lt = 0, before_lt = null;
        const latestTx = await Transaction.find({}).sort({ lt: -1 });
        if (latestTx.length > 0) after_lt = latestTx.lt;

        var data = await fetchTransactions(after_lt);
        while (data.transactions.length) {
            for (const tx of data.transactions) {
                let tmp = await Transaction.findOne({ hash: tx.hash });
                if (tmp === null && tx.in_msg.value > 0) {
                    await Transaction.create({
                        hash: tx.hash,
                        lt: tx.lt,
                        utime: tx.utime,
                        from: tx.in_msg.source.address,
                        to: tx.in_msg.destination.address,
                        amount: tx.in_msg.value,
                    });
                }
            }
            after_lt = data.transactions[0].lt;
            data = await fetchTransactions(after_lt);
        }

        task.isFetching = false;
    } catch (error) {
        console.error('Ooops! Cron job error:', error);
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