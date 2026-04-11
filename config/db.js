const mysql = require('mysql2');
require('dotenv').config();

let db;


if (process.env.MYSQL_URL) {
    
    db = mysql.createPool(process.env.MYSQL_URL);
    console.log('🚀 Menggunakan koneksi MYSQL_URL (Mode Railway)');
} else {
   
    db = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'focushero_db',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('💻 Menggunakan koneksi Localhost');
}

// 2. Tes koneksi awal
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Gagal koneksi ke Database:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke database!');
        connection.release(); // Kembalikan koneksi ke pool
    }
});

module.exports = db;