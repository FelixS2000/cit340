require('dotenv').config(); // Load environment variables

const express = require("express");
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

// Middleware setup
app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// JWT Secret Key and Access Token Secret
const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your_default_jwt_secret';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_default_access_token_secret';

// Register Routes
const staticRoutes = require('./routes/static');
const inventoryRoute = require('./routes/inventory');
const accountRoutes = require('./routes/accountRoute');
const errorRoutes = require('./routes/error');

// Use the routes
app.use(staticRoutes);
app.use('/inventory', inventoryRoute);
app.use('/account', accountRoutes);
app.use(errorRoutes);

// Set up view engine
app.set("view engine", "ejs");
app.use(expressLayouts);

// Add a default route for the home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Local Server Information
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
});
