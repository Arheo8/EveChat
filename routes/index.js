const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("register"));


router.get('/dashboard', ensureAuthenticated, function(req, res) {
    res.render('dashboard',{
        user: req.user,
      });
});

router.post('/dashboard', function(req, res){
    console.log(req.body);  
    res.send("recieved your request!");
  });

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

module.exports = router;
