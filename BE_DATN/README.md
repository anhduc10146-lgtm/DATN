# BE_DATN
Được chạy trên Render.com

## CÁC BƯỚC CHẠY TRÊN LOCAL
Lưu ý cần cài nodemon với môi trường: node <version 20.12.0>,CSDL với mongoDB để có thể chạy được sản phẩm
Lưu ý chạy đứng từ thư mục: ...\BE_DATN>
Các lệnh theo thứ tự tuần tự
1.Npm install
2.Npm start

## CÁC TÀI KHOẢN + CÁC TRANG WEB HỖ TRỢ + NGUỒN VIDEO HƯỚNG DẪN CẤU HÌNH
Cloud Truyện trên drive của tài khoản:                                                            ***********@gmail.com
Gửi mail thông qua tài khoản:                                                                     ***********@gmail.com
Cloud CSDL trên MongoDB Atlas của tài khoản:                                                      ***********@gmail.com
Dùng api trên [firebase.google.com](https://firebase.google.com/) để tạo OTP thông qua tài khoản: ***********@gmail.com
Phải kích hoạt các quyền cho phép lưu trữ ảnh trên drive cho tài khoản trên trang:                https://console.cloud.google.com/
Phải kích hoạt các quyền cho phép gửi mail cho tài khoản trên trang:                              https://console.cloud.google.com/
API drive thì lấy refresh_token của api Drive API v3 lấy trên trang:                              https://developers.google.com/oauthplayground/
API gmail thì lấy refresh_token của https://mail.google.com trên trang:                           https://developers.google.com/oauthplayground/
--> Nhớ điền OAuth Client ID và OAuth Client secret trong phần Use your own OAuth credentials của Setting bên phải trước khi gen refresh_token

Dùng api trên https://casso.vn để xử lý các thanh toán của thành viên qua tài khoản:              ***********@gmail.com

## CÁC QUY ĐỊNH  VÀ QUY CÁCH ĐẶT TÊN, ĐỂ FILE
TRUYỆN:
- Khi tải và lưu 1 bộ truyện trên drive thì phải để tên bộ truyện không dấu thay khoảng trắng bằng '_' và không được để khoảng trắng ở 2 đầu và cuối tên
-- Ảnh của bộ truyện thì được lưu trữ thẳng trên hệ thống
- Khi tải lên tập truyện thì cần đánh dấu từ 01-xx trong đó xx là số trang của tập truyện đó 
-- Url của tập truyện thì được lưu là id của tập truyện đó trên google drive

## CÁC LƯU Ý KHI CHẠY SEED
B1: Cần kiểm tra tải lên đầy đủ file ảnh trong folder data-seed để chạy được api dữ liệu mẫu thành công không bị lỗi
B2: Để trường newConfigFile là false
Nếu lỗi không kết nối được hãy lên các trang ở phần 1 để lấy refresh_token và OAuth Client ID và OAuth Client điền lại vào phần config trong KeyApiGoogleSeed.js
Sau đó chạy lại API tạo dữ liệu mẫu

## Các lưu ý khi tạo token verify
Gói token được tạo bởi gói các trường sau:
    + _id
    + taiKhoan
    + status
    + ngayTao
    + ngayHetHan
trong đó status là: 0.verify lấy lại mật khẩu 1.verify đăng ký 2.verify lấy lại mật khẩu cho quản trị viên
Lưu ý nếu đã đăng ký nhưng chưa xác thực và muốn xác thực lại và xác thực lấy lại mật khẩu thì sẽ đều để là status bằng 0 vì khi xác thực lại và lấy lại mật khẩu đều cho phép người dùng nhập lại mật khẩu mới
Thời hạn xác thực là 5 phút tương ứng với 5*60*1000 mili giây
# DATN
