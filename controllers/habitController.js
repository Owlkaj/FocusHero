const db = require('../config/db');

// Tampilkan halaman form
exports.renderAddHabit = (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.render('add-habit');
};

// Proses simpan data ke database
exports.addHabit = (req, res) => {
    const { title, description } = req.body;
    const userId = req.session.userId;

    db.query('INSERT INTO habits (user_id, title, description) VALUES (?, ?, ?)', 
    [userId, title, description], 
    (err, results) => {
        if (err) {
            console.error(err);
            return res.send('Gagal menambah quest.');
        }
        res.redirect('/dashboard'); // Kembalikan ke dashboard setelah sukses
    });
};

exports.completeHabit = (req, res) => {
    const habitId = req.params.id;
    const userId = req.session.userId;

    db.query('SELECT * FROM habits WHERE id = ? AND user_id = ?', [habitId, userId], (err, results) => {
        if (err || results.length === 0) return res.redirect('/dashboard');

        const habit = results[0];
        const today = new Date().toISOString().split('T')[0]; 
        
        let lastCompleted = null;
        if (habit.last_completed) {
            const d = new Date(habit.last_completed);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            lastCompleted = d.toISOString().split('T')[0];
        }

        if (today === lastCompleted) {
            return res.send('<script>alert("Kamu sudah menyelesaikan quest ini hari ini! Kembali besok."); window.location="/dashboard";</script>');
        }

        db.query('UPDATE habits SET streak_count = streak_count + 1, last_completed = CURDATE() WHERE id = ?', [habitId], (err) => {
            if (err) throw err;

            // Tambah 10 XP
            db.query('UPDATE users SET total_points = total_points + 10 WHERE id = ?', [userId], (err) => {
                if (err) throw err;

                // Cek XP terbaru untuk sistem BADGE
                db.query('SELECT total_points FROM users WHERE id = ?', [userId], (err, userRes) => {
                    const xp = userRes[0].total_points;
                    let newBadge = null;

                    // Milestones Badge (Bisa Anda sesuaikan angkanya)
                    if (xp >= 2000) newBadge = 'undefeated Fighter';
                    else if (xp >= 1000) newBadge = 'Undying Lich';
                    else if (xp >= 500) newBadge = 'Holy Paladin';
                    else if (xp >= 200) newBadge = 'Golden Hero';
                    else if (xp >= 100) newBadge = 'Silver Knight';
                    else if (xp >= 50) newBadge = 'Bronze Adventurer';

                    if (newBadge) {
                        // Cek apakah user sudah punya badge ini
                        db.query('SELECT * FROM badges WHERE user_id = ? AND badge_name = ?', [userId, newBadge], (err, badgeRes) => {
                            if (badgeRes.length === 0) {
                                // Jika belum punya, berikan badgenya!
                                db.query('INSERT INTO badges (user_id, badge_name) VALUES (?, ?)', [userId, newBadge], () => {
                                    res.redirect('/dashboard');
                                });
                            } else {
                                res.redirect('/dashboard');
                            }
                        });
                    } else {
                        res.redirect('/dashboard');
                    }
                });
            });
        });
    });
};

// Logika untuk Menghapus Quest (Delete)
exports.deleteHabit = (req, res) => {
    const habitId = req.params.id;
    const userId = req.session.userId;

    // Hapus dari database (hanya jika habit ini milik user yang sedang login)
    db.query('DELETE FROM habits WHERE id = ? AND user_id = ?', [habitId, userId], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
};