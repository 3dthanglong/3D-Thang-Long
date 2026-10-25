/**
 * Nhận đơn hàng từ web Thăng Long 3D: ghi vào Google Sheet và gửi email thông báo cho bạn.
 * Cách cài đặt xem hướng dẫn trong cuộc trò chuyện.
 */
const NOTIFY_EMAIL = "dien-email-cua-ban@gmail.com"; // email sẽ nhận thông báo mỗi khi có đơn
const SHEET_NAME = "Đơn hàng";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const d = data.du_lieu || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Thời gian", "Loại", "Họ tên", "Số điện thoại", "Tổng thanh toán", "Nội dung đầy đủ"]);
    }
    sh.appendRow([
      new Date(),
      safe(data.loai),
      safe(d.ten),
      safe(d.sdt),
      safe(data.tong),
      safe(data.tom_tat)
    ]);
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      "[Thăng Long 3D] " + (data.loai || "Đơn mới") + " từ " + (d.ten || "khách"),
      data.tom_tat || ""
    );
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// Chặn ô bắt đầu bằng = + - @ bị Google Sheet hiểu thành công thức
function safe(v) {
  v = (v === undefined || v === null) ? "" : String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
