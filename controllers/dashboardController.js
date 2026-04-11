const db = require('../config/db');

exports.renderDashboard = (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const userId = req.session.userId;

    db.query('SELECT username, total_points, role FROM users WHERE id = ?', [userId], (err, userResults) => {
        if (err) throw err;
        db.query('SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, habitResults) => {
            if (err) throw err;
            db.query('SELECT username, total_points FROM users WHERE role = "user" ORDER BY total_points DESC LIMIT 5', (err, leaderResults) => {
                if (err) throw err;
                
                // MENGAMBIL DATA BADGE
                db.query('SELECT badge_name FROM badges WHERE user_id = ? ORDER BY earned_at DESC', [userId], (err, badgeResults) => {
                    if (err) throw err;

                    // Jika punya badge, ambil yang paling atas (terbaru). Jika belum, kasih gelar default.
                    const currentTitle = badgeResults.length > 0 ? badgeResults[0].badge_name : 'Rookie';
                    const totalBadges = badgeResults.length;
                    
                    res.render('dashboard', { 
                        user: userResults[0], 
                        habits: habitResults,
                        topPlayers: leaderResults,
                        title: currentTitle,      // Kirim title ke HTML
                        badgeCount: totalBadges   // Kirim jumlah badge ke HTML
                    });
                });
            });
        });
    });
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};