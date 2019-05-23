const path = require('path');
const morgan = require('morgan');
const https = require('https');
const express = require('express');
const session = require('express-session');
const fs = require('fs'); 

let options = {
  key: fs.readFileSync(__dirname + '/ssl/server.key'),
  cert: fs.readFileSync(__dirname + '/ssl/server.cert')
};

//initializations
const app = express();
// const server = http.createServer(app);
const server = https.createServer(options, app);


//import routes
const indexRoutes = require('./routes/index');

//sockets
require('./sockets/sockets')(server);

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret: 'Floss',
   resave: false,
   saveUninitialized: false
  }));

//routes
app.use('/', indexRoutes);

// starting server
// server.listen(app.get('port'), () => {
//   console.log('Server on port ', app.get('port'));
// });

server.listen(443);