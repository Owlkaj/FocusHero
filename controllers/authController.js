const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Menampilkan Halaman
exports.renderLogin = (req, res) => {
    res.render('login');
};

exports.renderRegister = (req, res) => {
    res.render('register');
};

// Logika Proses Register
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body; // Menangkap data dari form HTML

    try {
        // Enkripsi (Hash) Password agar aman
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Simpan ke Database
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, hashedPassword], 
        (err, result) => {
            if (err) {
                console.error('Error Database:', err);
                return res.send('<h1>Registrasi Gagal. Email mungkin sudah terdaftar.</h1><a href="/register">Kembali</a>');
            }
            // Jika sukses, arahkan pemain ke halaman login
            res.redirect('/login'); 
        });
    } catch (error) {
        console.error(error);
        res.send('Terjadi kesalahan pada server.');
    }
};

// Logika Proses Login
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    
    // Cari email di Database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        
        // Jika email tidak ditemukan
        if (results.length === 0) {
            return res.send('<h1>Player tidak ditemukan!</h1><a href="/login">Kembali</a>');
        }

        const user = results[0];
        
        // Cek apakah password ketikan sama dengan password di Database
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.send('<h1>Password Salah! Game Over.</h1><a href="/login">Coba Lagi</a>');
        }

        // Jika Benar, simpan "Kartu Identitas" di Session
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.username = user.username;

        // Arahkan ke Dashboard (Halaman ini akan kita buat setelah ini)
        res.redirect('/dashboard'); 
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        next(); // Izinkan masuk
    } else {
        res.send('<script>alert("Akses Ditolak! Hanya Admin yang boleh masuk."); window.location="/dashboard";</script>');
    }
};