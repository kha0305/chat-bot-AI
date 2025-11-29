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
DROP TABLE IF EXISTS ho_tro_truc_tuyen;
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

-- 12. Table: ho_tro_truc_tuyen (Online Support)
CREATE TABLE ho_tro_truc_tuyen (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT,
    noi_dung TEXT,
    trang_thai ENUM('cho_xu_ly', 'dang_xu_ly', 'da_xu_ly') DEFAULT 'cho_xu_ly',
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
);

-- SEED DATA

-- Seed Users (Admin & Librarian)
INSERT INTO nguoi_dung (ten_dang_nhap, ho_ten, email, so_dien_thoai, mat_khau_hash, vai_tro, trang_thai)
VALUES 
('admin', 'Quản Trị Viên', 'admin@library.dtu.edu.vn', '0901234567', 'admin', 'admin', 'active'),
('librarian', 'Thủ Thư', 'librarian@library.dtu.edu.vn', '0909876543', 'librarian', 'librarian', 'active');

-- Seed Books Data
INSERT INTO sach (tieu_de, tac_gia, the_loai, mo_ta, nam_xuat_ban, trang_thai, anh_bia) VALUES 
('Nhà Giả Kim', 'Paulo Coelho', 'Văn học', 'Tiểu thuyết về hành trình theo đuổi ước mơ của chàng chăn cừu Santiago.', 1988, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg'),
('Đắc Nhân Tâm', 'Dale Carnegie', 'Kỹ năng sống', 'Cuốn sách nổi tiếng nhất về nghệ thuật ứng xử và thu phục lòng người.', 1936, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1449557778i/4865.jpg'),
('Clean Code', 'Robert C. Martin', 'Công nghệ thông tin', 'Hướng dẫn viết mã sạch, dễ đọc và dễ bảo trì cho lập trình viên.', 2008, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg'),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 'Kỹ năng sống', 'Cuốn sách truyền cảm hứng cho giới trẻ sống hết mình và tìm kiếm đam mê.', 2016, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1476934757i/32607050.jpg'),
('Harry Potter và Hòn Đá Phù Thủy', 'J.K. Rowling', 'Văn học', 'Tập đầu tiên trong bộ truyện Harry Potter nổi tiếng toàn cầu.', 1997, 'Borrowed', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg'),
('Introduction to Algorithms', 'Thomas H. Cormen', 'Công nghệ thông tin', 'Sách giáo khoa kinh điển về thuật toán và cấu trúc dữ liệu.', 2009, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1387741681i/108986.jpg'),
('Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 'Lịch sử', 'Khám phá lịch sử tiến hóa của loài người từ thời tiền sử đến hiện đại.', 2011, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420585954i/23692271.jpg'),
('Dế Mèn Phiêu Lưu Ký', 'Tô Hoài', 'Văn học thiếu nhi', 'Tác phẩm văn học thiếu nhi kinh điển của Việt Nam.', 1941, 'Available', 'https://upload.wikimedia.org/wikipedia/vi/8/8c/De_men_phieu_luu_ky_bia.jpg'),
('Design Patterns', 'Erich Gamma', 'Công nghệ thông tin', 'Các mẫu thiết kế phần mềm hướng đối tượng tái sử dụng.', 1994, 'Maintenance', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg'),
('Mắt Biếc', 'Nguyễn Nhật Ánh', 'Văn học', 'Câu chuyện tình yêu đơn phương đầy cảm động của Ngạn dành cho Hà Lan.', 1990, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1489892070i/34628867.jpg'),
('The Pragmatic Programmer', 'Andrew Hunt', 'Công nghệ thông tin', 'Những lời khuyên thực tế để trở thành một lập trình viên giỏi hơn.', 1999, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099.jpg'),
('Cà Phê Cùng Tony', 'Tony Buổi Sáng', 'Kỹ năng sống', 'Những bài viết hài hước và sâu sắc về cuộc sống, công việc và khởi nghiệp.', 2015, 'Borrowed', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442566046i/26804369.jpg'),
('Lập Trình Và Cuộc Sống', 'Jeff Atwood', 'Công nghệ thông tin', 'Tuyển tập các bài viết hay nhất từ blog Coding Horror.', 2012, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1344265551i/15792683.jpg'),
('Tắt Đèn', 'Ngô Tất Tố', 'Văn học', 'Bức tranh hiện thực về cuộc sống khốn khổ của người nông dân Việt Nam thời Pháp thuộc.', 1939, 'Available', 'https://upload.wikimedia.org/wikipedia/vi/1/1d/Tat_den.jpg'),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Công nghệ thông tin', 'Khám phá những tính năng mạnh mẽ và thanh lịch nhất của JavaScript.', 2008, 'Available', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328834793i/2998152.jpg');
