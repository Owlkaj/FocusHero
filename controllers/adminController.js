const db = require('../config/db');

// Dashboard Utama Admin
exports.renderAdminDashboard = (req, res) => {
    const queryStats = `
        SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM habits) as total_habits
    `;
    db.query(queryStats, (err, statsResults) => {
        if (err) throw err;
        db.query('SELECT id, username, email, role, total_points FROM users', (err, userResults) => {
            if (err) throw err;
            res.render('admin', { stats: statsResults[0], users: userResults });
        });
    });
};

// Form Edit User
exports.renderEditUser = (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) return res.redirect('/admin');
        res.render('admin-edit-user', { user: results[0] });
    });
};

// Proses Update User
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, email, role, total_points } = req.body;
    db.query('UPDATE users SET username = ?, email = ?, role = ?, total_points = ? WHERE id = ?', 
    [username, email, role, total_points, userId], (err) => {
        if (err) throw err;
        res.redirect('/admin');
    });
};

// Daftar Semua Habit untuk Moderasi
exports.renderAllHabits = (req, res) => {
    const query = `
        SELECT habits.*, users.username 
        FROM habits 
        JOIN users ON habits.user_id = users.id 
        ORDER BY habits.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('admin-habits', { habits: results });
    });
};

// Hapus Habit (Moderasi)
exports.deleteHabit = (req, res) => {
    const habitId = req.params.id;
    db.query('DELETE FROM habits WHERE id = ?', [habitId], (err) => {
        if (err) throw err;
        res.redirect('/admin/habits');
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) throw err;
        res.redirect('/admin');
    });
};

// Melihat daftar tugas khusus milik satu user
exports.renderUserHabits = (req, res) => {
    const userId = req.params.id;
    // Ambil info user
    db.query('SELECT username, id FROM users WHERE id = ?', [userId], (err, userRes) => {
        if (err || userRes.length === 0) return res.redirect('/admin');
        
        // Ambil semua habit user tersebut
        db.query('SELECT * FROM habits WHERE user_id = ?', [userId], (err, habitRes) => {
            res.render('admin-user-habits', { targetUser: userRes[0], habits: habitRes });
        });
    });
};

// Admin Menambahkan Tugas ke User Tertentu
exports.addHabitForUser = (req, res) => {
    const userId = req.params.id;
    const { title, description } = req.body;
    db.query('INSERT INTO habits (user_id, title, description) VALUES (?, ?, ?)', 
    [userId, title, description], (err) => {
        if (err) throw err;
        res.redirect(`/admin/user-habits/${userId}`);
    });
};