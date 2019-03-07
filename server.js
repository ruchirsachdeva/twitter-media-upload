const express = require('express'), http = require('http'), path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

var assert = require('assert');


const app = express();

app.use(express.static(__dirname + '/dist/web-mobile-dev-assignment1'));

app.listen(process.env.PORT || 4200);

app.use(require('cors')());
app.use(require('body-parser').json());

app.use(fileUpload());

const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


const Twitter = require('twit');

// PathLocationStrategy

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/web-mobile-dev-assignment1/index.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/web-mobile-dev-assignment1/index.html'));
});
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/web-mobile-dev-assignment1/index.html'));
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
  callback: 'https://twitter-media-app.herokuapp.com/callback'
});

var request = require('request');


var session = require('express-session');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 24 * 60 * 60 * 1000} // 24 hours
}));

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/api/authenticated', (req, res) => {
  res.send({
    accessToken: req.session.accessToken,
    accessTokenSecret: req.session.accessTokenSecret
  });
});


app.get('/api/login', (req, res) => {

  //const path = req.body.state ? 'create' : 'destroy';
  twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
    if (error) {
      console.log("Error getting OAuth request token : " + error);
      res.send(error);
    } else {
      console.log(results);
      console.log(requestToken);
      console.log(requestTokenSecret);
      console.log('accessToken....=' + req.session.accessToken);
      console.log('accessTokenSecret...... =' + req.session.accessTokenSecret);
      //store token and tokenSecret somewhere, you'll need them later; redirect user
      req.session.requestTokenSecret = requestTokenSecret;
      res.header("Access-Control-Allow-Origin", "*");
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + requestToken);

    }
  });

});

app.get('/api/logout', (req, res) => {
  req.session.requestTokenSecret = null;
  req.session.accessToken = null;
  req.query = null;
  console.log(req.session.requestTokenSecret);
  console.log(req.session.accessToken);

  res.send(true);

});


app.get('/callback', (req, res) => {
  console.log(req.query.oauth_token);
  console.log(req.query.oauth_verifier);
  console.log(req.session.requestTokenSecret);
  twitter.getAccessToken(req.query.oauth_token, req.session.requestTokenSecret, req.query.oauth_verifier, function (error, accessToken, accessTokenSecret, resl) {
    if (error) {
      console.log("Error getting OAuth access token : " + error);
      res.redirect("/");
      // res.send(error);
    } else {
      console.log(resl);
      req.session.accessToken = accessToken;
      req.session.accessTokenSecret = accessTokenSecret;
      console.log('accessToken=' + req.session.accessToken);
      console.log('accessTokenSecret =' + req.session.accessTokenSecret);

      res.redirect("/");
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


app.get('/api/search', (req, res) => {
  if (Date.now() - cacheAge > 6000) {
    cacheAge = Date.now();
    const params = {tweet_mode: 'extended', count: 200};
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    console.log(req.query.accessToken);
    console.log(req.query.accessTokenSecret);
    getClient(req.query.accessToken, req.query.accessTokenSecret)
      .get(`statuses/user_timeline`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});


app.get('/api/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = {tweet_mode: 'extended', count: 200};
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


  console.log(req.body.accessToken);
  console.log(req.body.accessTokenSecret);
  getClient(req.body.accessToken, req.body.accessTokenSecret)
    .post(`favorites/${path}`, {id: req.params.id})
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});

app.post('/api/retweet/:id', (req, res) => {
  const path = req.body.state ? 'retweet' : 'unretweet';

  console.log(req.body.accessToken);
  console.log(req.body.accessTokenSecret);
  getClient(req.body.accessToken, req.body.accessTokenSecret)
    .post(`statuses/retweet/${req.params.id}`)
    .then(tweet => res.send(tweet))
    .catch(error => res.send(error));
});


app.post('/api/media', (req, res) => {
  console.log('/api/media');


  var blobToken = req.files.id.data;
  var tokens = JSON.parse(blobToken);

  var accessToken = tokens.accessToken;
  var accessTokenSecret = tokens.accessTokenSecret;
  var status = tokens.status;
  console.log(accessToken);
  console.log(accessTokenSecret);

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var file = req.files.sampleFile;
//var bitmap = fs.readFileSync(file.buffer);
//var b64content = new Buffer(bitmap).toString('base64');
  var b64content = file.data.toString('base64');
// first we must post the media to Twitter
  getClient(accessToken, accessTokenSecret)
    .post('media/upload', {media_data: b64content}, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string;
      var altText = "Small flowers in a planter on a sunny balcony, blossoming.";
      var meta_params = {media_id: mediaIdStr, alt_text: {text: altText}};

      getClient(accessToken, accessTokenSecret)
        .post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = {status: status, media_ids: [mediaIdStr]};

            getClient(accessToken, accessTokenSecret)
              .post('statuses/update', params, function (err, data, response) {
                console.log(data);
                res.send(data);
              });
          }
        });
    });

});


app.get('/api/my/search', (req, res) => {
  if (Date.now() - cacheAge > 6000) {
    cacheAge = Date.now();
    const params = {tweet_mode: 'extended', count: 200};
    if (req.query.since) {
      params.since_id = req.query.since;
    }

    var accessToken = '212347172-8XMAeyunbfcadQQ36ZIkgMnNdaWewQxIY5KrYjRO';
    var accessTokenSecret = 'YUAOVks4tOMUmcJMhTi5DhUOmdDXTgWysg5WjJePd1nUu';

    getClient(accessToken, accessTokenSecret)
      .get(`statuses/user_timeline`, params)
      .then(timeline => {
        cache = timeline;
        res.send(timeline);
      })
      .catch(error => res.send(error));
  } else {
    res.send(cache);
  }
});


app.get('/api/my/home', (req, res) => {
  if (Date.now() - cacheAge > 60000) {
    cacheAge = Date.now();
    const params = {tweet_mode: 'extended', count: 200};
    if (req.query.since) {
      params.since_id = req.query.since;
    }
    var accessToken = '212347172-8XMAeyunbfcadQQ36ZIkgMnNdaWewQxIY5KrYjRO';
    var accessTokenSecret = 'YUAOVks4tOMUmcJMhTi5DhUOmdDXTgWysg5WjJePd1nUu';

    getClient(accessToken, accessTokenSecret)
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

app.post('/api/my/media', (req, res) => {
  console.log('/api/my/media');


  var accessToken = '212347172-8XMAeyunbfcadQQ36ZIkgMnNdaWewQxIY5KrYjRO';
  var accessTokenSecret = 'YUAOVks4tOMUmcJMhTi5DhUOmdDXTgWysg5WjJePd1nUu';
  var status = 'status';


// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//var bitmap = fs.readFileSync(file.buffer);
//var b64content = new Buffer(bitmap).toString('base64');
  var b64content = req.body.b64content;
  console.log(b64content);
  console.log(req);
  console.log(req.body);

// first we must post the media to Twitter
  getClient(accessToken, accessTokenSecret)
    .post('media/upload', {media_data: b64content}, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string;
      var altText = "Small flowers in a planter on a sunny balcony, blossoming.";
      var meta_params = {media_id: mediaIdStr, alt_text: {text: altText}};

      getClient(accessToken, accessTokenSecret)
        .post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = {status: status, media_ids: [mediaIdStr]};

            getClient(accessToken, accessTokenSecret)
              .post('statuses/update', params, function (err, data, response) {
                console.log(data);
                res.send(data);
              });
          }
        });
    });

});


app.post('/api/mediachunked', (req, res) => {
  console.log('/api/mediachunked');


  var blobToken = req.files.id.data;
  var tokens = JSON.parse(blobToken);

  var accessToken = tokens.accessToken;
  var accessTokenSecret = tokens.accessTokenSecret;
  console.log(accessToken);
  console.log(accessTokenSecret);

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var file = req.files.sampleFile;

  console.log(file);
  console.log(req);


  var mediaType = file.mimetype;
  var mediaFileSizeBytes = tokens.size;


  console.log(mediaType);
  console.log(mediaFileSizeBytes);

//var mediaType = req.body.type;
//var mediaFileSizeBytes = req.body.size;

  var twit = getClient(accessToken, accessTokenSecret);
  twit.post('media/upload', {
    'command': 'INIT',
    'media_type': mediaType,
    'total_bytes': mediaFileSizeBytes
  }, function (err, bodyObj, resp) {
    assert(!err, err);
    var mediaIdStr = bodyObj.media_id_string;

    var isStreamingFile = true;
    var isUploading = false;
    var segmentIndex = 0;
    // var b64content = file.data.toString('base64');

    var streamBuffers = require('stream-buffers');
    var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      frequency: 10,      // in milliseconds.
      chunkSize: mediaFileSizeBytes     // in bytes.
    });
    myReadableStreamBuffer.put(file.data);


    var fStream = myReadableStreamBuffer;

    var _finalizeMedia = function (mediaIdStr, cb) {
      twit.post('media/upload', {
        'command': 'FINALIZE',
        'media_id': mediaIdStr
      }, cb)
    }

    var _checkFinalizeResp = function (err, bodyObj, resp) {
      exports.checkUploadMedia(err, bodyObj, resp)
      res.send(resp);
      //done();
    }

    fStream.on('data', function (buff) {
      fStream.pause();
      isStreamingFile = false;
      isUploading = true;

      twit.post('media/upload', {
        'command': 'APPEND',
        'media_id': mediaIdStr,
        'segment_index': segmentIndex,
        'media': buff.toString('base64'),
      }, function (err, bodyObj, resp) {
        assert(!err, err);
        isUploading = false;

        if (!isStreamingFile) {
          _finalizeMedia(mediaIdStr, _checkFinalizeResp);
        }
      });
    });

    fStream.on('end', function () {
      isStreamingFile = false;

      if (!isUploading) {
        _finalizeMedia(mediaIdStr, _checkFinalizeResp);
      }
    });
  });

});


exports.checkUploadMedia = function (err, bodyObj, resp) {
  assert(!err, err)

  assert(bodyObj)
  assert(bodyObj.media_id)
  assert(bodyObj.media_id_string)
  assert(bodyObj.size)
}


console.log('Console listening!');
