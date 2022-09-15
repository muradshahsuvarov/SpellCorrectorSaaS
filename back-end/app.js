const express = require('express'); // For creating a web app which handles requests and routes...
const session = require('express-session'); // For establishing session nad its properties
const cookie_parser = require('cookie-parser'); // For parsing cookie data
const cors = require('cors');
const { join } = require('path');
const index_router = require('./routes/index');

require('dotenv').config()

const PORT = process.env.PORT || 5000;

const app = express();

app.use(session({
    saveUninitialized: false,
    secret: global.process.env.SESSION_KEY,
    resave: false,
    cookie: { maxAge: 60 * (60 * 1000) }
}))

app.use(cookie_parser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(join(__dirname, '/public')));
app.use(cors());

app.use('/', index_router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});