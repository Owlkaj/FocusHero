const express = require('express');
const session = require('express-session');
require('dotenv').config();

const db = require('./config/db'); 
const app = express();


app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/', dashboardRoutes);

const habitRoutes = require('./routes/habitRoutes');
app.use('/', habitRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

const pageRoutes = require('./routes/pageRoutes');
app.use('/', pageRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server FocusHero berjalan di http://localhost:${PORT}`);
});