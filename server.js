if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cron = require('node-cron');

const app = express();

// Mongoose Database
mongoose.connect('mongodb://localhost:27017/usersdb');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// SMongoose Database Schemas
const userModel = require('./models/user');
const postModel = require('./models/post');
const notificationModel = require('./models/notification');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  name => userModel.findOne({'name': name}),
  id => userModel.findById(id));

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view-engine', 'ejs');
app.use(session({
  secret: 'something else',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Routes
const homeRouter = require('./routes/home');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');
const settingsRouter = require('./routes/settings');
const popularRouter = require('./routes/trending');
const peopleRouter = require('./routes/people');
const notificationRouter = require('./routes/notifications');
const helpRouter = require('./routes/help');
const walletRouter = require('./routes/wallet');
app.use('/home', checkAuthenticated, homeRouter);
app.use('/profile', checkAuthenticated, profileRouter);
app.use('/search', checkAuthenticated, searchRouter);
app.use('/settings', checkAuthenticated, settingsRouter);
app.use('/trending', checkAuthenticated, popularRouter);
app.use('/people', checkAuthenticated, peopleRouter);
app.use('/notifications', checkAuthenticated, notificationRouter);
app.use('/help', checkAuthenticated, helpRouter);
app.use('/wallet', checkAuthenticated, walletRouter);


app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new userModel({
      name: req.body.name,
      password: hashedPassword
    });
    await user.save();
    res.redirect('/login');
  } catch(e) {
    res.redirect('/register');
    console.log(e);
  }
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

cron.schedule('1 * * * *', async () => {
  console.log("adding tokens");
  await userModel.updateMany({}, {$inc: {"tokens": 3}});
  userModel.save();
});

app.listen(4000);
