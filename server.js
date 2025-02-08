const express = require("express");
const bodyParser = require('body-parser'); // Import body-parser (Not strictly needed if using express.json)
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const errorRoutes = require('./routes/error');
const inventoryRoutes = require('./routes/inventory');
const accountRoute = require('./routes/accountRoute');
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");
app.set("view engine", "ejs");
app.use(express.static('public'));

// Session and flash middleware
app.use(session({
    secret: 'c52d24883f30cdd1679db69624f7fc31cb44632b',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to set flash messages
app.use((req, res, next) => {
    res.locals.flashMessage = req.flash('message');
    res.locals.errorMessage = req.flash('error');
    next();
});

// ✅ Register Routes
app.use('/inventory', inventoryRoutes);
app.use('/account', accountRoute); // Register account route
app.use(static);

// ✅ Add these BEFORE your routes
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data


app.use((req, res, next) => {
    res.locals.userLoggedIn = req.session.userLoggedIn || false;
    res.locals.userName = req.session.userName || '';
    next();
});


app.get("/", function(req, res){
    res.render("index", {title: "Home"});
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('errors/500', { title: 'Server Error', error: err });
});

app.use(errorRoutes);

// Local Server Information
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`);
});
