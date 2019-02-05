const express = require('express'), http = require('http'), path = require('path');
const app = express();

app.use(express.static(__dirname+'/dist/web-mobile-dev-assignment1'));

app.listen(process.env.PORT||4200);

app.use(require('cors')());
app.use(require('body-parser').json());

const Twitter = require('twit');

// PathLocationStrategy

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname,'/dist/web-mobile-dev-assignment1/index.html'));
});

app.get('/login', function(req,res) {
  res.sendFile(path.join(__dirname,'/dist/web-mobile-dev-assignment1/index.html'));
});
app.get('/home', function(req,res) {
  res.sendFile(path.join(__dirname,'/dist/web-mobile-dev-assignment1/index.html'));
});

function getClient(access_token, access_token_secret) {

  return new Twitter({
    consumer_key: '2JzQRJBPsiL1mtlZVxg6J02BY',
    consumer_secret: 'XCGZe0uNDVsXZtMyKEYDKcYa29aFncfkbqCS2u1i6v8ucRp8nU',
    //access_token: '212347172-8XMAeyunbfcadQQ36ZIkgMnNdaWewQxIY5KrYjRO',
    //access_token_secret: 'YUAOVks4tOMUmcJMhTi5DhUOmdDXTgWysg5WjJePd1nUu',
    access_token: access_token,
    access_token_secret: access_token_secret
  });
}

var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
  consumerKey: '2JzQRJBPsiL1mtlZVxg6J02BY',
  consumerSecret: 'XCGZe0uNDVsXZtMyKEYDKcYa29aFncfkbqCS2u1i6v8ucRp8nU',
  callback: 'http://localhost:4200/callback'
});

var request = require('request');


var session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 24 * 60 * 60 * 1000} // 24 hours
}));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/api/authenticated', (req, res) => {
res.send({accessToken:req.session.accessToken,
  accessTokenSecret:req.session.accessTokenSecret
});
});


app.get('/api/login', (req, res) => {

  //const path = req.body.state ? 'create' : 'destroy';
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
  if (error) {
    console.log("Error getting OAuth request token : " + error);
    res.send(error);
  } else {
    console.log(results);
    console.log(requestToken);
    console.log(requestTokenSecret);
    console.log('accessToken....='+req.session.accessToken);
    console.log('accessTokenSecret...... ='+req.session.accessTokenSecret);
    //store token and tokenSecret somewhere, you'll need them later; redirect user
    req.session.requestTokenSecret = requestTokenSecret;
    res.header("Access-Control-Allow-Origin", "*");
    res.redirect("https://twitter.com/oauth/authorize?oauth_token="+requestToken);

  }
});

});

app.get('/callback', (req, res) => {
  console.log(req.query.oauth_token);
console.log(req.query.oauth_verifier);
console.log(req.session.requestTokenSecret);
twitter.getAccessToken(req.query.oauth_token, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, resl) {
  if (error) {
    console.log("Error getting OAuth access token : " + error);
    res.redirect("/");
   // res.send(error);
  } else {
    console.log(resl);
    req.session.accessToken=accessToken;
    req.session.accessTokenSecret=accessTokenSecret;
    console.log('accessToken='+req.session.accessToken);
    console.log('accessTokenSecret ='+req.session.accessTokenSecret);

    res.redirect("/home");
    //store accessToken and accessTokenSecret somewhere (associated to the user)
    //Step 4: Verify Credentials belongs here
  }
});


});







app.get('/api/user', (req, res) => {

console.log(req.query.accessToken);
console.log(req.query.accessTokenSecret);
getClient(req.query.accessToken, req.query.accessTokenSecret)
  .get('account/verify_credentials')
  .then(user => {
  res.send(user);
})
.catch(error => {
  res.send(error);
});
});

let cache = [];
let cacheAge = 0;

app.get('/api/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
  cacheAge = Date.now();
  const params = { tweet_mode: 'extended', count: 200 };
  if (req.query.since) {
    params.since_id = req.query.since;
  }
  console.log(req.query.accessToken);
  console.log(req.query.accessTokenSecret);
  getClient(req.query.accessToken, req.query.accessTokenSecret)
    .get(`statuses/home_timeline`, params)
    .then(timeline => {
    cache = timeline;
  res.send(timeline);
})
.catch(error => res.send(error));
} else {
  res.send(cache);
}
});

app.post('/api/favorite/:id', (req, res) => {
  const path = req.body.state ? 'create' : 'destroy';


console.log(req.query.accessToken);
console.log(req.query.accessTokenSecret);
getClient(req.query.accessToken, req.query.accessTokenSecret)
  .post(`favorites/${path}`, { id: req.params.id })
  .then(tweet => res.send(tweet))
.catch(error => res.send(error));
});

app.post('/api/retweet/:id', (req, res) => {
  const path = req.body.state ? 'retweet' : 'unretweet';

console.log(req.query.accessToken);
console.log(req.query.accessTokenSecret);
getClient(req.query.accessToken, req.query.accessTokenSecret)
  .post(`statuses/retweet/${req.params.id}`)
  .then(tweet => res.send(tweet))
.catch(error => res.send(error));
});




console.log('Console listening!');
