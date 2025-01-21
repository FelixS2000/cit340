/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const staticRoutes = require("./routes/static");
const errorRoutes = require('./routes/error');
const inventoryRoutes = require('./routes/inventory');

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout.ejs");

/* ***********************
 * Middleware
 *************************/
app.use(express.static('public'));
app.use('/inventory', inventoryRoutes);
app.use(staticRoutes);

/* ***********************
 * Routes
 *************************/
app.get("/", function(req, res) {
    res.render("index", { title: "Home" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('errors/500', { title: 'Server Error', error: err });
});

app.use(errorRoutes);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`);
});
