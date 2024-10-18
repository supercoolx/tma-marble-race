const axios = require('axios');

const { IS_MAINNET, ADMIN_ADDRESS } = require('../helper/constants');

const API_URL = `https://${ IS_MAINNET ? '' : 'testnet.' }tonapi.io/v2/blockchain/accounts/${ ADMIN_ADDRESS }/transactions`;

module.exports = async (after_lt, before_lt, limit, sort_order) => axios.get(API_URL, {
    params: {
        after_lt,
        before_lt,
        limit,
        sort_order
    }
}).then(res => res.data).catch(err => {
    console.log(err.message);
    return { transactions: [] };
});