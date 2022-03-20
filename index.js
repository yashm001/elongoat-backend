var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();


var cors = require('cors');
// app.use(cors({origin: '*'}));
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var route = require('./routes/apiRoutes');
var verifyRequest = require('./routes/auth');

app.use(verifyRequest());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '200mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}))
app.use(express.static(__dirname + '/uploads'));

//app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '200mb', extended: true}))
app.use(express.urlencoded({limit: '200mb', extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/elongoat', route); // for production
var port = 4000;
app.listen(port, (err) => {
    if(err){
        console.log(err);
    }
    else{
      console.log("API running on 4000");

    }
});
//For Swagger
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger({
  swaggerDefinition: {
     info: {
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
    },
    host: process.env.SWAGGER_API_HOST,
    consumes: [
      "application/json"
    ],
    produces: [
      "application/json"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      "Basic Auth": {
        "type": "basic",
        "name": "authorization",
        "in": "header"
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: [
    './routes/*.js'
 ]
 });

module.exports = app;