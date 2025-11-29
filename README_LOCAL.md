# Hướng Dẫn Chạy Local (XAMPP/MySQL)

## 1. Cài đặt Database

1. Mở **XAMPP**, bật **Apache** và **MySQL**.
2. Vào **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Tạo database mới tên: `library_db`.
4. Mở terminal tại thư mục `backend` và chạy lệnh:
   ```bash
   npm run db:setup
   ```
   _Lệnh này sẽ tự động tạo bảng và thêm dữ liệu mẫu (Admin, Sách, ...)._

## 2. Cấu hình Backend

1. Vào thư mục `backend`.
2. Mở file `.env`, điền **GEMINI_API_KEY** của bạn vào.
3. Kiểm tra thông tin DB (mặc định XAMPP là user `root`, pass rỗng). Nếu khác thì sửa lại.

## 3. Chạy Ứng Dụng

Mở 2 cửa sổ Terminal (Command Prompt/PowerShell):

**Terminal 1 (Backend):**

```bash
cd backend
npm install
npm run dev
```

_Chờ hiện thông báo: "✅ Successfully connected to Local MySQL Database!"_

**Terminal 2 (Frontend):**

```bash
cd frontend
npm install
npm run dev
```

_Truy cập: `http://localhost:5173`_

## 4. Tài khoản mặc định

- **Admin**: `admin` / `admin`
- **Thủ thư**: `librarian` / `librarian`
