# Birthday Wishes 🎈

Ứng dụng nhỏ thu thập lời chúc sinh nhật: bạn bè gửi lời chúc, birthday guy xem tất cả
dưới dạng bubble đáng yêu.

## Cách chạy

```bash
npm install
npm start
```

App chạy ở `http://localhost:8080`.

## Release (deploy lên internet)

Code đã có trên GitHub. Kết nối repo với nền tảng host để mỗi lần push là tự deploy:

### Railway (khuyên dùng — lời chúc lưu bền qua volume)

1. Đăng ký https://railway.app (miễn phí) → **New Project** → **Deploy from GitHub repo** → chọn repo này.
2. Railway tự đọc `railway.json` + `Dockerfile`, build và chạy.
3. **Quan trọng — thêm Volume để giữ lời chúc**: trong tab **Volumes** của service, tạo volume mount vào `/app/data`. Không có volume thì lời chúc mất mỗi lần redeploy.
4. Mở link `https://<tên-service>.up.railway.app` — link gửi lời chúc là gốc, link bubble là `/party/<partySecret>`.

### Render

1. Đăng ký https://render.com → **New** → **Blueprint** → chọn repo này (đọc `render.yaml`).
2. Lưu ý: disk (giữ lời chúc) chỉ có ở gói trả phí (starter trở lên); gói free sẽ mất lời chúc khi redeploy.

### VPS bất kỳ

```bash
docker build -t birthday-wishes .
docker run -d -p 8080:8080 -v $(pwd)/data:/app/data birthday-wishes
```

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