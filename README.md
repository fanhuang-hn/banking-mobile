# Ứng dụng Ví Điện Tử (E-Wallet)

Ứng dụng ví điện tử demo được xây dựng với Next.js 14 và Firebase, hỗ trợ các tính năng thanh toán hiện đại như NFC và QR Code.

## 🚀 Tính năng chính

- **🔐 Xác thực người dùng**: Đăng ký/Đăng nhập với Firebase Auth
- **💰 Quản lý ví**: Xem số dư, lịch sử giao dịch
- **💳 Nạp tiền**: Nạp tiền từ nhiều phương thức thanh toán
- **📱 Thanh toán NFC**: Thanh toán một chạm (hỗ trợ Chrome Android)
- **📷 Thanh toán QR**: Tạo và quét mã QR để thanh toán
- **📊 Lịch sử giao dịch**: Theo dõi và lọc giao dịch
- **📱 Mobile-first**: Tối ưu cho thiết bị di động

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **UI Components**: Headless UI, Lucide React
- **QR Code**: react-qr-code, html5-qrcode
- **NFC**: Web NFC API (Chrome Android)

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- NPM hoặc Yarn
- Tài khoản Firebase

## 🔧 Cài đặt

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd app-web-banking
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình Firebase**:
   - Tạo project Firebase tại [Firebase Console](https://console.firebase.google.com/)
   - Kích hoạt Authentication (Email/Password)
   - Tạo Firestore Database
   - Sao chép cấu hình Firebase

4. **Cấu hình environment variables**:
   Cập nhật file `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. **Khởi chạy ứng dụng**:
   ```bash
   npm run dev
   ```

   Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🎮 Tài khoản Demo

Để test ứng dụng ngay lập tức, bạn có thể sử dụng tài khoản demo:

- **Email**: `demo.user@ewallet.com`
- **Password**: `demo123456`
- **Số dư**: 500,000 VNĐ
- **Lịch sử**: Có sẵn một số giao dịch mẫu

**Cách sử dụng**:
1. Cấu hình Firebase theo hướng dẫn trên
2. Truy cập trang đăng nhập
3. Nhấn nút "Tạo & sử dụng tài khoản demo" hoặc nhập thông tin thủ công
4. Đăng nhập và khám phá các tính năng

## 📱 Hướng dẫn sử dụng

### Đăng ký tài khoản mới
1. Truy cập trang chủ
2. Nhấn "Tạo tài khoản mới"
3. Điền thông tin và xác nhận

### Nạp tiền vào ví
1. Đăng nhập vào dashboard
2. Chọn "Nạp tiền"
3. Chọn số tiền và phương thức thanh toán
4. Xác nhận giao dịch

### Thanh toán NFC
1. Chọn "Thanh toán NFC"
2. Nhập thông tin merchant và số tiền
3. Nhấn "Bắt đầu thanh toán NFC"
4. Đưa điện thoại gần thiết bị POS

### Thanh toán QR
1. Chọn "Thanh toán QR"
2. **Tạo QR**: Nhập thông tin để tạo mã QR nhận tiền
3. **Quét QR**: Sử dụng camera để quét mã QR thanh toán

## 🏗️ Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Trang dashboard chính
│   ├── login/            # Trang đăng nhập
│   ├── register/         # Trang đăng ký
│   ├── topup/            # Trang nạp tiền
│   ├── nfc-payment/      # Trang thanh toán NFC
│   ├── qr-payment/       # Trang thanh toán QR
│   └── history/          # Trang lịch sử giao dịch
├── contexts/              # React Contexts
│   └── AuthContext.tsx   # Context xác thực
├── lib/                  # Utilities và cấu hình
│   └── firebase.ts       # Cấu hình Firebase
└── types/                # TypeScript types
    └── index.ts          # Định nghĩa types
```

## 🔒 Bảo mật

- Xác thực Firebase Authentication
- Validation dữ liệu đầu vào
- Firestore Security Rules
- HTTPS mặc định
- Environment variables cho config nhạy cảm

## 📱 Hỗ trợ NFC

NFC chỉ hoạt động trên:
- Chrome Android với Web NFC API
- Thiết bị có chip NFC
- HTTPS (bắt buộc cho Web NFC)

Đối với các trình duyệt khác, ứng dụng sẽ mô phỏng giao dịch NFC.

## 🚀 Deployment

### Vercel (Khuyến nghị)
1. Push code lên GitHub
2. Kết nối với Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Netlify
1. Build project: `npm run build`
2. Upload folder `out/` hoặc `.next/`
3. Cấu hình environment variables

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Issues](../../issues) 
2. Tạo issue mới với mô tả chi tiết
3. Đính kèm logs và screenshots nếu có

## 🔮 Roadmap

- [ ] Push notifications
- [ ] Biometric authentication  
- [ ] Loyalty points system
- [ ] Multi-currency support
- [ ] Offline mode
- [ ] PWA features
