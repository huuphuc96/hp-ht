/* ==========================================================================
   CONFIG.JS  —  SỬA DUY NHẤT FILE NÀY LÀ ĐỦ
   Mọi nội dung của website đám cưới đều nằm ở đây.
   Không cần biết code cũng sửa được: chỉ đổi chữ trong dấu nháy '...'
   ========================================================================== */

window.WEDDING_CONFIG = {

  /* ---------- 1. THÔNG TIN CƠ BẢN ---------- */
  groom: {
    name: 'Huỳnh Hữu Phúc',
    shortName: 'Hữu Phúc',
    role: 'Chú rể',
    childTitle: 'Quý nam',            // Quý nam / Thứ nam / Út nam
    bio: 'Người thích cà phê sáng, code buổi tối và cười khi thấy nàng bước vào phòng.',
    photo: 'assets/img/groom.jpg',
    father: 'Ông Huỳnh Văn A',        // ⚠️ SỬA: tên ba chú rể
    mother: 'Bà Trần Thị B',          // ⚠️ SỬA: tên mẹ chú rể
    address: 'Đường Quyết Tiến, TP. Pleiku, Gia Lai',
    // Thông tin mừng cưới (để trống '' nếu không muốn hiện)
    bank: {
      bankName: 'Vietcombank',
      bankBin: '970436',            // mã BIN ngân hàng, xem bảng tra trong README
      accountNumber: '0123456789',
      accountName: 'HUYNH HUU PHUC'
    }
  },

  bride: {
    name: 'Nguyễn Hải Thủy',
    shortName: 'Hải Thủy',
    role: 'Cô dâu',
    childTitle: 'Quý nữ',             // Quý nữ / Thứ nữ / Út nữ
    bio: 'Mê hoa tươi, trà chiều và những chuyến đi không có kế hoạch trước.',
    photo: 'assets/img/bride.jpg',
    father: 'Ông Nguyễn Văn C',       // ⚠️ SỬA: tên ba cô dâu
    mother: 'Bà Lê Thị D',            // ⚠️ SỬA: tên mẹ cô dâu
    address: 'Đường Quyết Tiến, TP. Pleiku, Gia Lai',
    bank: {
      bankName: 'Techcombank',
      bankBin: '970407',
      accountNumber: '9876543210',
      accountName: 'NGUYEN HAI THUY'
    }
  },

  /* ---------- 2. NGÀY GIỜ ---------- */
  // Định dạng: 'YYYY-MM-DDTHH:mm:ss' (giờ Việt Nam)
  weddingDate: '2027-11-20T11:00:00',
  weddingDateText: 'Thứ Bảy, ngày 20 tháng 11 năm 2027',
  lunarDateText: 'Nhằm ngày 23 tháng 10 năm Đinh Mùi',
  rsvpDeadline: '2027-11-01',

  /* ---------- 3. CÂU MỞ ĐẦU ---------- */
  hero: {
    // Ảnh nền toàn màn hình. Thay bằng ảnh cưới của bạn (ngang, tối thiểu 1920px).
    // Để trống '' nếu muốn dùng nền gradient pastel như cũ.
    photo: 'assets/img/hero.jpg',
    tagline: 'Save the date',
    quote: '',
    subQuote: ''
  },

  /* ---------- 4. CHUYỆN CHÚNG MÌNH (timeline) ---------- */
  story: [
    {
      date: '03 / 2019',
      title: 'Lần đầu gặp nhau',
      text: 'Một quán cà phê nhỏ ở Đà Lạt, trời mưa, và chiếc ô chỉ đủ cho một người.',
      photo: 'assets/img/story-1.jpg'
    },
    {
      date: '09 / 2020',
      title: 'Chính thức yêu',
      text: 'Sau 18 tháng làm bạn, một tin nhắn lúc 2 giờ sáng đã thay đổi tất cả.',
      photo: 'assets/img/story-2.jpg'
    },
    {
      date: '06 / 2023',
      title: 'Chuyến đi đầu tiên',
      text: 'Phú Quốc. Cháy nắng, lạc đường, hết pin điện thoại — và vẫn cười suốt.',
      photo: 'assets/img/story-3.jpg'
    },
    {
      date: '02 / 2026',
      title: 'Lời cầu hôn',
      text: 'Vẫn là quán cà phê đó, vẫn trời mưa, nhưng lần này có thêm một chiếc nhẫn.',
      photo: 'assets/img/story-4.jpg'
    },
    {
      date: '20 / 11 / 2027',
      title: 'Và hôm nay...',
      text: 'Chúng mình nói "Đồng ý" trước sự chứng kiến của những người thương yêu nhất.',
      photo: 'assets/img/story-5.jpg'
    }
  ],

  /* ---------- 5. SỰ KIỆN ---------- */
  events: [
    {
      icon: '💍',
      name: 'Lễ Vu Quy',
      time: '08:00 — Thứ Sáu, 19/11/2027',
      venue: 'Tư gia nhà gái',
      address: 'Đường Quyết Tiến, TP. Pleiku, Gia Lai',
      mapUrl: 'https://maps.google.com/?q=Duong+Quyet+Tien+Pleiku+Gia+Lai',
      mapEmbed: 'https://www.google.com/maps?q=Duong+Quyet+Tien+Pleiku+Gia+Lai&output=embed'
    },
    {
      icon: '⛪',
      name: 'Thánh Lễ Hôn Phối',
      time: '08:00 — Thứ Bảy, 20/11/2027',   // ⚠️ SỬA: giờ cha xứ đã hẹn
      venue: 'Nhà thờ Chính toà Pleiku',      // ⚠️ SỬA: tên giáo xứ
      address: '05 Quang Trung, TP. Pleiku, Gia Lai',  // ⚠️ SỬA
      note: 'Kính mong quý khách có mặt trước 15 phút và giữ trang phục lịch sự khi vào nhà thờ.',
      mapUrl: 'https://maps.google.com/?q=Nha+tho+Chinh+toa+Pleiku',
      mapEmbed: 'https://www.google.com/maps?q=Nha+tho+Chinh+toa+Pleiku+Gia+Lai&output=embed'
    },
    {
      icon: '🏮',
      name: 'Lễ Thành Hôn',
      time: '10:00 — Thứ Bảy, 20/11/2027',
      venue: 'Tư gia nhà trai',
      address: 'Đường Quyết Tiến, TP. Pleiku, Gia Lai',
      mapUrl: 'https://maps.google.com/?q=Duong+Quyet+Tien+Pleiku+Gia+Lai',
      mapEmbed: 'https://www.google.com/maps?q=Duong+Quyet+Tien+Pleiku+Gia+Lai&output=embed'
    },
    {
      icon: '🥂',
      name: 'Tiệc Cưới',
      time: '11:00 — Thứ Bảy, 20/11/2027',
      venue: 'Nhà hàng tiệc cưới',      // ⚠️ SỬA: tên nhà hàng
      address: 'TP. Pleiku, Gia Lai',   // ⚠️ SỬA: địa chỉ nhà hàng
      mapUrl: 'https://maps.google.com/?q=Pleiku+Gia+Lai',
      mapEmbed: 'https://www.google.com/maps?q=Pleiku+Gia+Lai&output=embed'
    }
  ],

  /* ---------- 6. DANH BẠ KHÁCH MỜI (tuỳ chọn) ----------
     Dùng khi muốn tên khách hiện ĐẦY ĐỦ DẤU trên thiệp mà link vẫn gọn gàng.
     Khoá bên trái là phần sau ?to= trong link, viết thường không dấu.
     Công cụ tools/invite-generator.html tạo sẵn đoạn này cho bạn — chỉ việc dán vào.

     Không khai báo cũng không sao: site sẽ lấy thẳng tên từ link.          */
  guests: {
    // 'bac-bay':      { name: 'Gia đình Bác Bảy',   side: 'Nhà trai' },
    // 'anh-minh':     { name: 'Anh Minh & chị Lan', side: 'Nhà gái'  },
    // 'lop-12a1':     { name: 'Tập thể lớp 12A1'                     }
  },

  /* ---------- 6b. GÓC CÔNG GIÁO ----------
     Dành cho khách chưa quen nghi thức nhà thờ. Đặt enabled: false để ẩn.  */
  faith: {
    enabled: true,
    eyebrow: 'Thánh lễ Hôn phối',
    title: 'Đôi lời về nghi thức nhà thờ',
    intro: 'Hôn lễ của chúng mình có phần Thánh lễ tại nhà thờ. ' +
           'Nếu bạn chưa từng dự, mấy dòng dưới đây sẽ giúp bạn thoải mái hơn.',

    verse: 'Sự gì Thiên Chúa đã kết hợp, loài người không được phân ly.',
    verseRef: 'Tin Mừng theo Thánh Mát-thêu 19,6',

    // Diễn tiến buổi lễ
    steps: [
      { time: '~10 phút', title: 'Đón và ổn định chỗ', text: 'Khách vào nhà thờ, chọn ghế ngồi. Nhà trai thường bên phải, nhà gái bên trái (nhìn từ cuối lên).' },
      { time: '~15 phút', title: 'Nghi thức nhập lễ', text: 'Cô dâu chú rể tiến lên cung thánh cùng cha mẹ hai bên. Mọi người đứng.' },
      { time: '~15 phút', title: 'Phụng vụ Lời Chúa', text: 'Đọc Kinh Thánh và bài giảng của cha chủ tế về đời sống hôn nhân.' },
      { time: '~10 phút', title: 'Nghi thức Hôn phối', text: 'Phần quan trọng nhất: đôi bạn nói lời thề hứa, trao nhẫn và cha chủ tế chúc lành.' },
      { time: '~25 phút', title: 'Phụng vụ Thánh Thể', text: 'Phần lễ chính. Khách chưa rửa tội thì ngồi tại chỗ, không lên rước lễ.' },
      { time: '~10 phút', title: 'Ký sổ và chụp ảnh', text: 'Đôi bạn ký sổ hôn phối, sau đó cả nhà chụp ảnh lưu niệm trước cung thánh.' }
    ],

    // Vài lưu ý nhỏ — text ngắn gọn, không giáo điều
    tips: [
      { icon: '👔', title: 'Trang phục', text: 'Lịch sự, kín vai và đầu gối. Không cần vest, áo sơ mi gọn gàng là đủ.' },
      { icon: '⏰', title: 'Giờ giấc', text: 'Đến trước 15 phút. Thánh lễ bắt đầu đúng giờ và không chờ được.' },
      { icon: '🔇', title: 'Điện thoại', text: 'Để chế độ im lặng. Chụp ảnh thoải mái nhưng xin đừng dùng đèn flash.' },
      { icon: '🙏', title: 'Không cùng đạo?', text: 'Hoàn toàn thoải mái. Bạn chỉ cần ngồi yên khi mọi người quỳ hoặc đứng — không ai để ý đâu.' },
      { icon: '🍞', title: 'Rước lễ', text: 'Chỉ dành cho người Công giáo đã xưng tội. Bạn cứ ngồi tại chỗ là đúng phép.' },
      { icon: '👏', title: 'Kết lễ', text: 'Vỗ tay chúc mừng sau khi cha tuyên bố thành vợ chồng — lúc đó thì tha hồ!' }
    ]
  },

  /* ---------- 6c. DÒNG THỜI GIAN NGÀY CƯỚI ----------
     Đúng ngày cưới, trang sẽ tự sáng đèn mục đang diễn ra.
     date: bỏ trống = ngày cưới chính (weddingDate ở trên).                 */
  daySchedule: {
    enabled: true,
    title: 'Ngày trọng đại diễn ra thế nào',
    subtitle: 'Để bạn sắp xếp thời gian cho tiện. Đúng hôm đó, mục đang diễn ra sẽ tự sáng lên.',
    items: [
      { date: '2027-11-19', time: '08:00', title: 'Lễ Vu Quy',        place: 'Tư gia nhà gái',           text: 'Nghi thức bên nhà gái, họ hàng thân thiết.' },
      { date: '2027-11-19', time: '18:00', title: 'Tiệc thân mật',    place: 'Tư gia nhà gái',           text: 'Bữa cơm ấm cúng cùng gia đình hai bên.' },
      {                     time: '06:00', title: 'Lễ Xin dâu',       place: 'Tư gia nhà gái',           text: 'Nhà trai sang xin dâu, trao lễ vật.' },
      {                     time: '08:00', title: 'Thánh lễ Hôn phối', place: 'Nhà thờ',                 text: 'Xin quý khách có mặt trước 15 phút.' },
      {                     time: '10:00', title: 'Lễ Thành Hôn',     place: 'Tư gia nhà trai',          text: 'Ra mắt họ hàng nhà trai.' },
      {                     time: '11:00', title: 'Đón khách',        place: 'Nhà hàng',                 text: 'Mời quý khách dùng trà bánh, chụp ảnh lưu niệm.' },
      {                     time: '11:30', title: 'Khai tiệc',        place: 'Nhà hàng',                 text: 'Nghi thức khai tiệc và mời rượu.' },
      {                     time: '14:00', title: 'Kết thúc',         place: 'Nhà hàng',                 text: 'Cảm ơn quý khách đã đến chung vui.' }
    ]
  },

  /* ---------- 6d. SAU ĐÁM CƯỚI ----------
     Qua ngày cưới, trang tự chuyển sang lời cảm ơn:
     ẩn đếm ngược, ẩn form xác nhận, hiện phần cảm ơn + album.                */
  afterWedding: {
    enabled: true,
    switchAfterHours: 6,      // mấy tiếng sau giờ cưới thì chuyển
    eyebrow: 'Ngày 20.11.2027',
    title: 'Cảm ơn bạn đã ở đó',
    message: 'Ngày hôm ấy trọn vẹn là nhờ có bạn. Cảm ơn bạn đã dành thời gian, ' +
             'đã cười, đã chúc phúc và đã trở thành một phần trong ký ức đẹp nhất của chúng mình.',
    albumUrl: '',             // link Google Photos / Drive ảnh phóng sự (để trống thì ẩn nút)
    albumLabel: 'Xem album ngày cưới'
  },

  /* ---------- 7. NHẠC NỀN ---------- */
  music: {
    enabled: true,
    src: 'assets/audio/bgm.mp3',   // bỏ file mp3 vào đây
    title: 'Nhạc nền'
  },

  /* ---------- 8. MỪNG CƯỚI ---------- */
  gift: {
    enabled: true,
    title: 'Hộp mừng cưới',
    message: 'Sự có mặt của bạn đã là món quà lớn nhất. Nếu bạn muốn gửi thêm chút tấm lòng, tụi mình xin trân trọng đón nhận.'
  },

  /* ---------- 9. KẾT NỐI GOOGLE SHEETS ---------- */
  // Dán link Web App lấy được sau khi Deploy Google Apps Script vào đây
  // Xem hướng dẫn chi tiết trong README.md
  apiUrl: 'https://script.google.com/macros/s/AKfycbxbkgH5o0zXzrtF8HT7VAschqMGOsY3InJasBttWr6FYoPnSvH-qcPsFNUQMW3ZFbIz/exec',

  /* ---------- 10. TUỲ CHỌN KHÁC ---------- */
  options: {
    petalEffect: true,        // hiệu ứng cánh hoa rơi
    showGift: true,           // hộp mừng cưới có QR ngân hàng
    passwordProtect: false,   // đặt true nếu muốn khách nhập mật khẩu mới xem được
    password: '2012'
  },

  /* ---------- 11. SEO / CHIA SẺ ---------- */
  meta: {
    siteTitle: 'Hữu Phúc & Hải Thủy — 20.11.2027',
    description: 'Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
    shareImage: 'assets/img/share.jpg'
  }
};
