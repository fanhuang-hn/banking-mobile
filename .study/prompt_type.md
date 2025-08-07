# 🎯 Các Kiểu Prompt Thường Dùng

## 📋 Tổng quan
Đây là các kiểu prompt phổ biến khi làm việc với AI/LLM để đạt hiệu quả tối ưu.

---

## 1. 🤖 Zero-shot Prompting

### 📝 Định nghĩa
Đặt câu hỏi trực tiếp mà không cung cấp ví dụ hay ngữ cảnh thêm.

### 🎯 Khi nào dùng
- Hỏi định nghĩa, giải thích khái niệm
- Dịch thuật ngôn ngữ
- Tổng hợp thông tin nhanh
- Câu hỏi đơn giản, rõ ràng

### 💡 Ví dụ
```
Robot ơi, cộng 3 + 4 bằng mấy?
```

```
Giải thích cho tôi React là gì?
```

---

## 2. 🧩 Few-shot Prompting

### 📝 Định nghĩa
Cung cấp một vài ví dụ mẫu trước khi đặt câu hỏi chính.

### 🎯 Khi nào dùng
- Tạo nội dung theo format có sẵn
- Viết email, tin tuyển dụng
- Phân loại dữ liệu
- Cần output theo pattern cụ thể

### 💡 Ví dụ
```
Ví dụ: 
1 + 2 = 3
2 + 3 = 5
4 + 1 = 5

Vậy robot ơi, 5 + 7 = ?
```

```
Ví dụ email chúc mừng:
"Chúc mừng bạn đã được tuyển dụng vào vị trí Developer!"

Hãy viết email chúc mừng cho vị trí Marketing Manager.
```

---

## 3. 🧠 Chain of Thought (CoT)

### 📝 Định nghĩa
Yêu cầu AI suy nghĩ từng bước một cách logic và có lý do.

### 🎯 Khi nào dùng
- Giải bài toán phức tạp
- Lập kế hoạch chi tiết
- Phân tích vấn đề đa chiều
- Cần lý do và logic rõ ràng

### 💡 Ví dụ
```
Hãy giải bài toán: 12 cái kẹo chia cho 3 bạn.
Suy nghĩ từng bước:
1. Tổng số kẹo: 12
2. Số người chia: 3
3. Phép tính: 12 ÷ 3 = ?
```

```
Lập kế hoạch marketing cho sản phẩm mới:
1. Phân tích thị trường
2. Xác định target audience
3. Chọn kênh marketing
4. Thiết kế campaign
5. Đo lường hiệu quả
```

---

## 📊 So sánh các kiểu Prompt

| Kiểu | Độ phức tạp | Thời gian | Độ chính xác | Use case |
|------|-------------|-----------|--------------|----------|
| Zero-shot | Thấp | Nhanh | Trung bình | Câu hỏi đơn giản |
| Few-shot | Trung bình | Trung bình | Cao | Format cụ thể |
| CoT | Cao | Chậm | Rất cao | Logic phức tạp |

---

## 🎯 Tips để viết Prompt hiệu quả

1. **Rõ ràng và cụ thể**: Tránh mơ hồ
2. **Cung cấp context**: Đưa thông tin cần thiết
3. **Định dạng output**: Chỉ rõ muốn kết quả như thế nào
4. **Sử dụng ví dụ**: Few-shot cho pattern phức tạp
5. **Chia nhỏ task**: CoT cho bài toán lớn

---

## 📚 Tài liệu tham khảo
- OpenAI Prompt Engineering Guide
- Anthropic Claude Best Practices
- Google Bard Prompting Tips