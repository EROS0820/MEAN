const app = require('express')();
const Routes = require('./routes/routes');
const AdminRoutes = require('./routes/admin-routes');
const ContactRoutes = require('./routes/contact-routes');
const ForgotRoutes = require('./routes/forgot-routes');
const sidebarRoutes = require('./routes/sidebar-routes');
const imageRoutes = require('./routes/sidebar-routes/imageRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
socketservice = require('./services/socket')(io);
const adderController = require('./routes/controllers/adder');
let rewardTimerLeft = 0;
let timeLimitVal = 0;
// Import server config
const { server } = require('./config/config');
// Support json
app.use(bodyParser.json());
// Support : form/urlencoded
app.use(bodyParser.urlencoded());
// Enable cross-origin for all domain
app.use(cors({ origin: '*' }));

app.use(function(req, res, next) {
    console.log("=============================Request==========================");
    console.log(req.originalUrl);
    console.log(req.body);
    console.log("=============================Request==========================");
    req.socketservice = socketservice;
    next();
});
// Load Router
app.use(Routes);
app.use('/admin', AdminRoutes);
app.use('/contact', ContactRoutes);
app.use('/forgot', ForgotRoutes);
app.use(sidebarRoutes);
app.use('/upload/image', imageRoutes);
// Start app
http.listen(server.port, console.log('server start successfully on ' + server.port));

// get bazaar setting value
adderController.getBazaarValueSettings().then(result => {
    timeLimitVal = result['TimeRunningLimit'] * 60;
    rewardTimerLeft = timeLimitVal;
    setInterval(() => {
        rewardTimer();
    }, 1000);
});
// sending timer value to reward page
app.get('/getRewardTimer', function(req, res) {
    res.send(JSON.stringify({ time: rewardTimerLeft }));
});

// down count time
const rewardTimer = () => {
    if (rewardTimerLeft === 0 || rewardTimerLeft < 0) {
        rewardTimerLeft = timeLimitVal;
        // agent saving process
    } else {
        rewardTimerLeft--;
    }
    // console.log('*** server down count timer *** ' + rewardTimerLeft);
};
