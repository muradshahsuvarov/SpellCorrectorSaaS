const express = require('express'); // For creating a web app which handles requests and routes...
const session = require('express-session'); // For establishing session and its properties
const cookie_parser = require('cookie-parser'); // For parsing cookie data
const cors = require('cors');
const { join } = require('path');
const index_router = require('./routes/index');

require('dotenv').config()

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware for enabling cors to accept Content-Type headers and several HTTP methods
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
})

app.use(session({
    saveUninitialized: false,
    secret: global.process.env.SESSION_KEY,
    resave: false,
    cookie: { maxAge: 60 * (60 * 1000) }
}))

app.use(cookie_parser(global.process.env.SESSION_KEY));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // // Allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // Allow session cookie from browser to pass through
}));


app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, '/public')));

app.use('/', index_router);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});