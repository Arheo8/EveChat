const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const http = require('http').Server(app);
const dotenv = require('dotenv');
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

dotenv.config();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = process.env.MongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
// EJS
app.use(expressLayouts); 
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

// Welcome Page
app.get("/", forwardAuthenticated, (req, res) => res.render("register"));


app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard',{
        user: req.user,
      });
});

app.post('/dashboard', (req, res) => {
    console.log(req.body);  
    res.send("recieved your request!");
  });

io.sockets.on('connection', (socket) => {
    socket.on('username', (username) => {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat.</i>');
    });

    socket.on('disconnect', (username) => {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', (message) => {
        io.emit('chat_message','<strong>' + socket.username + '</strong>: ' + message);
    });
});

// Routes
app.use('/users', require('./routes/users.js'));

const port = process.env.PORT || 5000;

const server = http.listen(port, function() {
    console.log(`listening on Port :${port}`);
});