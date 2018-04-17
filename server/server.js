const express = require('express');
const port = 3000;
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const bcrypt = require('bcrypt-nodejs');

const users = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password'}
]

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email'},
  (email, password, done) => {
    axios.get(`http://localhost:5000/users?email=${email}`)
      .then(res => {
        const user = res.data[0];

        if (!user) {
          return done(null, false, { message: 'Invalid credentials.\n'});
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Invalid password.\n'});
        }
        return done(null, user);
      })
      .catch(error => done(error));
  }
));

// tell passport how to serielize the user
passport.serializeUser((user, done) => {
  console.log(`Inside serializeUser callback. User id is saved to the session file store here`);
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback');
  console.log(`The user id passport saved in the session file store is: ${id}`);
  axios.get(`http://localhost:5000/users/${id}`)
    .then(res => done(null, res.data))
    .catch(error => done(error, false));
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(session({
  genid: req => {
    console.log('Inside the session middleware');
    console.log(req.sessionID);
    return uuid(); // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'pianoman',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  res.send(`\nHome page.\n`);
})

app.get('/login', (req, res) =>{
  console.log('Inside GET /login callback function');
  console.log(req.sessionID);
  res.send('You got the login page!\n')
})

app.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback function');
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    req.login(user, err => {
      console.log('Inside the req.login() callback');
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      return res.redirect('/authrequired');
    })
  })(req, res, next);
});

app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback');
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
})

app.listen(port, () => {
  console.log(`The magic happens on port ${port}`);
})