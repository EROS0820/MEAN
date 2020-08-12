const jwtService = require('../../routes/middlewares/jwt');
const balanceController = require('../../routes/controllers/balance');
const orderController = require('../../routes/controllers/order');
const transactionController = require('../../routes/controllers/transaction');
const authController = require('../../routes/controllers/auth');
const adderController = require('../../routes/controllers/adder');
const axios = require('axios');

let btc_usd = 0;
let sockets = [];
let online_user = 0;

module.exports = function(io) {
    const send = (userid, event, data) => {
        if (sockets[userid]) sockets[userid].emit('message', {
            event,
            data
        });
    };

    const sendAll = (event, data) => {
        io.emit('message', {
            event,
            data
        });
    };

    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const decode = jwtService.unpack(socket.handshake.query.token);
            socket.decode = decode;
            next();
        } else {
            next();
        }
    }).on('connection', socket => {
        if (socket.decode) {
            console.log("===========socket connect=================");
            console.log(socket.decode);
            console.log("===========socket connect=================");

            const userid = socket.decode.id;
            sockets[userid] = socket;
            if (userid) online_user++;
            balanceController.getBalance(userid).then(result => {
                send(userid, "balance", result);
            });

            transactionController.getLastTransaction(userid).then(result => {
                if (result) send(userid, 'last transaction', result);
            });

            adderController.getMultiplier().then(result => {
                if (result) send(userid, 'multiplier', result);
            });

            socket.on('disconnect', () => {
                console.log("===========socket disconnect=================");
                console.log(socket.decode);
                console.log("===========socket disconnect=================");
                sockets[userid] = null;
                if (userid) online_user--;
            });
        } else {
            console.log("unknown user socket connect");
        }

        orderController.getLastBtolConversions().then(result => {
            if (result) socket.emit('message', {
                event: 'last btol conversions',
                data: result
            });
        });

        orderController.getLastLtobConversions().then(result => {
            if (result) socket.emit('message', {
                event: 'last ltob conversions',
                data: result
            });
        });

        authController.getUsersCount().then(count => {
            socket.emit('message', {
                event: 'total_user',
                data: count
            });
        });

        transactionController.getBTCReceivedCount().then(result => {
            socket.emit('message', {
                event: 'btc_received_count',
                data: result
            });
        });

        transactionController.getBTCSentCount().then(result => {
            socket.emit('message', {
                event: 'btc_sent_count',
                data: result
            });
        });

        transactionController.getBTCReceivedTodayCount().then(result => {
            socket.emit('message', {
                event: 'btc_received_today_count',
                data: result
            });
        });

        transactionController.getBTCSentTodayCount().then(result => {
            socket.emit('message', {
                event: 'btc_sent_today_count',
                data: result
            });
        });

        socket.emit('message', {
            event: 'btc_usd',
            data: btc_usd
        });
        sendAll('online_user', online_user);

        orderController.getLCPrice().then(result => {
            socket.emit('message', {
                event: 'lc_btc',
                data: result
            });
        });

        // get bazaar setting value
        adderController.getBazaarValueSettings().then(result => {
            socket.emit('message', {
                event: 'bazaar_value_settings',
                data: result
            });
        });
    });

    const getUSDRate = () => {
        axios.get('https://blockchain.info/ticker').then(result => {
            btc_usd = result.data.USD.last;
            sendAll("btc_usd", btc_usd);
        }).catch(err => {
            console.log('err');
        });
    };

    getUSDRate();
    setInterval(() => {
        getUSDRate();
    }, 7000);

    return {
        send,
        sendAll
    };
};