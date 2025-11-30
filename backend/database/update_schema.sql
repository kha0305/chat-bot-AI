CREATE TABLE IF NOT EXISTS thong_bao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT,
    loai VARCHAR(50) DEFAULT 'info',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gioi_thieu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255),
    noi_dung TEXT,
    hinh_anh TEXT,
    thu_tu INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS huong_dan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255),
    noi_dung TEXT,
    thu_tu INT DEFAULT 0
);

-- Seed data for Introduction if empty
INSERT INTO gioi_thieu (tieu_de, noi_dung, hinh_anh, thu_tu)
SELECT 'Về Thư Viện DTU', 'Thư viện Đại học Duy Tân là trung tâm thông tin - thư viện hiện đại, phục vụ nhu cầu giảng dạy, học tập và nghiên cứu của cán bộ, giảng viên và sinh viên toàn trường.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Duy_Tan_University_campus.jpg/1200px-Duy_Tan_University_campus.jpg', 1
WHERE NOT EXISTS (SELECT * FROM gioi_thieu);

-- Seed data for Notification if empty
INSERT INTO thong_bao (tieu_de, noi_dung, loai)
SELECT 'Chào mừng tân sinh viên K29', 'Thư viện tổ chức buổi hướng dẫn sử dụng thư viện cho tân sinh viên vào ngày 15/10.', 'info'
WHERE NOT EXISTS (SELECT * FROM thong_bao);

-- Seed data for Guide if empty
INSERT INTO huong_dan (tieu_de, noi_dung, thu_tu)
SELECT 'Quy trình mượn sách', 'Bước 1: Tra cứu sách trên hệ thống.\nBước 2: Ghi lại mã sách.\nBước 3: Mang thẻ sinh viên đến quầy thủ thư để làm thủ tục mượn.', 1
WHERE NOT EXISTS (SELECT * FROM huong_dan);
