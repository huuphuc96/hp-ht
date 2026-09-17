# 💐 Website cưới — HTML / CSS / JS thuần

Website thiệp cưới online, không cần server, host miễn phí trên GitHub Pages,
dữ liệu khách mời đổ thẳng vào Google Sheets.

---

## Có gì trong này

| Tính năng | Mô tả |
|---|---|
| Màn hình mở thiệp | Hiệu ứng "mở phong bì", hiện tên khách nếu dùng link cá nhân hoá |
| Hero điện ảnh | Ảnh nền zoom chậm Ken Burns, tên hiện dần từng chữ, hoa rơi |
| Chữ lồng | Vòng nguyệt quế + chữ đầu tên hai bạn, nét tự vẽ khi tải trang |
| Đếm ngược | Ngày / giờ / phút / giây tới giờ G |
| Chuyện chúng mình | Cuộn phim: ảnh dính một bên đổi theo mốc, chữ trôi bên cạnh |
| Cô dâu & Chú rể | Ảnh khung vòm, đôi dòng giới thiệu |
| Sự kiện + nhà thờ | Lễ Vu Quy, Thánh lễ Hôn phối, Lễ Thành Hôn, Tiệc cưới |
| RSVP | Họ tên, SĐT, khách nhà trai/gái, số người, sự kiện, món ăn, xe đưa đón, lời chúc |
| Lời chúc | Lưu vào Google Sheet, **không** hiển thị lên web |
| Mừng cưới | QR VietQR quét là ra sẵn số tiền + nội dung, nút copy số TK |
| Thiệp cá nhân hoá | `?to=Nguyen-Van-A` → tên khách hiện trên thiệp, form tự điền |
| Thêm vào lịch | Tải file `.ics` cho iPhone/Android/Outlook |
| Tải thiệp về máy | Khách bấm 1 nút, thiệp có tên họ thành ảnh PNG để lưu / đăng Facebook |
| Chỉ đường | Lấy vị trí khách rồi mở Google Maps sẵn tuyến tới từng địa điểm |
| Thiệp mời 3D | Phong bì có dấu sáp khắc chữ lồng, nắp lật lộ lớp lót hoa văn, thiệp trượt ra |
| Nội dung tấm thiệp | Hai họ + địa chỉ, quý nam/quý nữ, nhẫn đôi, tên khách, giờ giấc, ngày âm, nhà hàng, câu kết — đủ như thiệp in |
| Góc Công giáo | Diễn tiến Thánh lễ Hôn phối + lưu ý cho khách chưa quen nhà thờ |
| Lịch trình ngày cưới | Mốc giờ chi tiết, đúng hôm đó tự sáng đèn mục đang diễn ra |
| Sau đám cưới | Qua ngày cưới trang tự chuyển sang lời cảm ơn + album |
| Khác | Chuyển cảnh mở màn kiểu vén rèm, nhạc nền, chia sẻ link, mật khẩu thiệp (tuỳ chọn) |

---

## Cấu trúc thư mục

```
wedding-site/
├── index.html
├── css/style.css
├── js/
│   ├── config.js          ← CHỈ CẦN SỬA FILE NÀY
│   └── main.js
├── assets/
│   ├── img/               ← bỏ ảnh cưới vào đây
│   └── audio/bgm.mp3      ← nhạc nền
├── tools/
│   └── invite-generator.html   ← tạo link thiệp cho từng khách
├── google-apps-script/
│   └── Code.gs            ← dán vào Google Apps Script
└── README.md
```

---

## BƯỚC 1 — Sửa nội dung

Mở `js/config.js`, sửa các dòng trong dấu nháy `'...'`:

- Tên, ba mẹ, địa chỉ, bio cô dâu chú rể
- `weddingDate` — định dạng `'2027-11-20T11:00:00'` (quan trọng, dùng cho đếm ngược VÀ khối ngày trên thiệp)
- Danh sách `story` và `events` (có sẵn Thánh lễ Hôn phối ở nhà thờ — nhớ sửa tên giáo xứ và giờ cha xứ hẹn)
- `guests` — danh bạ khách mời, xem mục bên dưới
- Số tài khoản ngân hàng (xem bảng mã BIN bên dưới)

### Tên khách hiện đủ dấu tiếng Việt

Link `?to=gia-dinh-bac-bay` không mang được dấu. Để thiệp hiện đúng
**"Gia đình Bác Bảy"**, khai báo trong `config.js`:

```js
guests: {
  'gia-dinh-bac-bay': { name: 'Gia đình Bác Bảy', side: 'Nhà trai' },
  'anh-minh':         { name: 'Anh Minh & chị Lan' }
},
```

Khai `side` thì form xác nhận tự tick sẵn nhà trai/nhà gái giúp khách.

Không muốn khai tay? Mở `tools/invite-generator.html`, nhập danh sách khách rồi bấm
**"Sao chép danh bạ cho config.js"** — dán thẳng vào là xong.

**Ảnh:** bỏ vào `assets/img/`, đặt tên đúng như khai trong config
(`hero.jpg`, `bride.jpg`, `groom.jpg`, `story-1.jpg`…).
`hero.jpg` là ảnh nền toàn màn hình — chọn ảnh ngang, tối thiểu 1920px,
chừa khoảng trống ở giữa cho chữ. Để `hero.photo: ''` nếu muốn nền gradient như cũ.
Chưa có ảnh site vẫn chạy — sẽ hiện ô gradient pastel thay thế.

> 💡 Nén ảnh trước khi up (tinypng.com), mỗi ảnh nên < 400 KB. Bề ngang 1600px là dư dùng.

### Mã BIN ngân hàng (cho QR)

| Ngân hàng | BIN | | Ngân hàng | BIN |
|---|---|---|---|---|
| Vietcombank | 970436 | | Techcombank | 970407 |
| VietinBank | 970415 | | MB Bank | 970422 |
| BIDV | 970418 | | ACB | 970416 |
| Agribank | 970405 | | VPBank | 970432 |
| Sacombank | 970403 | | TPBank | 970423 |
| VIB | 970441 | | HDBank | 970437 |
| SHB | 970443 | | SeABank | 970440 |
| OCB | 970448 | | MSB | 970426 |

Ngân hàng khác: tra tại `https://api.vietqr.io/v2/banks`

---

## BƯỚC 2 — Kết nối Google Sheets

1. Tạo Google Sheet mới, đặt tên **Đám cưới – Khách mời**
2. Menu **Tiện ích mở rộng → Apps Script**
3. Xoá code mẫu, dán toàn bộ `google-apps-script/Code.gs`
4. Sửa dòng `var EMAIL_NOTIFY = '';` thành email của bạn nếu muốn nhận mail mỗi lần có khách RSVP
5. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới → Ứng dụng web**
   - Thực thi với tư cách: **Tôi (Me)**
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)** ← **bắt buộc**, nếu chọn sai form sẽ báo lỗi
6. Lần đầu Google hỏi quyền → **Xem lại quyền → Nâng cao → Chuyển đến (không an toàn) → Cho phép**
   (bình thường, vì script do chính bạn viết)
7. Copy link `https://script.google.com/macros/s/AKfycb..../exec`
8. Dán vào `js/config.js`:

```js
apiUrl: 'https://script.google.com/macros/s/AKfycb..../exec',
```

**Xong.** Mỗi lần khách gửi RSVP, một dòng mới xuất hiện trong sheet `RSVP`,
lời chúc nằm ở cột cuối, chỉ bạn xem được.

- Muốn xuất Excel: **Tệp → Tải xuống → Microsoft Excel (.xlsx)**

> ⚠️ Mỗi lần sửa `Code.gs` nhớ **Deploy → Quản lý triển khai → sửa (bút chì) → Phiên bản: Mới → Triển khai**,
> nếu không thay đổi sẽ không có hiệu lực.

---

## BƯỚC 3 — Đưa lên GitHub Pages (miễn phí)

Repo đích: **https://github.com/huuphuc96/hp-ht**
Web sau khi xong: **https://phucthuy.io.vn** (tên miền riêng)
Địa chỉ gốc GitHub: https://huuphuc96.github.io/hp-ht/

Đã có sẵn `.github/workflows/deploy.yml` — cứ push lên nhánh `main` là GitHub
tự build và deploy, không cần làm gì thêm.

### Cách A — Chạy script (nhanh nhất)

Chuột phải file `push-len-github.ps1` (nằm ngoài thư mục này) → **Run with PowerShell**.

Script tự động: dựng repo, tạo commit, push. Lần đầu GitHub mở cửa sổ đăng nhập
bằng trình duyệt — bấm Authorize là xong, không cần gõ mật khẩu ở đâu cả.

> Chưa có Git? Tải ở https://git-scm.com/download/win rồi chạy lại script.

### Cách B — Gõ tay bằng Git

```bash
cd wedding-site
git init -b main
git add .
git commit -m "website cuoi"
git remote add origin https://github.com/huuphuc96/hp-ht.git
git push -u origin main
```

### Cách C — Kéo thả trên web (không cần cài gì)

1. Mở https://github.com/huuphuc96/hp-ht
2. Bấm **uploading an existing file**
3. Kéo toàn bộ nội dung *bên trong* thư mục `wedding-site` (không kéo cả thư mục cha)
   — nhớ kéo cả thư mục ẩn `.github` để workflow hoạt động
4. **Commit changes**

### Bật Pages (làm 1 lần duy nhất)

1. Mở https://github.com/huuphuc96/hp-ht/settings/pages
2. **Source** → chọn **GitHub Actions**
3. Xem tiến trình tại https://github.com/huuphuc96/hp-ht/actions — chấm xanh là xong
4. Vào https://phucthuy.io.vn

Từ lần sau, mỗi lần push là web tự cập nhật sau ~1 phút.

### Tên miền riêng phucthuy.io.vn

Đã gắn sẵn. Cấu hình gồm hai phần:

**1. Bên GitHub** — Settings → Pages → mục "Custom domain" điền `phucthuy.io.vn` → Save.
File `CNAME` ở gốc repo là lưới an toàn, phòng khi sau này đổi cách deploy.

**2. Bên nhà cung cấp tên miền** — tạo 4 bản ghi A và 1 bản ghi CNAME:

| Host | Loại | Giá trị | TTL |
|---|---|---|---|
| `@` | A | `185.199.108.153` | 3600 |
| `@` | A | `185.199.109.153` | 3600 |
| `@` | A | `185.199.110.153` | 3600 |
| `@` | A | `185.199.111.153` | 3600 |
| `www` | CNAME | `huuphuc96.github.io.` | 3600 |

Bản ghi CNAME trỏ tới `huuphuc96.github.io` — **không kèm** `/hp-ht`.

Xong hết thì đợi DNS lan truyền (thường 15–60 phút, tối đa 24 giờ), rồi quay lại
Settings → Pages tick **Enforce HTTPS** để web chạy https có ổ khoá.

Kiểm tra bằng PowerShell: `Resolve-DnsName phucthuy.io.vn -Type A`

---

## BƯỚC 4 — Tạo link thiệp cho từng khách

Mở `tools/invite-generator.html` bằng trình duyệt (double-click là được):

1. Dán địa chỉ website: `https://phucthuy.io.vn/`
2. Paste danh sách khách mời, mỗi dòng một người
3. Bấm **Tạo link** → **Tải file CSV** để mở bằng Excel

Kết quả: `https://phucthuy.io.vn/?to=gia-dinh-bac-bay`
→ khách mở ra thấy *"Thân mời Nguyen Van A"*, form RSVP tự điền sẵn tên.

---

## Tuỳ chỉnh thêm

**Đổi màu chủ đạo** — mở `css/style.css`, sửa phần `:root` ở đầu file:

```css
--blush:#F7E7E6;   /* hồng pastel  */
--sage:#DDE6DC;    /* xanh pastel  */
--gold:#C9A227;    /* màu nhấn     */
```

**Bật mật khẩu thiệp** — trong `config.js`:

```js
passwordProtect: true,
password: '2012'
```

**Tắt bớt tính năng** — đặt `enabled: false` trong từng mục của `config.js`:
`faith` (góc Công giáo), `daySchedule` (lịch trình),
`afterWedding` (chế độ sau cưới). Riêng `petalEffect` và `showGift` nằm trong `options`.

**Ngày âm lịch** ở `lunarDateText` phải khai tay — mình đã tính sẵn cho 20/11/2027
là *23 tháng 10 năm Đinh Mùi*. Đổi ngày cưới thì nhớ tra lại ngày âm.

**Chữ lồng** — tự lấy chữ cái đầu của TÊN hai bạn (Phúc & Thủy → P&T),
dùng chung cho vòng nguyệt quế ở hero và dấu sáp trên phong bì. Không cần khai gì.

**Chế độ sau đám cưới** — `afterWedding.switchAfterHours` là số tiếng sau giờ cưới
thì trang tự chuyển. Nhớ dán link album vào `albumUrl` trước ngày đó.

**Nhạc nền:** để file `bgm.mp3` vào `assets/audio/`. Trình duyệt chỉ cho phát
sau khi khách bấm "Mở thiệp mời" — đó là lý do có màn hình mở thiệp.

---

## Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| Gửi RSVP báo "chưa kết nối Google Sheets" | `apiUrl` trong config.js còn trống |
| Gửi bị lỗi mạng | Deploy Apps Script chọn sai quyền — phải là **Anyone** |
| Sửa Code.gs mà không thấy tác dụng | Chưa Deploy phiên bản **Mới** |
| Ảnh không hiện | Sai tên file hoặc sai chữ hoa/thường — GitHub phân biệt `Anh.JPG` ≠ `anh.jpg` |
| Bản đồ trắng | `mapEmbed` phải có đuôi `&output=embed` |
| Nút "Chỉ đường từ chỗ tôi" không chạy | Trình duyệt chỉ cho lấy vị trí trên HTTPS — GitHub Pages có sẵn HTTPS nên chỉ lỗi khi mở file trực tiếp từ máy |
| Tải thiệp không ra file | Cần mở từ địa chỉ web thật, không phải mở file `index.html` từ ổ đĩa |
| Trang trắng hoàn toàn | Mở F12 → Console xem lỗi, thường do thiếu dấu phẩy trong `config.js` |
| **Đã push rồi mà web không đổi** | Cache trình duyệt. Bấm **Ctrl + Shift + R**. Nếu vẫn vậy, mở `index.html` tăng `?v=2` thành `?v=3` ở 3 dòng cuối rồi push lại |

---

## Ý tưởng mở rộng (làm thêm nếu muốn)

- QR in trên thiệp giấy dẫn tới link cá nhân hoá
- Slideshow chiếu lời chúc lên màn LED tại tiệc
- Đa ngôn ngữ Việt / Anh cho khách nước ngoài

---

Chúc hai bạn trăm năm hạnh phúc 💕
