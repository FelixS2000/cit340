const express = require("express");
const bodyParser = require('body-parser'); // Import body-parser

const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const errorRoutes = require('./routes/error');
const inventoryRoutes = require('./routes/inventory');
const accountRoute = require('./routes/accountRoute'); // Import the account route
const { getClassificationsFromModel } = require('./models/inventoryModel'); // Import the function
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");
app.set("view engine", "ejs");
app.use(express.static('public'));

// Session and flash middleware
app.use(session({
    secret: 'c52d24883f30cdd1679db69624f7fc31cb44632b', // Change this to a secure key
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to set flash messages in response locals
app.use((req, res, next) => {
    res.locals.flashMessage = req.flash('message');
    res.locals.errorMessage = req.flash('error');
    next();
});

app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(bodyParser.json()); // Middleware to parse JSON data

// Routes
app.use('/inventory', inventoryRoutes);
app.use('/account', accountRoute); // Add this line to include the account routes
app.use(static);
app.get("/", function(req, res){
    res.render("index", {title: "Home"});
});

// Temporary route to test database connection
app.get('/test-classifications', async (req, res) => {
    try {
        const classifications = await getClassificationsFromModel();
        console.log('Fetched Classifications:', classifications);
        res.json(classifications); // Return classifications as JSON
    } catch (error) {
        console.error('Error fetching classifications:', error.message);
        res.status(500).send('Error fetching classifications');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('errors/500', { title: 'Server Error', error: err });
});

app.use(errorRoutes);

// Local Server Information
const port = process.env.PORT;
const host = process.env.HOST;

// Log statement to confirm server operation
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`);
});
