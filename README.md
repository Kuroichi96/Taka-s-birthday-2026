# Birthday Wishes 🎈

Ứng dụng nhỏ thu thập lời chúc sinh nhật: bạn bè gửi lời chúc, birthday guy xem tất cả
dưới dạng bubble đáng yêu.

## Cách chạy

```bash
npm install
npm start
```

App chạy ở `http://localhost:8080`.

## Hai đường link

| Ai dùng | Link |
|---|---|
| Bạn bè gửi lời chúc | `/` (trang chính) |
| Birthday guy xem bubble | `/party/<partySecret>` |

Mã bí mật của link party nằm trong `config.json` (`partySecret`). Đổi nó trước khi chia sẻ.

## Tuỳ chỉnh

- **Tên birthday guy** — sửa `birthdayPerson` trong `config.json`.
- **Ai cũng gửi được** — không có danh sách cố định; ai có link đều gửi lời chúc, tự nhập tên và có thể upload ảnh đại diện.
- **Lời chúc đã gửi** — lưu trong `data/wishes.json` (tự tạo khi chạy lần đầu, không cần quan tâm).

## Ghi chú

- Mỗi lần gửi là một lời chúc mới (gửi nhiều lần sẽ có nhiều bubble).
- Lời chúc lưu trên server (file JSON), nên gửi từ PC nào cũng được và birthday guy xem được tất cả.
- Ảnh đại diện được nén về 176×176 ngay trên trình duyệt trước khi gửi.