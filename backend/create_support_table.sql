CREATE TABLE IF NOT EXISTS ho_tro_truc_tuyen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id INT NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai ENUM('cho_xu_ly', 'dang_xu_ly', 'da_xu_ly') DEFAULT 'cho_xu_ly',
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);
