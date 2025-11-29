# Hướng Dẫn Deploy Ứng Dụng Lên Vercel

Tài liệu này hướng dẫn chi tiết cách đưa ứng dụng Chatbot Thư viện (Fullstack React + Node.js) lên nền tảng Vercel.

## 1. Chuẩn Bị

Đảm bảo bạn đã có:

- Tài khoản [GitHub](https://github.com).
- Tài khoản [Vercel](https://vercel.com) (có thể đăng nhập bằng GitHub).
- Code dự án đã được hoàn thiện ở máy local.

## 2. Cấu Trúc Dự Án

Đảm bảo thư mục gốc của dự án có file `vercel.json` với nội dung sau (đã được tạo tự động):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

## 3. Đẩy Code Lên GitHub

1.  Tạo một Repository mới trên GitHub (ví dụ: `dtu-libbot`).
2.  Mở terminal tại thư mục gốc của dự án và chạy các lệnh sau:

```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
git push -u origin main
```

_(Thay `<USERNAME>` và `<REPO_NAME>` bằng thông tin thực tế của bạn)_

## 4. Deploy Trên Vercel

1.  Truy cập Dashboard của Vercel: https://vercel.com/dashboard
2.  Nhấn nút **"Add New..."** -> **"Project"**.
3.  Ở mục **Import Git Repository**, chọn repo bạn vừa đẩy lên (ví dụ `dtu-libbot`) và nhấn **Import**.

### Cấu Hình Project

Tại màn hình "Configure Project":

1.  **Project Name**: Đặt tên tùy ý (ví dụ: `dtu-libbot`).
2.  **Framework Preset**: Chọn **Vite** (Vercel thường tự nhận diện, nếu không hãy chọn thủ công).
3.  **Root Directory**: Để mặc định (./).
4.  **Build and Output Settings**:

    - **Build Command**: `cd frontend && npm install && npm run build` (Nếu Vercel không tự nhận diện đúng, hãy ghi đè bằng lệnh này).
    - **Output Directory**: `frontend/dist` (Rất quan trọng: vì Vite build ra thư mục `dist` bên trong `frontend`).
    - **Install Command**: `cd frontend && npm install`

    _Lưu ý: Do cấu trúc monorepo đơn giản, cách tốt nhất là để Vercel tự xử lý theo file `vercel.json`. Nếu bạn thấy các mục trên bị mờ hoặc không cần thiết lập do `vercel.json` đã quy định thì cứ để mặc định._

5.  **Environment Variables (Biến môi trường)**:
    Mở rộng phần này và thêm các biến sau (lấy từ file `.env` ở backend):

    - `GEMINI_API_KEY`: `AIzaSy...` (Key của Google Gemini)
    - `NODE_ENV`: `production`

6.  Nhấn **Deploy**.

## 5. Kiểm Tra Kết Quả

- Vercel sẽ tiến hành Build và Deploy. Quá trình này mất khoảng 1-2 phút.
- Nếu thành công, bạn sẽ thấy màn hình chúc mừng và nút **"Visit"**.
- Bấm vào để mở trang web.
- Thử tính năng Chatbot để đảm bảo Backend hoạt động (API `/api/chat-with-ai`).

## 6. Xử Lý Lỗi Thường Gặp

- **Lỗi 404 API**: Kiểm tra lại file `vercel.json` xem phần `routes` đã đúng chưa.
- **Lỗi CORS**: Backend đã được cấu hình `app.use(cors())`, nên thường sẽ hoạt động tốt. Nếu lỗi, hãy đảm bảo Frontend gọi API qua đường dẫn tương đối (ví dụ `/api/...`) hoặc biến môi trường `VITE_API_URL` trỏ đúng về domain của Vercel.
- **Lỗi Build Frontend**: Kiểm tra xem lệnh build có trỏ đúng vào thư mục `frontend` không.

---

**Chúc bạn thành công!**
