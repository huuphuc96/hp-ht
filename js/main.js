/* =========================================================
   MAIN.JS — toàn bộ logic của website cưới
   Không cần sửa file này. Mọi nội dung nằm ở js/config.js
   ========================================================= */
(function () {
  'use strict';

  // Trình duyệt (nhất là Safari/Chrome mobile) hay nhớ vị trí cuộn cũ khi
  // quay lại trang. Tắt đi để khách luôn bắt đầu từ đầu thiệp.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var C = window.WEDDING_CONFIG || {};
  var OPT = C.options || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     0. TIỆN ÍCH
     --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Ảnh placeholder khi chưa có ảnh thật
  function placeholder(label, w, h) {
    w = w || 800; h = h || 600;
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#F7E7E6"/><stop offset="0.5" stop-color="#FDFBF7"/>' +
      '<stop offset="1" stop-color="#DDE6DC"/></linearGradient></defs>' +
      '<rect width="100%" height="100%" fill="url(#g)"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="Georgia,serif" font-size="' + Math.round(Math.min(w, h) / 12) + '" fill="#C9A227" opacity="0.65">' +
      esc(label || '♥') + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function imgTag(src, alt, label, w, h) {
    var fb = placeholder(label, w, h);
    return '<img src="' + esc(src || fb) + '" alt="' + esc(alt) + '" loading="lazy" ' +
      'onerror="this.onerror=null;this.src=\'' + fb + '\'">';
  }

  var dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 3200);
  }

  /* ---------------------------------------------------------
     1. THIỆP CÁ NHÂN HOÁ  ?to=Nguyen-Van-A
     --------------------------------------------------------- */
  var params = new URLSearchParams(location.search);
  var rawTo = (params.get('to') || params.get('guest') || '').trim();
  var guestName = '', guestInfo = {};

  if (rawTo) {
    // 1) Ưu tiên tra trong danh bạ khách mời ở config.js  ->  tên đầy đủ có dấu
    var key = rawTo.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    var book = C.guests || {};
    if (book[key]) {
      guestInfo = book[key];
      guestName = guestInfo.name || '';
    }

    // 2) Không có trong danh bạ thì lấy thẳng từ link
    if (!guestName) {
      guestName = rawTo.replace(/[-_+]/g, ' ').trim();
      // Chỉ tự viết hoa khi link toàn chữ thường (vd ?to=nguyen-van-a).
      // Link đã có chữ hoa hoặc dấu tiếng Việt thì giữ nguyên.
      if (guestName === guestName.toLowerCase()) {
        guestName = guestName.split(/\s+/).map(function (w) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
      }
    }
  }

  /* ---------------------------------------------------------
     2. ĐỔ NỘI DUNG TỪ CONFIG
     --------------------------------------------------------- */
  var G = C.groom || {}, B = C.bride || {};
  var pairShort = (G.shortName || '') + ' & ' + (B.shortName || '');
  var meta = C.meta || {};

  document.title = meta.siteTitle || pairShort;
  if (meta.description) {
    var md = $('meta[name="description"]'); if (md) md.content = meta.description;
    var od = $('meta[property="og:description"]'); if (od) od.content = meta.description;
  }
  var ot = $('meta[property="og:title"]'); if (ot) ot.content = meta.siteTitle || pairShort;

  // Opening
  $('#openingTo').textContent = guestName ? 'Thân mời ' + guestName : 'Thân mời bạn';
  $('#openingNames').textContent = pairShort;
  $('#openingDate').textContent = C.weddingDateText || '';

  // Chữ cái đầu của TÊN (không phải họ) — dùng cho chữ lồng
  function initial(full) {
    var w = String(full || '').trim().split(/\s+/);
    return (w[w.length - 1] || '?').charAt(0).toUpperCase();
  }
  var monoText = initial(G.name) + '&' + initial(B.name);
  var monoDef = $('#monogram .mono__txt');
  if (monoDef) monoDef.textContent = monoText;

  // Hero
  var hero = C.hero || {};
  $('#heroTagline').textContent = hero.tagline || 'Save the date';
  $('#heroDate').textContent = C.weddingDateText || '';

  /* Tên hiện dần TỪNG TIẾNG, không tách từng chữ cái.
     LÝ DO: phông Crimson Text là serif trang nhã — tách mỗi ký tự ra một
     <span> riêng sẽ cắt đứt nét nối, tên trông rời rạc như ghép chữ. Gom theo
     tiếng thì nét bên trong mỗi tiếng vẫn liền mạch mà vẫn có hiệu ứng lần lượt. */
  var charIdx = 0;
  function spellOut(el, text, startDelay) {
    var words = String(text).trim().split(/\s+/).filter(Boolean);
    el.innerHTML = words.map(function (w, i) {
      var d = (startDelay + charIdx * 0.16).toFixed(3);
      charIdx++;
      var sp = i < words.length - 1 ? '<span class="ch ch--space"> </span>' : '';
      return '<span class="ch" style="animation-delay:' + d + 's">' + esc(w) + '</span>' + sp;
    }).join('');
  }
  spellOut($('#heroGroom'), G.shortName || '', 0.35);
  charIdx += 2;
  spellOut($('#heroBride'), B.shortName || '', 0.35);

  // Ảnh nền hero — chỉ bật hiệu ứng khi ảnh tải xong, tránh giật lúc đầu
  var heroPhoto = $('#heroPhoto');
  if (hero.photo) {
    var hp = new Image();
    hp.onload = function () {
      heroPhoto.style.backgroundImage = 'url("' + hero.photo + '")';
      heroPhoto.classList.add('is-ready');
    };
    hp.src = hero.photo;
  }
  $('#heroLunar').textContent = C.lunarDateText || '';
  $('#navBrand').textContent = pairShort;

  // Lời mời
  $('#inviteQuote').textContent = hero.quote || '';
  $('#inviteSub').textContent = guestName
    ? 'Kính gửi ' + guestName + ', ' + (hero.subQuote || '')
    : (hero.subQuote || '');
  $('#groomFather').textContent = G.father || '';
  $('#groomMother').textContent = G.mother || '';
  $('#groomAddress').textContent = G.address || '';
  $('#brideFather').textContent = B.father || '';
  $('#brideMother').textContent = B.mother || '';
  $('#brideAddress').textContent = B.address || '';
  $('#groomChild').textContent = G.childTitle ? G.childTitle + ': ' + G.name : '';
  $('#brideChild').textContent = B.childTitle ? B.childTitle + ': ' + B.name : '';

  // Footer
  $('#footerNames').textContent = pairShort;
  $('#footerDate').textContent = C.weddingDateText || '';

  /* ---------------------------------------------------------
     2b. THIỆP MỜI 3D
     --------------------------------------------------------- */
  var stage = $('#envStage'), envelope = $('#envelope'), envToggle = $('#envToggle');

  // Dấu sáp dùng chung chữ lồng với monogram
  var seal = $('#sealMono');
  if (seal) seal.textContent = monoText;

  var mainEv = (C.events || [])[(C.events || []).length - 1] || {};
  var wd = new Date(C.weddingDate || '');

  /* ----- Đổ nội dung tấm thiệp ----- */
  $('#ecGroomFam').textContent = [G.father, G.mother].filter(Boolean).join('\n');
  $('#ecBrideFam').textContent = [B.father, B.mother].filter(Boolean).join('\n');
  $('#ecGroomAddr').textContent = G.address || '';
  $('#ecBrideAddr').textContent = B.address || '';

  $('#ecGroomTitle').textContent = G.childTitle || 'Chú rể';
  $('#ecBrideTitle').textContent = B.childTitle || 'Cô dâu';
  $('#ecGroomName').textContent = G.name || '';
  $('#ecBrideName').textContent = B.name || '';

  $('#ecGuest').textContent = guestName || 'Quý khách';
  $('#ecWhen').textContent = mainEv.time || C.weddingDateText || '';
  $('#ecLunar').textContent = C.lunarDateText || '';
  $('#ecVenue').textContent = (mainEv.venue || '') +
    (mainEv.address ? '\n' + mainEv.address : '');

  if (!guestName) {
    $('#inviteHint').textContent =
      'Mỗi khách mời nhận một đường link riêng, có sẵn tên mình trên thiệp.';
  } else {
    $('#inviteHint').textContent = 'Tấm thiệp này dành riêng cho ' + guestName + '.';
  }

  /* ---------- Mở / đóng phong bì ---------- */
  function toggleEnvelope(force) {
    var open = typeof force === 'boolean' ? force : !stage.classList.contains('is-open');
    stage.classList.toggle('is-open', open);
    envelope.setAttribute('aria-label', open ? 'Đóng thiệp mời' : 'Mở thiệp mời');
    envToggle.textContent = open ? 'Đóng thiệp' : 'Mở thiệp';
    $('#envHint').textContent = open ? '' : 'Chạm vào phong bì để mở';
  }
  envelope.addEventListener('click', function () { toggleEnvelope(); });
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEnvelope(); }
  });
  envToggle.addEventListener('click', function () { toggleEnvelope(); });

  /* ---------------------------------------------------------
     2b2. TẢI THIỆP VỀ MÁY (vẽ lên canvas rồi xuất PNG)
     --------------------------------------------------------- */
  var dlBtn = $('#cardDownload');

  // Biến một hoa văn trong <defs> thành ảnh để vẽ được lên canvas
  function ornImage(useId, w, h, viewBox) {
    return new Promise(function (resolve) {
      var defs = $('.svg-defs defs');
      if (!defs) return resolve(null);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        'width="' + w + '" height="' + h + '" viewBox="' + viewBox + '">' +
        defs.outerHTML + '<use href="#' + useId + '" xlink:href="#' + useId + '"/></svg>';
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function wrapLines(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function drawLines(ctx, lines, x, y, lh) {
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
    return y + lines.length * lh;
  }

  async function buildCardImage() {
    var cv = $('#cardCanvas'), ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, cx = W / 2;

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) { }
    }

    var g = ctx.createLinearGradient(0, 0, W * .6, H);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(.55, '#FFFCF6'); g.addColorStop(1, '#F8F0E2');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(201,162,39,.42)'; ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeStyle = 'rgba(201,162,39,.22)'; ctx.lineWidth = 1;
    ctx.strokeRect(56, 56, W - 112, H - 112);

    var orn = await ornImage('ornCorner', 168, 168, '0 0 106 106');
    if (orn) {
      var m = 46, sz = 168;
      ctx.drawImage(orn, m, m, sz, sz);
      ctx.save(); ctx.translate(W - m, m); ctx.scale(-1, 1); ctx.drawImage(orn, 0, 0, sz, sz); ctx.restore();
      ctx.save(); ctx.translate(m, H - m); ctx.scale(1, -1); ctx.drawImage(orn, 0, 0, sz, sz); ctx.restore();
      ctx.save(); ctx.translate(W - m, H - m); ctx.scale(-1, -1); ctx.drawImage(orn, 0, 0, sz, sz); ctx.restore();
    }

    var y = 258;
    var sprig = await ornImage('ornSprig', 210, 70, '0 0 120 40');
    if (sprig) ctx.drawImage(sprig, cx - 105, y - 40, 210, 70);

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    y += 72;
    ctx.fillStyle = '#A99070';
    // Ảnh thiệp tải về dùng đúng 2 phông như trên web:
    // Ảnh thiệp tải về dùng đúng 2 phông như trên web:
    // Crimson Text cho tên khách + dấu &, EB Garamond cho mọi thông tin còn lại.
    ctx.font = '500 22px "EB Garamond", Georgia, serif';
    ctx.fillText('T R Â N   T R Ọ N G   K Í N H   M Ờ I', cx, y);

    y += 84;
    var gold = ctx.createLinearGradient(cx - 300, y - 60, cx + 300, y + 20);
    gold.addColorStop(0, '#C9A227'); gold.addColorStop(.22, '#8E6E15');
    gold.addColorStop(.48, '#E6D096'); gold.addColorStop(.74, '#9A7718');
    gold.addColorStop(1, '#C9A227');
    ctx.fillStyle = gold;
    ctx.font = '600 88px "Crimson Text", serif';
    var gLines = wrapLines(ctx, guestName || 'Quý khách', W - 220);
    if (gLines.length > 1) ctx.font = '600 72px "Crimson Text", serif';
    var lh = gLines.length > 1 ? 86 : 0;
    gLines.forEach(function (l, i) { ctx.fillText(l, cx, y + i * lh); });
    y += (gLines.length - 1) * lh;

    y += 26;
    var ug = ctx.createLinearGradient(cx - 190, 0, cx + 190, 0);
    ug.addColorStop(0, 'rgba(217,190,106,0)'); ug.addColorStop(.25, '#D9BE6A');
    ug.addColorStop(.75, '#D9BE6A'); ug.addColorStop(1, 'rgba(217,190,106,0)');
    ctx.fillStyle = ug; ctx.fillRect(cx - 190, y, 380, 1.4);

    y += 44;
    var divider = await ornImage('ornDivider', 320, 38, '0 0 200 24');
    if (divider) ctx.drawImage(divider, cx - 160, y - 20, 320, 38);

    y += 66;
    ctx.fillStyle = '#6E6460';
    ctx.font = '400 29px "EB Garamond", Georgia, serif';
    ctx.fillText('Tới dự buổi tiệc chung vui', cx, y);
    ctx.fillText('cùng gia đình chúng tôi', cx, y + 40);

    y += 128;
    ctx.fillStyle = '#3A3330';
    ctx.font = '500 46px "EB Garamond", Georgia, serif';
    ctx.fillText(G.name || '', cx, y);
    ctx.fillStyle = '#C9A227';
    ctx.font = '600 52px "Crimson Text", serif';
    ctx.fillText('&', cx, y + 52);
    ctx.fillStyle = '#3A3330';
    ctx.font = '500 46px "EB Garamond", Georgia, serif';
    ctx.fillText(B.name || '', cx, y + 108);

    y += 176;
    ctx.fillStyle = '#A8801B';
    ctx.font = '500 28px "EB Garamond", Georgia, serif';
    ctx.fillText(mainEv.time || C.weddingDateText || '', cx, y);

    y += 46;
    ctx.fillStyle = '#3A3330';
    ctx.font = '500 34px "EB Garamond", Georgia, serif';
    if (mainEv.venue) { ctx.fillText(mainEv.venue, cx, y); y += 40; }
    if (mainEv.address) {
      ctx.font = '400 27px "EB Garamond", Georgia, serif';
      ctx.fillStyle = '#6E6460';
      y = drawLines(ctx, wrapLines(ctx, mainEv.address, W - 260), cx, y, 34);
    }

    ctx.fillStyle = '#9A908B';
    ctx.font = 'italic 400 25px "EB Garamond", Georgia, serif';
    ctx.fillText('Sự hiện diện của bạn là niềm vinh hạnh', cx, H - 150);
    ctx.fillText('cho gia đình chúng tôi', cx, H - 118);

    return cv;
  }

  if (dlBtn) {
    dlBtn.addEventListener('click', async function () {
      dlBtn.disabled = true;
      var old = dlBtn.textContent;
      dlBtn.textContent = 'Đang tạo ảnh…';
      try {
        var cv = await buildCardImage();
        var name = 'thiep-cuoi-' +
          (guestName || 'quy-khach').toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
        cv.toBlob(function (blob) {
          if (!blob) { toast('Trình duyệt không tạo được ảnh.'); return; }
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = name;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          toast('Đã tải thiệp về máy!');
        }, 'image/png');
      } catch (err) {
        toast('Chưa tạo được ảnh, bạn thử lại nhé.');
      } finally {
        dlBtn.disabled = false;
        dlBtn.textContent = old;
      }
    });
  }

  /* ---------- Cô dâu & chú rể ---------- */
  function personHtml(p) {
    return '<div class="person reveal">' +
      '<div class="person__photo">' + imgTag(p.photo, p.name, p.shortName || '♥', 600, 800) + '</div>' +
      '<p class="person__role">' + esc(p.role || '') + '</p>' +
      '<h3 class="person__name">' + esc(p.name || '') + '</h3>' +
      '<p class="person__bio">' + esc(p.bio || '') + '</p>' +
      '</div>';
  }
  $('#coupleGrid').innerHTML =
    personHtml(G) + '<div class="couple__heart reveal">&amp;</div>' + personHtml(B);

  /* ---------- Chuyện chúng mình: cuộn phim ---------- */
  var STORY = C.story || [];
  var total = STORY.length;

  $('#timeline').innerHTML =
    '<div class="storyline">' +
      '<div class="storyline__media" aria-hidden="true">' +
        STORY.map(function (s, i) {
          return '<div class="storyline__frame' + (i === 0 ? ' is-on' : '') + '" data-f="' + i + '">' +
            imgTag(s.photo, s.title, s.date, 800, 1000) + '</div>';
        }).join('') +
      '</div>' +
      '<ol class="storyline__steps">' +
        STORY.map(function (s, i) {
          return '<li class="story-step' + (i === 0 ? ' is-on' : '') + '" data-s="' + i + '">' +
            '<div class="story-step__photo">' + imgTag(s.photo, s.title, s.date, 800, 600) + '</div>' +
            '<p class="story-step__date">' + esc(s.date) + '</p>' +
            '<h3 class="story-step__title">' + esc(s.title) + '</h3>' +
            '<p class="story-step__text">' + esc(s.text) + '</p>' +
            '<span class="story-step__num">' + pad(i + 1) + ' / ' + pad(total) + '</span>' +
            '</li>';
        }).join('') +
      '</ol>' +
    '</div>';

  // Mốc nào vào giữa màn hình thì sáng lên và đổi ảnh bên cạnh
  if (total) {
    var frames = $$('.storyline__frame'), steps = $$('.story-step');
    var storyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = +en.target.dataset.s;
        steps.forEach(function (el, k) { el.classList.toggle('is-on', k === i); });
        frames.forEach(function (el, k) { el.classList.toggle('is-on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (el) { storyIO.observe(el); });
  }

  /* ---------- Sự kiện + bản đồ ---------- */
  var EV = C.events || [];
  $('#eventsGrid').innerHTML = EV.map(function (e, i) {
    return '<div class="event reveal">' +
      '<div class="event__icon">' + esc(e.icon || '💐') + '</div>' +
      '<h3 class="event__name">' + esc(e.name) + '</h3>' +
      '<p class="event__time">' + esc(e.time) + '</p>' +
      '<p class="event__venue">' + esc(e.venue) + '</p>' +
      '<p class="event__addr">' + esc(e.address) + '</p>' +
      (e.note ? '<p class="event__note">' + esc(e.note) + '</p>' : '') +
      '<div class="event__actions">' +
        '<a class="btn btn--ghost btn--sm" href="' + esc(e.mapUrl || '#') + '" target="_blank" rel="noopener">Xem bản đồ</a>' +
        '<button class="btn btn--ghost btn--sm" data-dir="' + i + '">Chỉ đường từ chỗ tôi</button>' +
      '</div>' +
      '</div>';
  }).join('');

  /* ---------- Chỉ đường từ vị trí hiện tại ---------- */
  function destOf(e) {
    return (e.venue ? e.venue + ', ' : '') + (e.address || '');
  }
  $('#eventsGrid').addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-dir]');
    if (!b) return;
    var e = EV[+b.dataset.dir];
    if (!e) return;

    var dest = encodeURIComponent(destOf(e));
    function open(origin) {
      var url = 'https://www.google.com/maps/dir/?api=1&destination=' + dest +
        (origin ? '&origin=' + origin : '') + '&travelmode=driving';
      window.open(url, '_blank', 'noopener');
    }

    if (!navigator.geolocation) { open(''); return; }

    var old = b.textContent;
    b.textContent = 'Đang định vị…';
    b.disabled = true;
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        b.textContent = old; b.disabled = false;
        open(pos.coords.latitude.toFixed(6) + ',' + pos.coords.longitude.toFixed(6));
      },
      function () {
        b.textContent = old; b.disabled = false;
        toast('Không lấy được vị trí — mở bản đồ tới địa điểm nhé.');
        open('');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });

  $('#mapTabs').innerHTML = EV.map(function (e, i) {
    return '<button class="mapbox__tab' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' + esc(e.name) + '</button>';
  }).join('');
  var mapFrame = $('#mapFrame');
  function setMap(i) {
    if (!EV[i]) return;
    mapFrame.src = EV[i].mapEmbed || '';
    $$('.mapbox__tab').forEach(function (b, k) { b.classList.toggle('is-active', k === i); });
  }
  $('#mapTabs').addEventListener('click', function (ev) {
    var b = ev.target.closest('.mapbox__tab');
    if (b) setMap(+b.dataset.i);
  });
  setMap(0);

  // Điền select sự kiện trong form RSVP
  var evSel = $('#f_events');
  evSel.innerHTML = '<option value="Tất cả">Tất cả các sự kiện</option>' +
    EV.map(function (e) { return '<option value="' + esc(e.name) + '">' + esc(e.name) + '</option>'; }).join('');

  /* ---------------------------------------------------------
     2c. GÓC CÔNG GIÁO
     --------------------------------------------------------- */
  var FA = C.faith || {};
  if (FA.enabled && (FA.steps || []).length) {
    $('#faith').hidden = false;
    $('#navFaith').hidden = false;
    $('#faithEyebrow').textContent = FA.eyebrow || 'Thánh lễ Hôn phối';
    $('#faithTitle').textContent = FA.title || '';
    $('#faithIntro').textContent = FA.intro || '';

    if (FA.verse) {
      $('#faithVerse').hidden = false;
      $('#faithVerseText').textContent = FA.verse;
      $('#faithVerseRef').textContent = FA.verseRef || '';
    }

    $('#faithSteps').innerHTML = FA.steps.map(function (s) {
      return '<div class="rite__item reveal">' +
        '<span class="rite__time">' + esc(s.time || '') + '</span>' +
        '<span class="rite__dot"></span>' +
        '<h4 class="rite__title">' + esc(s.title) + '</h4>' +
        '<p class="rite__text">' + esc(s.text) + '</p>' +
        '</div>';
    }).join('');

    $('#faithTips').innerHTML = (FA.tips || []).map(function (t) {
      return '<div class="tip reveal">' +
        '<span class="tip__icon">' + esc(t.icon || '•') + '</span>' +
        '<div><p class="tip__title">' + esc(t.title) + '</p>' +
        '<p class="tip__text">' + esc(t.text) + '</p></div></div>';
    }).join('');
  }

  /* ---------------------------------------------------------
     2d. DÒNG THỜI GIAN NGÀY CƯỚI
     --------------------------------------------------------- */
  var DS = C.daySchedule || {};
  var weddingDay = (C.weddingDate || '').split('T')[0];

  function itemDate(it) {
    return new Date((it.date || weddingDay) + 'T' + (it.time || '00:00') + ':00');
  }

  if (DS.enabled && (DS.items || []).length) {
    $('#schedule').hidden = false;
    $('#navSchedule').hidden = false;
    $('#schedTitle').textContent = DS.title || 'Lịch trình';
    $('#schedSub').textContent = DS.subtitle || '';

    var runItems = DS.items.slice().sort(function (a, b) { return itemDate(a) - itemDate(b); });

    $('#runsheet').innerHTML = runItems.map(function (it, i) {
      var d = itemDate(it);
      var dayLabel = (it.date && it.date !== weddingDay)
        ? dayNames[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1)
        : '';
      return '<li class="run reveal" data-i="' + i + '">' +
        '<div class="run__time">' + esc(it.time) +
        (dayLabel ? '<span class="run__day">' + esc(dayLabel) + '</span>' : '') + '</div>' +
        '<div><p class="run__place">' + esc(it.place || '') + '</p>' +
        '<h4 class="run__title">' + esc(it.title) + '</h4>' +
        '<p class="run__text">' + esc(it.text || '') + '</p>' +
        '<span class="run__badge" hidden></span></div></li>';
    }).join('');

    // Đúng ngày cưới thì sáng đèn mục đang diễn ra
    function markNow() {
      var now = Date.now();
      var first = itemDate(runItems[0]).getTime();
      var last = itemDate(runItems[runItems.length - 1]).getTime();
      // chỉ bật trong khoảng từ 12 tiếng trước mục đầu tới 3 tiếng sau mục cuối
      if (now < first - 12 * 36e5 || now > last + 3 * 36e5) return;

      var current = -1;
      for (var i = 0; i < runItems.length; i++) {
        if (itemDate(runItems[i]).getTime() <= now) current = i;
      }
      $$('.run').forEach(function (el, i) {
        el.classList.remove('run--now', 'run--next', 'run--done');
        var badge = $('.run__badge', el);
        badge.hidden = true;
        if (i < current) {
          el.classList.add('run--done');
        } else if (i === current) {
          el.classList.add('run--now');
          badge.hidden = false; badge.textContent = 'Đang diễn ra';
        } else if (i === current + 1) {
          el.classList.add('run--next');
          badge.hidden = false; badge.textContent = 'Tiếp theo';
        }
      });
    }
    markNow();
    setInterval(markNow, 60000);
  }

  /* ---------------------------------------------------------
     2e. CHẾ ĐỘ SAU ĐÁM CƯỚI
     --------------------------------------------------------- */
  var AW = C.afterWedding || {};
  var isAfterWedding = false;
  if (AW.enabled && C.weddingDate) {
    var switchAt = new Date(C.weddingDate).getTime() +
      (AW.switchAfterHours == null ? 6 : AW.switchAfterHours) * 36e5;
    isAfterWedding = Date.now() > switchAt;
  }

  if (isAfterWedding) {
    document.body.classList.add('is-after');

    $('#thanks').hidden = false;
    $('#thanksEyebrow').textContent = AW.eyebrow || '';
    $('#thanksTitle').textContent = AW.title || 'Cảm ơn bạn';
    $('#thanksMsg').textContent = AW.message || '';
    if (AW.albumUrl) {
      var ab = $('#thanksAlbum');
      ab.hidden = false;
      ab.href = AW.albumUrl;
      ab.textContent = AW.albumLabel || 'Xem album ngày cưới';
    }

    // Ẩn những gì không còn ý nghĩa
    $('#countdown').hidden = true;
    $('#rsvp').hidden = true;
    $('#navRsvp').hidden = true;
    $('#schedule').hidden = true;
    $('#navSchedule').hidden = true;
    // Nút "Thêm vào lịch" đã gỡ khỏi hero — phải kiểm tra tồn tại, không thì
    // dòng này ném lỗi và chặn toàn bộ JS chạy sau nó.
    var calBtn = $('#addCalBtn');
    if (calBtn) calBtn.hidden = true;

    // Nút CTA ở hero trỏ sang lời cảm ơn (chỉ còn nếu sau này thêm lại)
    var heroCta = $('.hero__cta .btn--gold');
    if (heroCta) { heroCta.setAttribute('href', '#thanks'); heroCta.textContent = 'Lời cảm ơn'; }
    $('#heroTagline').textContent = 'Chúng mình đã cưới';
  }

  /* ---------------------------------------------------------
     3. ĐẾM NGƯỢC
     --------------------------------------------------------- */
  var target = new Date(C.weddingDate || '2030-01-01T00:00:00').getTime();
  function tick() {
    var d = target - Date.now();
    if (d <= 0) {
      $('#countdown').innerHTML = '<div class="countdown__cell" style="min-width:auto;padding:18px 28px"><b style="font-size:1.5rem">Hôm nay là ngày trọng đại!</b></div>';
      return;
    }
    $('#cdD').textContent = pad(Math.floor(d / 864e5));
    $('#cdH').textContent = pad(Math.floor(d / 36e5) % 24);
    $('#cdM').textContent = pad(Math.floor(d / 6e4) % 60);
    $('#cdS').textContent = pad(Math.floor(d / 1e3) % 60);
  }
  tick(); setInterval(tick, 1000);

  // Hạn RSVP
  var dl = C.rsvpDeadline ? new Date(C.rsvpDeadline) : null;
  $('#rsvpDeadline').textContent = dl
    ? dl.getDate() + '/' + (dl.getMonth() + 1) + '/' + dl.getFullYear()
    : '—';

  /* ---------------------------------------------------------
     4. MỞ THIỆP / MẬT KHẨU
     --------------------------------------------------------- */
  document.body.classList.add('locked');

  function startSite() {
    $('#opening').classList.add('is-open');
    var hm = $('#heroMono'); if (hm) hm.classList.add('is-drawn');
    document.body.classList.remove('locked');
    // Luôn bắt đầu từ đầu trang, kể cả khi trình duyệt vừa khôi phục vị trí cũ
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { window.scrollTo(0, 0); });
    setTimeout(function () { $('#opening').setAttribute('hidden', ''); }, 1000);
    if ((C.music || {}).enabled && (C.music || {}).src) playMusic();
    if (OPT.petalEffect !== false) initPetals();
  }

  if (OPT.passwordProtect) {
    var gate = $('#gate');
    gate.hidden = false;
    $('#opening').style.display = 'none';
    $('#gateBtn').addEventListener('click', function () {
      if ($('#gateInput').value.trim() === String(OPT.password)) {
        gate.hidden = true;
        $('#opening').style.display = '';
      } else {
        $('#gateErr').textContent = 'Mã chưa đúng, bạn thử lại nhé.';
      }
    });
    $('#gateInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') $('#gateBtn').click();
    });
  }

  $('#openBtn').addEventListener('click', startSite);

  // Chữ lồng ở màn hình mở thiệp tự vẽ ngay khi trang tải xong
  requestAnimationFrame(function () {
    var om = $('#openingMono'); if (om) om.classList.add('is-drawn');
  });

  /* ---------------------------------------------------------
     5. NHẠC NỀN
     --------------------------------------------------------- */
  var bgm = $('#bgm'), mt = $('#musicToggle');
  if ((C.music || {}).enabled && (C.music || {}).src) {
    bgm.src = C.music.src;
    bgm.volume = 0.35;
    mt.hidden = false;
  }
  function playMusic() {
    if (!bgm || !bgm.src) return;
    var p = bgm.play();
    if (p && p.then) p.then(function () { mt.classList.add('is-playing'); }).catch(function () { });
  }
  mt.addEventListener('click', function () {
    if (bgm.paused) { playMusic(); }
    else { bgm.pause(); mt.classList.remove('is-playing'); }
  });

  /* ---------------------------------------------------------
     6. NAV + REVEAL
     --------------------------------------------------------- */
  var nav = $('#nav'), burger = $('#burger'), navList = $('#navList');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-stuck', window.scrollY > 60);
  }, { passive: true });
  burger.addEventListener('click', function () {
    burger.classList.toggle('is-open');
    navList.classList.toggle('is-open');
  });
  navList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.classList.remove('is-open');
      navList.classList.remove('is-open');
    }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function observeReveals() { $$('.reveal:not(.is-in)').forEach(function (el) { io.observe(el); }); }
  observeReveals();

  // Highlight mục đang xem
  var sections = $$('section[id], header[id]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      $$('.nav__list a').forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
      });
    });
  }, { threshold: 0.4 });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------------------------------------------------------
     7. MỪNG CƯỚI (VietQR)
     --------------------------------------------------------- */
  var GF = C.gift || {};
  function qrUrl(bank, addInfo) {
    if (!bank || !bank.bankBin || !bank.accountNumber) return '';
    return 'https://img.vietqr.io/image/' + encodeURIComponent(bank.bankBin) + '-' +
      encodeURIComponent(bank.accountNumber) + '-compact2.png' +
      '?accountName=' + encodeURIComponent(bank.accountName || '') +
      '&addInfo=' + encodeURIComponent(addInfo || 'Mung cuoi');
  }
  function giftCard(p) {
    var b = p.bank || {};
    if (!b.accountNumber) return '';
    var url = qrUrl(b, 'Mung cuoi ' + (G.shortName || '') + ' & ' + (B.shortName || ''));
    return '<div class="giftcard reveal">' +
      '<p class="giftcard__role">' + esc(p.role || '') + '</p>' +
      '<h3 class="giftcard__name">' + esc(p.name || '') + '</h3>' +
      (url ? '<div class="giftcard__qr">' + imgTag(url, 'QR ' + p.name, 'QR', 400, 400) + '</div>' : '') +
      '<div class="giftcard__row"><span>Ngân hàng</span><b>' + esc(b.bankName || '') + '</b></div>' +
      '<div class="giftcard__row"><span>Số tài khoản</span><b>' + esc(b.accountNumber) + '</b></div>' +
      '<div class="giftcard__row"><span>Chủ tài khoản</span><b>' + esc(b.accountName || '') + '</b></div>' +
      '<button class="btn btn--ghost btn--sm" data-copy="' + esc(b.accountNumber) + '">Sao chép số TK</button>' +
      '</div>';
  }
  if (OPT.showGift !== false && GF.enabled) {
    var giftHtml = giftCard(G) + giftCard(B);
    if (giftHtml) {
      $('#gift').hidden = false;
      $('#giftTitle').textContent = GF.title || 'Hộp mừng cưới';
      $('#giftMsg').textContent = GF.message || '';
      $('#giftGrid').innerHTML = giftHtml;
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    copyText(b.dataset.copy, 'Đã sao chép: ' + b.dataset.copy);
  });

  function copyText(text, msg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(msg); } catch (err) { toast('Không sao chép được'); }
      document.body.removeChild(ta);
    }
  }

  /* ---------------------------------------------------------
     8. GỬI RSVP → GOOGLE SHEETS
     --------------------------------------------------------- */
  var API = C.apiUrl || '';
  var form = $('#rsvpForm'), msg = $('#rsvpMsg'), submitBtn = $('#rsvpSubmit');

  if (guestName) $('#f_name').value = guestName;
  if (guestInfo.side) {
    var pre = form.querySelector('input[name="side"][value="' + guestInfo.side + '"]');
    if (pre) pre.checked = true;
  }

  // Ẩn/hiện phần chi tiết theo lựa chọn tham dự
  form.addEventListener('change', function (e) {
    if (e.target.name === 'attend') {
      $('#attendExtra').hidden = e.target.value !== 'Có tham dự';
    }
  });

  var LS_KEY = 'wedding_rsvp_sent';
  try {
    if (localStorage.getItem(LS_KEY)) {
      msg.className = 'form__msg ok';
      msg.textContent = 'Bạn đã gửi xác nhận rồi. Gửi lại vẫn được nếu có thay đổi nhé!';
    }
  } catch (err) { }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form__msg';
    msg.textContent = '';

    var name = $('#f_name').value.trim();
    var side = form.querySelector('input[name="side"]:checked');
    var attend = form.querySelector('input[name="attend"]:checked');

    if (!name) { markErr($('#f_name')); return fail('Bạn cho tụi mình xin họ tên nhé.'); }
    if (!side) return fail('Bạn là khách mời của nhà trai hay nhà gái ạ?');
    if (!attend) return fail('Bạn chọn giúp có tham dự được hay không nhé.');

    var going = attend.value === 'Có tham dự';
    var data = {
      name: name,
      phone: $('#f_phone').value.trim(),
      side: side.value,
      attend: attend.value,
      guests: going ? $('#f_guests').value : '0',
      events: going ? $('#f_events').value : '',
      diet: going ? $('#f_diet').value : '',
      transport: going ? $('#f_transport').value : '',
      wish: $('#f_wish').value.trim(),
      invitedAs: guestName || '',
      page: location.href,
      userAgent: navigator.userAgent
    };

    if (!API) {
      console.log('[RSVP] Chưa cấu hình apiUrl. Dữ liệu sẽ gửi:', data);
      msg.className = 'form__msg err';
      msg.textContent = 'Website chưa kết nối Google Sheets. Xem hướng dẫn trong README.md (mục apiUrl).';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi…';

    // text/plain → tránh preflight CORS với Apps Script
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'rsvp', data: data })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          try { localStorage.setItem(LS_KEY, '1'); } catch (err) { }
          msg.className = 'form__msg ok';
          msg.textContent = going
            ? 'Đã nhận xác nhận của bạn. Hẹn gặp bạn trong ngày vui! 🎉'
            : 'Tụi mình đã nhận được phản hồi. Cảm ơn bạn rất nhiều! 💐';
          toast('Gửi thành công — cảm ơn bạn!');
          confettiBurst();
          form.reset();
          $('#attendExtra').hidden = true;
        } else {
          fail((res && res.error) || 'Có lỗi xảy ra, bạn thử lại giúp nhé.');
        }
      })
      .catch(function () {
        fail('Không gửi được. Bạn kiểm tra kết nối mạng rồi thử lại nhé.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi xác nhận';
      });
  });

  function fail(t) {
    msg.className = 'form__msg err';
    msg.textContent = t;
  }
  function markErr(el) {
    el.classList.add('is-err');
    el.focus();
    setTimeout(function () { el.classList.remove('is-err'); }, 2500);
  }

  /* ---------------------------------------------------------
     9. THÊM VÀO LỊCH (.ics)
     --------------------------------------------------------- */
  // Nút đã gỡ khỏi hero. Giữ nguyên đoạn code này để sau muốn thêm lại nút
  // chỉ cần đặt <button id="addCalBtn"> vào HTML là chạy ngay.
  var addCalBtn = $('#addCalBtn');
  if (addCalBtn) addCalBtn.addEventListener('click', function () {
    var start = new Date(C.weddingDate);
    var end = new Date(start.getTime() + 3 * 3600 * 1000);
    function fmt(d) { return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }
    var main = EV[EV.length - 1] || {};
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding//VN', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@wedding',
      'DTSTAMP:' + fmt(new Date()),
      'DTSTART:' + fmt(start),
      'DTEND:' + fmt(end),
      'SUMMARY:Đám cưới ' + pairShort,
      'LOCATION:' + ((main.venue || '') + ' - ' + (main.address || '')),
      'DESCRIPTION:' + (meta.description || ''),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var a = document.createElement('a');
    a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    a.download = 'dam-cuoi.ics';
    a.click();
    toast('Đã tải file lịch — mở lên để thêm vào điện thoại nhé!');
  });

  /* ---------------------------------------------------------
     10. CHIA SẺ
     --------------------------------------------------------- */
  $('#shareBtn').addEventListener('click', function () {
    var d = { title: meta.siteTitle || pairShort, text: meta.description || '', url: location.href };
    if (navigator.share) navigator.share(d).catch(function () { });
    else copyText(location.href, 'Đã sao chép link thiệp!');
  });
  $('#copyBtn').addEventListener('click', function () {
    copyText(location.href, 'Đã sao chép link thiệp!');
  });

  /* ---------------------------------------------------------
     11. HIỆU ỨNG CÁNH HOA
     --------------------------------------------------------- */
  var petalsStarted = false;
  function initPetals() {
    if (petalsStarted) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    petalsStarted = true;

    var cv = $('#petals'), ctx = cv.getContext('2d');
    var W, H, items = [];
    var colors = ['#F7E7E6', '#EFD3D1', '#FDF4F3', '#F6E3D8', '#FFFFFF'];
    var COUNT = window.innerWidth < 700 ? 16 : 30;

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < COUNT; i++) {
      items.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 5 + Math.random() * 8,
        sp: 0.35 + Math.random() * 0.9,
        sw: 0.4 + Math.random() * 1.1,
        a: Math.random() * Math.PI * 2,
        av: (Math.random() - 0.5) * 0.02,
        c: colors[(Math.random() * colors.length) | 0],
        o: 0.45 + Math.random() * 0.45
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < items.length; i++) {
        var p = items[i];
        p.y += p.sp;
        p.x += Math.sin(p.y / 55) * p.sw * 0.5;
        p.a += p.av;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.globalAlpha = p.o;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* Pháo giấy nhỏ khi gửi RSVP thành công */
  function confettiBurst() {
    var cv = $('#petals'), ctx = cv.getContext('2d');
    if (!cv.width) { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    var parts = [], colors = ['#C9A227', '#EFD3D1', '#C3D3C2', '#FFFFFF', '#D9BE6A'];
    for (var i = 0; i < 90; i++) {
      parts.push({
        x: window.innerWidth / 2, y: window.innerHeight * 0.62,
        vx: (Math.random() - 0.5) * 13, vy: -6 - Math.random() * 11,
        s: 3 + Math.random() * 5, c: colors[(Math.random() * colors.length) | 0],
        life: 90 + Math.random() * 40
      });
    }
    var t = 0;
    (function run() {
      t++;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life > 0) {
          ctx.globalAlpha = Math.min(1, p.life / 50);
          ctx.fillStyle = p.c;
          ctx.fillRect(p.x, p.y, p.s, p.s * 1.6);
        }
      }
      ctx.globalAlpha = 1;
      if (t < 140) requestAnimationFrame(run);
    })();
  }

})();
