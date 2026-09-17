/**
 * ============================================================
 *  BACKEND CHO WEBSITE CƯỚI — Google Apps Script
 *  Ghi dữ liệu RSVP (kèm lời chúc) vào Google Sheet.
 *  Lời chúc chỉ nằm trong Sheet, KHÔNG hiển thị lên website.
 * ============================================================
 *
 *  CÁCH DÙNG (làm 1 lần, mất ~5 phút):
 *  1. Tạo 1 Google Sheet mới → đặt tên "Đám cưới - Khách mời"
 *  2. Menu Tiện ích mở rộng (Extensions) → Apps Script
 *  3. Xoá hết code mẫu, dán TOÀN BỘ file này vào
 *  4. Sửa EMAIL_NOTIFY bên dưới thành email của bạn (hoặc để '' nếu không cần)
 *  5. Bấm Deploy → New deployment → chọn type "Web app"
 *       - Execute as:      Me
 *       - Who has access:  Anyone            <-- BẮT BUỘC
 *  6. Copy URL dạng https://script.google.com/macros/s/..../exec
 *  7. Dán URL đó vào js/config.js, dòng  apiUrl: ''
 *
 *  Muốn xem dữ liệu dạng Excel: trong Sheet chọn File → Tải xuống → .xlsx
 */

// ==== CẤU HÌNH ====
var SHEET_RSVP    = 'RSVP';
var EMAIL_NOTIFY  = 'huuphucitc@gmail.com';   // vd: 'huuphucitc@gmail.com' — để '' nếu không muốn nhận mail

var HEADERS = [
  'Thời gian', 'Họ tên', 'Điện thoại', 'Khách của',
  'Tham dự', 'Số người', 'Sự kiện', 'Lưu ý món ăn', 'Di chuyển',
  'Lời chúc', 'Tên trên thiệp', 'Link thiệp'
];

// ------------------------------------------------------------
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var payload = JSON.parse(e.postData.contents);
    if (payload.action !== 'rsvp') return json({ ok: false, error: 'Hành động không hợp lệ' });

    var d = payload.data || {};
    if (!d.name) return json({ ok: false, error: 'Thiếu họ tên' });

    var sh = getSheet(SHEET_RSVP, HEADERS);
    sh.appendRow([
      new Date(),
      d.name, d.phone, d.side,
      d.attend, d.guests, d.events, d.diet, d.transport,
      d.wish, d.invitedAs, d.page
    ]);

    notify(d);
    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) { }
  }
}

// ------------------------------------------------------------
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'stats') {
    return json({ ok: true, data: stats() });
  }

  return json({ ok: true, message: 'Wedding API đang hoạt động ♥' });
}

// ------------------------------------------------------------
function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#F7E7E6');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function notify(d) {
  if (!EMAIL_NOTIFY) return;
  try {
    var icon = d.attend === 'Có tham dự' ? '🎉' : '😢';
    MailApp.sendEmail({
      to: EMAIL_NOTIFY,
      subject: icon + ' RSVP mới: ' + d.name + ' — ' + d.attend,
      htmlBody:
        '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7">' +
        '<h2 style="color:#C9A227">Có khách vừa xác nhận</h2>' +
        row('Họ tên', d.name) + row('Điện thoại', d.phone) +
        row('Khách của', d.side) + row('Tham dự', d.attend) + row('Số người', d.guests) +
        row('Sự kiện', d.events) + row('Món ăn', d.diet) + row('Di chuyển', d.transport) +
        row('Lời chúc', d.wish) +
        '<p style="margin-top:18px"><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Mở bảng khách mời</a></p>' +
        '</div>'
    });
  } catch (err) { }
}

function row(k, v) {
  if (!v) return '';
  return '<p style="margin:2px 0"><b>' + k + ':</b> ' + v + '</p>';
}

// ------------------------------------------------------------
// Thống kê nhanh — chạy trực tiếp trong Apps Script để xem kết quả
function stats() {
  var sh = getSheet(SHEET_RSVP, HEADERS);
  var last = sh.getLastRow();
  if (last < 2) return { total: 0, going: 0, notGoing: 0, people: 0 };

  var rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var going = 0, notGoing = 0, people = 0, seen = {};
  rows.forEach(function (r) {
    var key = String(r[1]).trim().toLowerCase();
    if (seen[key]) return;          // bỏ trùng, lấy lần gửi mới nhất
    seen[key] = true;
    if (r[4] === 'Có tham dự') {
      going++;
      people += parseInt(r[5], 10) || 1;
    } else notGoing++;
  });
  var out = { total: going + notGoing, going: going, notGoing: notGoing, people: people };
  Logger.log(JSON.stringify(out));
  return out;
}

// Tạo menu tiện lợi ngay trong Google Sheet
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💐 Đám cưới')
    .addItem('Xem thống kê khách mời', 'showStats')
    .addToUi();
}

function showStats() {
  var s = stats();
  SpreadsheetApp.getUi().alert(
    'THỐNG KÊ KHÁCH MỜI\n\n' +
    'Tổng phản hồi: ' + s.total + '\n' +
    'Sẽ tham dự: ' + s.going + ' lượt xác nhận\n' +
    'Không tham dự: ' + s.notGoing + '\n' +
    'Tổng số người dự kiến: ' + s.people + ' người'
  );
}
