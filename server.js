require('dotenv').config(); // Load environment variables
const pool = require('./database/connection'); // Import database connection

const express = require("express");

const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const authMiddleware = require('./utilities/authMiddleware');

// Use the authentication middleware
const combinedMiddleware = (req, res, next) => {
    // Check authentication first
    if (!req.session.accountData) {
        return res.redirect('/account/login');
    }
    
    // If authenticated, proceed to next middleware
    next();
};


// Middleware setup
app.use(cookieParser());
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");
app.use(session({
    secret: process.env.SESSION_SECRET || 'strong_default_secret_key_123!',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(flash());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());




// Register Routes
const staticRoutes = require('./routes/static');
const inventoryRoute = require('./routes/inventory');
const accountRoutes = require('./routes/accountRoute');
const errorRoutes = require('./routes/error');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review'); 

// Use the routes
app.use(staticRoutes);

app.use('/inventory', inventoryRoute);
app.use('/account', accountRoutes);
app.use('/admin', adminRoutes);
app.use('/reviews', reviewRoutes);


app.use(errorRoutes);

// Set up view engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use((req, res, next) => {
    // Make session data available in views and middleware
    res.locals.user = req.session.accountData || null;
    res.locals.session = req.session;
    next();
});


// Add a default route for the home page
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});


// Protected route that requires authentication
app.get('/account/management', authMiddleware.checkAdmin, (req, res) => {
  // Render the account management page
  res.render('account/management', {
    accountType: req.user.account_type,
    userName: req.user.account_email,
  });
});

// Function to ensure review table exists
async function ensureReviewTable() {
    try {
        const client = await pool.connect();
        // Check if review table exists
        const tableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'review'
            );
        `);
        
        if (!tableExists.rows[0].exists) {
            // Create review table if it doesn't exist
            await client.query(`
                CREATE TABLE IF NOT EXISTS public.review (
                    review_id SERIAL PRIMARY KEY,
                    review_text TEXT NOT NULL,
                    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
                    account_id INTEGER NOT NULL REFERENCES public.account(account_id) ON DELETE CASCADE
                );
            `);
            console.log('Review table created successfully');
        }
        client.release();
    } catch (error) {
        console.error('Error ensuring review table exists:', error);
    }
}




// Local Server Information
const PORT = process.env.PORT || 5500;
app.listen(PORT, async () => {
    await ensureReviewTable();
    console.log(`App listening on localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
