var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysqlConnection = require("./connection");
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(express.json({limit: '100mb'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Accept, Accept-CH, Accept-Charset, Accept-Datetime, Accept-Encoding, Accept-Ext, Accept-Features, Accept-Language, Accept-Params, Accept-Ranges, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Headers, Access-Control-Request-Method, Age, Allow, Alternates, Authentication-Info, Authorization, C-Ext, C-Man, C-Opt, C-PEP, C-PEP-Info, CONNECT, Cache-Control, Compliance, Connection, Content-Base, Content-Disposition, Content-Encoding, Content-ID, Content-Language, Content-Length, Content-Location, Content-MD5, Content-Range, Content-Script-Type, Content-Security-Policy, Content-Style-Type, Content-Transfer-Encoding, Content-Type, Content-Version, Cookie, Cost, DAV, DELETE, DNT, DPR, Date, Default-Style, Delta-Base, Depth, Derived-From, Destination, Differential-ID, Digest, ETag, Expect, Expires, Ext, From, GET, GetProfile, HEAD, HTTP-date, Host, IM, If, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Keep-Alive, Label, Last-Event-ID, Last-Modified, Link, Location, Lock-Token, MIME-Version, Man, Max-Forwards, Media-Range, Message-ID, Meter, Negotiate, Non-Compliance, OPTION, OPTIONS, OWS, Opt, Optional, Ordering-Type, Origin, Overwrite, P3P, PEP, PICS-Label, POST, PUT, Pep-Info, Permanent, Position, Pragma, ProfileObject, Protocol, Protocol-Query, Protocol-Request, Proxy-Authenticate, Proxy-Authentication-Info, Proxy-Authorization, Proxy-Features, Proxy-Instruction, Public, RWS, Range, Referer, Refresh, Resolution-Hint, Resolver-Location, Retry-After, Safe, Sec-Websocket-Extensions, Sec-Websocket-Key, Sec-Websocket-Origin, Sec-Websocket-Protocol, Sec-Websocket-Version, Security-Scheme, Server, Set-Cookie, Set-Cookie2, SetProfile, SoapAction, Status, Status-URI, Strict-Transport-Security, SubOK, Subst, Surrogate-Capability, Surrogate-Control, TCN, TE, TRACE, Timeout, Title, Trailer, Transfer-Encoding, UA-Color, UA-Media, UA-Pixels, UA-Resolution, UA-Windowpixels, URI, Upgrade, User-Agent, Variant-Vary, Vary, Version, Via, Viewport-Width, WWW-Authenticate, Want-Digest, Warning, Width, X-Content-Duration, X-Content-Security-Policy, X-Content-Type-Options, X-CustomHeader, X-DNSPrefetch-Control, X-Forwarded-For, X-Forwarded-Port, X-Forwarded-Proto, X-Frame-Options, X-Modified, X-OTHER, X-PING, X-PINGOTHER, X-Powered-By, X-Requested-With, x-ijt");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.post("/newDemographicsEntry", (req, res) => {
    var array = req.body;
    var insertValues = "";
    var i;
    for (i = 0; i < array.length; i++) {
        insertValues = insertValues + "('" + ((array[i].fname === '') ? 'n/a' : array[i].fname) + "', '" + ((array[i].lname === '') ? 'n/a' : array[i].lname)+ "', '" + ((array[i].gender === '') ? 'n/a' : array[i].gender) + "', '" + ((array[i].age === '') ? 'n/a' : array[i].age) +"', '" + ((array[i].image === '') ? 'n/a' : array[i].image) +  "'),"
    }
    insertValues=insertValues.slice(0, -1);
    console.log(insertValues);
    mysqlConnection.query("INSERT INTO demographics (fname, lname, gender, age, image) VALUES " + insertValues, (err, rows, fields) => {
        if (!err) {
            res.status(200).send("Good Request")
            console.log("successful database connection to server yay!")
        } else {
            console.log(err);
            res.status(201).send("Bad Request")
        }
    })
})

app.post("/newVitalsEntry", (req, res) => {
    var array = req.body;
    var insertValues = "";
    var i;
    for (i = 0; i < array.length; i++) {
        insertValues = insertValues + "('" + ((array[i].height === '') ? 'n/a' : array[i].height) + "', '" + ((array[i].weight === '') ? 'n/a' : array[i].weight)+ "', '" + ((array[i].bodyTemperature === '') ? 'n/a' : array[i].bodyTemperature) + "', '" + ((array[i].pulseRate === '') ? 'n/a' : array[i].pulseRate) +"', '" + ((array[i].BP === '') ? 'n/a' : array[i].BP) + "', '" + ((array[i].Medications === '') ? 'n/a' : array[i].Medications) + "', '" + ((array[i].Notes === '') ? 'n/a' : array[i].Notes) +  "'),"
    }
    insertValues=insertValues.slice(0, -1);
    console.log(insertValues);
    mysqlConnection.query("INSERT INTO vitals (height, weight, bodyTemperature, pulseRate, BP, Medications, Notes) VALUES " + insertValues, (err, rows, fields) => {
        if (!err) {
            res.status(200).send("Good Request")
            console.log("successful database connection to server yay!")
        } else {
            console.log(err);
            res.status(201).send("Bad Request")
        }
    })
})

app.post("/getDemoData", (req, res) => {
    mysqlConnection.query("SELECT * FROM demographics", (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows)
        } else {
            console.log(err);
            res.status(201).send("Bad Request")
        }
    })
})

app.post("/getVitalsData", (req, res) => {
    mysqlConnection.query("SELECT * FROM vitals", (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows)
        } else {
            console.log(err);
            res.status(201).send("Bad Request")
        }
    })
})

module.exports = app;


