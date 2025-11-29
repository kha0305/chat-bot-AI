-- Seed Users (Admin & Librarian)
-- Passwords are plain text for demo purposes. In production, use bcrypt hashes.

INSERT INTO nguoi_dung (ten_dang_nhap, ho_ten, email, so_dien_thoai, mat_khau_hash, vai_tro, trang_thai)
VALUES 
('admin', 'Quản Trị Viên', 'admin@library.dtu.edu.vn', '0901234567', 'admin', 'admin', 'active'),
('librarian', 'Thủ Thư', 'librarian@library.dtu.edu.vn', '0909876543', 'librarian', 'librarian', 'active');
