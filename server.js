const express = require("express");
const bodyParser = require('body-parser'); // Import body-parser (Not strictly needed if using express.json)
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const env = require("dotenv").config();
const app = express();
const path = require("path");
const static = require("./routes/static");
const inventoryModel = require('./models/inventoryModel'); // Import inventory model

const errorRoutes = require('./routes/error');
const inventoryRoutes = require('./routes/inventory');
const accountRoute = require('./routes/accountRoute');
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");



// Middleware for handling sessions
app.use(session({
    secret: 'c52d24883f30cdd1679db69624f7fc31cb44632b',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// Middleware for flash messages
app.use(flash());

// Set the view engine to EJS
app.set("view engine", "ejs");

// Server static files
app.use(express.static(path.join(__dirname, "public"))); 

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for Inventory Display
app.get('/inventory/inventory-display', async (req, res, next) => {
    try {
        console.log("✅ GET /inventory/inventory-display route hit!");

        // Fetch inventory data (replace with actual model fetching)
        const inventory = await inventoryModel.getAllInventoryWithClassification();

        if (!inventory || inventory.length === 0) {
            req.flash("errorMessage", "No inventory items found.");
        }

        // Render the view with flash messages
        res.render("inventory/inventory-display", {
            title: "Inventory List",
            inventory: inventory || [], // Ensure an empty array if no data
            flashMessage: req.flash("message"),
            errorMessage: req.flash("errorMessage"),
        });

    } catch (error) {
        console.error("❌ Error fetching inventory:", error);
        req.flash("errorMessage", "An error occurred while fetching the inventory.");
        res.redirect("/inventory/inventory-display");
    }
});

// Inventory management
app.get('/inventory/management', (req, res) => {
    // Just a simple route example
    res.render('inventory/management', { title: 'Inventory Management' });
});

// ✅ Register Routes
app.use('/inventory', inventoryRoutes);
app.use('/account', accountRoute); // Register account route
app.use(static);



// Middleware to set flash messages
app.use((req, res, next) => {
    console.log('Session:', req.session); // Log session for debugging
    console.log('Flash function:', req.flash); // Check if req.flash is available
    console.log('Is flash function a function?', typeof req.flash === 'function'); // Check if req.flash is a function

    res.locals.flashMessage = req.flash('message');
    res.locals.errorMessage = req.flash('errorMessage');
    console.log('Flash messages:', res.locals.flashMessage, res.locals.errorMessage); // Log flash messages for debugging

    next();
});


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
