// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').load();
// DB Setup
mongoose.connect( process.env.MONGO_URI|| 'mongodb://localhost:auth/auth');



// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*',limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({ dest: "./uploads/" })); 

router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
