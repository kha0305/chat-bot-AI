# 📚 DTU Library Chatbot AI

Hệ thống Chatbot hỗ trợ thư viện thông minh, tích hợp AI để tư vấn sách, tra cứu thông tin và quản lý mượn trả sách.

![Project Screenshot](https://via.placeholder.com/800x400?text=DTU+Library+Chatbot+Preview)

## 🚀 Tính Năng Chính

- **🤖 Chatbot AI Thông Minh**: Sử dụng Google Gemini để trả lời câu hỏi tự nhiên, tư vấn sách theo tâm trạng/nhu cầu.
- **🔍 Tra Cứu Sách**: Tìm kiếm sách theo tên, tác giả, thể loại nhanh chóng.
- **📋 Quản Lý Mượn Trả**: Theo dõi lịch sử mượn sách, phiếu mượn (dành cho Thủ thư).
- **🔐 Hệ Thống Phân Quyền**:
  - **Sinh viên**: Chat, tra cứu, xem lịch sử.
  - **Thủ thư/Admin**: Quản lý kho sách, quản lý phiếu mượn, chat hỗ trợ trực tiếp.
- **💬 Live Chat**: Chế độ chat trực tiếp giữa Thủ thư và Sinh viên khi cần hỗ trợ chuyên sâu.

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (Giao diện hiện đại, Responsive)
- **Lucide React** (Icons)

### Backend

- **Node.js** & **Express**
- **MySQL** (Database)
- **Google Generative AI SDK** (Gemini Integration)

## ⚙️ Cài Đặt & Chạy Local

### Yêu cầu

- Node.js (v16+)
- XAMPP (hoặc MySQL Server riêng lẻ)
- Git

### Bước 1: Cài đặt Database

1. Khởi động **Apache** và **MySQL** trong XAMPP.
2. Truy cập [phpMyAdmin](http://localhost/phpmyadmin).
3. Tạo database mới tên: `library_db`.
4. Import file `backend/database/schema.sql` vào database vừa tạo.
5. (Tùy chọn) Import tiếp `backend/database/seed_users.sql` để tạo tài khoản Admin mặc định.

### Bước 2: Cấu hình Backend

1. Vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Tạo file `.env` (hoặc sửa file có sẵn) với nội dung:
   ```env
   PORT=5000
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=library_db
   ```
3. Cài đặt thư viện và chạy:
   ```bash
   npm install
   npm run dev
   ```
   _Thông báo thành công: "✅ Successfully connected to Local MySQL Database!"_

### Bước 3: Cấu hình Frontend

1. Mở terminal mới, vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt thư viện và chạy:
   ```bash
   npm install
   npm run dev
   ```
3. Truy cập `http://localhost:5173` để sử dụng.

## 👤 Tài Khoản Demo

| Vai trò     | Tên đăng nhập | Mật khẩu    |
| ----------- | ------------- | ----------- |
| **Admin**   | `admin`       | `admin`     |
| **Thủ thư** | `librarian`   | `librarian` |

## 📂 Cấu Trúc Dự Án

```
chat-bot-AI/
├── backend/            # Server Node.js
│   ├── api/            # Các API Endpoints
│   ├── config/         # Cấu hình DB, AI
│   ├── controllers/    # Logic xử lý
│   └── database/       # File SQL script
├── frontend/           # Client ReactJS
│   ├── src/
│   │   ├── components/ # Các UI Component
│   │   ├── services/   # Gọi API
│   │   └── types/      # TypeScript Interfaces
└── README.md           # Tài liệu dự án
```

---

_Developed by [Your Name]_
