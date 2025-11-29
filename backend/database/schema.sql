-- Database Design based on the provided ER Diagram
-- Database Name: library_chatbot_system

-- 1. Table: nguoi_dung (Users)
-- Stores user information for students, admins, and librarians.
CREATE TABLE nguoi_dung (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    so_dien_thoai VARCHAR(20),
    mat_khau_hash VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(20) DEFAULT 'student', -- Enum: 'student', 'admin', 'librarian'
    trang_thai VARCHAR(20) DEFAULT 'active', -- Enum: 'active', 'inactive', 'banned'
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table: sach (Books)
-- Stores information about books in the library.
CREATE TABLE sach (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tieu_de VARCHAR(255) NOT NULL,
    tac_gia VARCHAR(255),
    the_loai VARCHAR(100),
    mo_ta TEXT,
    nam_xuat_ban INT,
    trang_thai VARCHAR(50) DEFAULT 'Available', -- Enum: 'Available', 'Borrowed', 'Maintenance'
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: lich_su_tra_cuu (Search History)
-- Tracks which books users have searched for or viewed.
CREATE TABLE lich_su_tra_cuu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nguoi_dung_id BIGINT,
    sach_id BIGINT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    FOREIGN KEY (sach_id) REFERENCES sach(id) ON DELETE CASCADE
);

-- 4. Table: danh_gia (Ratings/Reviews)
-- Allows users to rate and review the system or books (diagram links to user, context implies system or book).
-- Diagram only links to User, but usually needs a target. Assuming general system feedback based on diagram.
CREATE TABLE danh_gia (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nguoi_dung_id BIGINT,
    diem INT CHECK (diem >= 1 AND diem <= 5),
    nhan_xet TEXT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);

-- 5. Table: faq (Frequently Asked Questions)
-- Stores common questions and answers for the chatbot or help section.
CREATE TABLE faq (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cau_hoi TEXT NOT NULL,
    cau_tra_loi TEXT NOT NULL,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    nguoi_cap_nhat BIGINT, -- The admin/librarian who updated this
    FOREIGN KEY (nguoi_cap_nhat) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 6. Table: ai_training (AI Training Data)
-- Stores data used to train or fine-tune the AI model.
CREATE TABLE ai_training (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    du_lieu TEXT NOT NULL, -- JSON or text data
    nguoi_cap_nhat BIGINT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_cap_nhat) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 7. Table: bao_loi (Error Reports)
-- Stores error reports submitted by users.
CREATE TABLE bao_loi (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nguoi_dung_id BIGINT,
    mo_ta_loi TEXT NOT NULL,
    muc_do VARCHAR(50), -- Enum: 'Low', 'Medium', 'High', 'Critical'
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 8. Table: log_hoi_thoai (Chat Logs)
-- Stores history of conversations between users and the chatbot.
CREATE TABLE log_hoi_thoai (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nguoi_dung_id BIGINT,
    cau_hoi TEXT,
    phan_hoi TEXT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

-- 9. Table: hieu_suat_chatbot (Chatbot Performance Metrics)
-- Tracks metrics related to chatbot performance over time.
CREATE TABLE hieu_suat_chatbot (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    do_chinh_xac FLOAT, -- Accuracy score (0.0 - 1.0)
    do_phu_hoi FLOAT,   -- Response coverage (0.0 - 1.0)
    so_cau_tra_loi INT  -- Number of responses generated
);

-- 10. Table: thong_ke_dashboard (Dashboard Statistics)
-- Aggregated daily statistics for the admin dashboard.
CREATE TABLE thong_ke_dashboard (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ngay DATE,
    tong_cau_hoi INT DEFAULT 0,
    so_nguoi_dung INT DEFAULT 0,
    diem_tb FLOAT DEFAULT 0 -- Average rating score
);
