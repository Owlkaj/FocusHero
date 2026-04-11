const db = require('../config/db');

// Menampilkan Halaman Utama (Landing Page)
exports.renderHome = (req, res) => {
    res.render('home');
};

// Menampilkan Papan Peringkat (Leaderboard)
exports.renderLeaderboard = (req, res) => {
    // Mengambil 10 player dengan poin tertinggi (Hanya untuk role 'user')
    db.query('SELECT username, total_points FROM users WHERE role = "user" ORDER BY total_points DESC LIMIT 10', (err, results) => {
        if (err) throw err;
        res.render('leaderboard', { topPlayers: results });
    });
};