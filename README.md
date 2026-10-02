# RingFit - App đo size nhẫn

App tĩnh mobile-first bằng HTML/CSS/JS, có thể deploy trực tiếp lên GitHub Pages.

## Tính năng
- Hiệu chỉnh màn hình bằng cạnh ngắn thẻ ATM/credit card 53,98 mm.
- Đặt nhẫn thật lên màn hình và chỉnh vòng tròn theo đường kính trong.
- Hiển thị đường kính, chu vi, US size và size VN tham khảo.
- Nhập chu vi ngón tay thủ công nếu không có nhẫn mẫu.
- Lưu thông số hiệu chỉnh trong `localStorage` trên thiết bị.
- Không cần backend, database hoặc API.

## Chạy local
Mở trực tiếp `index.html` hoặc dùng Live Server trong VS Code.

## Đưa lên GitHub Pages
1. Tạo repository mới trên GitHub.
2. Upload `index.html`, `style.css`, `script.js` lên thư mục gốc.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**.
5. Branch: `main`, Folder: `/ (root)` → Save.
6. Sau khi GitHub deploy xong, mở URL Pages của repository trên điện thoại.

## Lưu ý đo
Kích thước vật lý hiển thị trên mỗi điện thoại khác nhau, vì vậy bước hiệu chỉnh là bắt buộc nếu muốn đo bằng cách đặt nhẫn trực tiếp lên màn hình.
