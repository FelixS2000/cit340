require('dotenv').config(); // Load environment variables

const express = require("express");
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const authMiddleware = require('./utilities/authMiddleware');

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



// Register Routes
const staticRoutes = require('./routes/static');
const inventoryRoute = require('./routes/inventory');
const accountRoutes = require('./routes/accountRoute');
const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');


// Use the routes
app.use(staticRoutes);
app.use('/inventory', inventoryRoute);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);
app.use(errorRoutes);

// Set up view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Make user available in EJS views
    next();
});

// Add a default route for the home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// Use the authentication middleware
const combinedMiddleware = (req, res, next) => {
    authMiddleware.checkAuth(req, res, next);
    authMiddleware.checkAdmin(req, res, next);
    authMiddleware.checkEmployeeOrAdmin(req, res, next);
  };
  app.use(combinedMiddleware);

// Protected route that requires authentication
app.get('/account/management', authMiddleware.checkAdmin, (req, res) => {
  // Render the account management page
  res.render('account/management', {
    accountType: req.user.account_type,
    userName: req.user.account_email,
  });
});

// Local Server Information
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
});
