-- Database Schema for MySQL (Aiven)
-- Compatible with MySQL 8.0+

-- Disable foreign key checks to allow dropping tables in any order
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS thong_ke_dashboard;
DROP TABLE IF EXISTS hieu_suat_chatbot;
DROP TABLE IF EXISTS log_hoi_thoai;
DROP TABLE IF EXISTS bao_loi;
DROP TABLE IF EXISTS ai_training;
DROP TABLE IF EXISTS faq;
DROP TABLE IF EXISTS danh_gia;
DROP TABLE IF EXISTS lich_su_tra_cuu;
DROP TABLE IF EXISTS phieu_muon;
DROP TABLE IF EXISTS sach;
DROP TABLE IF EXISTS nguoi_dung;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Table: nguoi_dung (Users)
CREATE TABLE nguoi_dung (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL, -- Added username
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    so_dien_thoai VARCHAR(20),
    mat_khau_hash VARCHAR(255),
    vai_tro VARCHAR(20) DEFAULT 'student', -- 'student', 'admin', 'librarian'
    trang_thai VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'banned'
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: sach (Books)
CREATE TABLE sach (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    tac_gia VARCHAR(255),
    the_loai VARCHAR(100),
    mo_ta TEXT,
    nam_xuat_ban INT,
    trang_thai VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Borrowed', 'Maintenance'
    anh_bia TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: lich_su_tra_cuu (Search History)
CREATE TABLE lich_su_tra_cuu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    sach_id BIGINT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    FOREIGN KEY (sach_id) REFERENCES sach(id) ON DELETE CASCADE
);

-- 4. Table: danh_gia (Reviews)
CREATE TABLE danh_gia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    diem INT CHECK (diem >= 1 AND diem <= 5),
    nhan_xet TEXT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);

-- 5. Table: faq (Frequently Asked Questions)
CREATE TABLE faq (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cau_hoi TEXT NOT NULL,
    cau_tra_loi TEXT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    nguoi_cap_nhat BIGINT,
    FOREIGN KEY (nguoi_cap_nhat) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 6. Table: ai_training (AI Training Data)
CREATE TABLE ai_training (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    du_lieu TEXT NOT NULL,
    nguoi_cap_nhat BIGINT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_cap_nhat) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 7. Table: bao_loi (Error Reports)
CREATE TABLE bao_loi (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    mo_ta_loi TEXT NOT NULL,
    muc_do VARCHAR(50),
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 8. Table: log_hoi_thoai (Chat Logs)
CREATE TABLE log_hoi_thoai (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    cau_hoi TEXT,
    phan_hoi TEXT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 9. Table: hieu_suat_chatbot (Performance Metrics)
CREATE TABLE hieu_suat_chatbot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    do_chinh_xac FLOAT,
    do_phu_hoi FLOAT,
    so_cau_tra_loi INT
);

-- 10. Table: thong_ke_dashboard (Dashboard Stats)
CREATE TABLE thong_ke_dashboard (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ngay DATE,
    tong_cau_hoi INT DEFAULT 0,
    so_nguoi_dung INT DEFAULT 0,
    diem_tb FLOAT DEFAULT 0
);

-- 11. Table: phieu_muon (Loans)
CREATE TABLE phieu_muon (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    sach_id BIGINT,
    ngay_muon DATE,
    ngay_hen_tra DATE,
    ngay_tra DATE,
    trang_thai VARCHAR(50) DEFAULT 'Reserved',
    ghi_chu TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    FOREIGN KEY (sach_id) REFERENCES sach(id) ON DELETE SET NULL
);
