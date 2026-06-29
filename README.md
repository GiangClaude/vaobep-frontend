Hướng dẫn cài đặt (Getting Started)

1. Yêu cầu hệ thống

  - Node.js >= 18.x
  - Đã cài đặt và khởi chạy Backend API (VaoBep Backend).

2. Cài đặt chi tiết

Bước 1: Clone mã nguồn

git clone <your-repo-url>
cd giangclaude-vaobep-frontend

Bước 2: Cài đặt các thư viện (Dependencies)

npm install

Bước 3: Cấu hình biến môi trường Tạo file .env ở thư mục gốc của frontend và
thêm các thông tin sau:

# URL trỏ tới Backend API của bạn (Mặc định: http://localhost:5000)
REACT_APP_API_URL=http://localhost:5000

# Access Token của Mapbox (Đăng ký tại mapbox.com để lấy key)
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoi...

Bước 4: Khởi chạy ứng dụng

npm start

Ứng dụng sẽ tự động mở trình duyệt tại địa chỉ: http://localhost:3000