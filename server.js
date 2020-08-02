require("dotenv").config();
var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const https = require('https');
//var request = require('request');
var path = require('path');
app.set("view engine", "ejs");

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const ROOM_NAME = "telemedicineAppointment";

// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 14400;

/*
const patientPath = path.join(__dirname, './public/patient.html');
app.use("/patient", express.static(patientPath));


const providerPath = path.join(__dirname, "./public/provider.html");
app.use("/provider", express.static(providerPath));
*/
// serving up some fierce CSS lewks
app.use('/public', express.static(__dirname + '/public'));

app.use('/patient', express.static(__dirname + './public/patient.html'));

app.use('/provider', express.static(__dirname + './public/patient.html'));

// suppress missing favicon warning
app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/token", function (request, response) {
  const identity = request.query.identity;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  const grant = new VideoGrant({ room: ROOM_NAME });
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt(),
  });
});

http.createServer(app).listen(1337, () => {
  console.log("express server listening on port 1337");
});
