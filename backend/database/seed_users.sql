-- Script to seed default Admin and Librarian accounts
-- Run this in DBeaver connected to your Aiven MySQL database

INSERT INTO nguoi_dung (ho_ten, email, so_dien_thoai, mat_khau_hash, vai_tro, trang_thai)
VALUES 
-- Admin Account
-- Username to login: 'admin' (matches so_dien_thoai) or 'admin@dtu.edu.vn'
('Quản Trị Viên', 'admin@dtu.edu.vn', 'admin', 'admin', 'admin', 'active'),

-- Librarian Account
-- Username to login: 'librarian' (matches so_dien_thoai) or 'librarian@dtu.edu.vn'
('Nhân Viên Thư Viện', 'librarian@dtu.edu.vn', 'librarian', 'librarian', 'librarian', 'active');
