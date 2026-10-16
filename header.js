/* 작전명 수탉: 사이트 맨 위 메뉴 줄(헤더) 꾸미기
   Bullet Code Editor 의 Head 칸에 아래 한 줄만 넣으면 된다.
   <script src="https://mook-maker.github.io/op-rooster-site/header.js" defer></script>
   하는 일: 검색 단추 숨기기, 작은 「공유」 아이콘, PC 메뉴 글씨 강조,
   폰에서 헤더 키우기 + 헤더 아래에 여섯 꼭지로 바로 가는 줄(그때 ≡ 메뉴 단추는 숨김),
   큰 수탉 그림이 화면 밖으로 나가면 「작전명 수탉」 앞에 작은 수탉이 나타남,
   페이지 맨 아래에 설문 참여 요청 띠.
   주소 뒤에 ?orhdr=off 를 붙이면 꺼지고, ?orhdr=debug 면 찾은 부분에 테두리가 생긴다. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search).get('orhdr');
  if (Q === 'off' || window.__orHeader) return;
  window.__orHeader = true;
  var DEBUG = Q === 'debug';
  var BASE = 'https://mook-maker.github.io/op-rooster-site/';
  var MARK = BASE + 'rooster-mark.png';
  var CARD_IMG = BASE + 'share-card.png';
  var KAKAO_KEY = '3c59af173d83b1a374f190c64135a641';
  var SITE = 'https://www.op-rooster.com';
  var FORM_URL = 'https://forms.gle/cXJSLN9TAD8eHrJU9';
  var PHONE = 760;
  /* 꼭지 (줄에 보일 순서). 한 꼭지에 이름이 여럿이면 같은 자리로 본다 */
  var SECTIONS = [['소개'], ['관계망', '활동과 관계망'], ['관련 기사'], ['의견 나누기'], ['자료실'], ['일정'], ['영상']];
  var log = function () { if (DEBUG) console.log.apply(console, ['[orhdr]'].concat([].slice.call(arguments))); };

  var css = [
    ':root{--or-accent:#7b302d;--or-accent-soft:#f4ebe9;--or-fg:#16181b;--or-fg2:#3b4047;--or-line:#dfe2e6;--or-panel:#fff;--or-bg:var(--sb-bg,#f5f6f7)}',
    /* 검색 숨김 */
    '.or-hide{display:none!important}',
    /* 「작전명 수탉」 글씨 */
    '.or-brand{display:inline-flex!important;align-items:center!important;font-family:"Nanum Myeongjo",serif!important;font-weight:800!important;letter-spacing:-0.01em;color:var(--or-fg)!important;text-decoration:none!important}',
    '.or-brand *{font-family:"Nanum Myeongjo",serif!important;font-weight:800!important}',
    /* 작은 수탉: 처음엔 폭 0, 큰 그림이 사라지면 펼쳐지며 살짝 튀어 오름 */
    '.or-mark{display:inline-block!important;flex:none;height:30px;width:0;margin-right:0;opacity:0;transform:translateY(6px) scale(.6) rotate(-12deg);transform-origin:50% 90%;object-fit:contain;vertical-align:middle;',
    'transition:width .35s ease,margin-right .35s ease,opacity .25s ease,transform .45s cubic-bezier(.34,1.56,.64,1)}',
    '.or-show .or-mark{width:27px;margin-right:8px;opacity:1;transform:none}',
    '@media (prefers-reduced-motion:reduce){.or-mark{transition:opacity .2s}}',
    /* 메뉴 글씨 강조 (PC) */
    '.or-link{font-weight:600!important;color:var(--or-fg2)!important;text-decoration:none!important;position:relative;transition:color .15s}',
    '.or-link::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:2px;background:var(--or-accent);transform:scaleX(0);transform-origin:left;transition:transform .2s ease}',
    '.or-link:hover,.or-link.or-here{color:var(--or-accent)!important}',
    '.or-link:hover::after,.or-link.or-here::after{transform:scaleX(1)}',
    /* 공유 단추 (아이콘만) */
    '.or-share{display:inline-flex;align-items:center;justify-content:center;flex:none;width:38px;height:38px;padding:0;margin:0 4px;border:0;border-radius:8px;background:transparent;color:var(--or-fg2);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:color .15s,background .15s}',
    '.or-share:hover,.or-share[aria-expanded="true"]{color:var(--or-accent);background:var(--or-accent-soft)}',
    '.or-share:focus-visible{outline:2px solid var(--or-accent);outline-offset:2px}',
    '.or-share svg{width:20px;height:20px}',
    /* 공유 창 */
    '.or-pop{position:fixed;z-index:2147483000;width:min(280px,calc(100vw - 24px));background:var(--or-panel);border:1px solid var(--or-line);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.14);padding:10px;font-family:"IBM Plex Sans KR",sans-serif;opacity:0;transform:translateY(-6px);transition:opacity .15s,transform .15s;pointer-events:none}',
    '.or-pop.on{opacity:1;transform:none;pointer-events:auto}',
    '.or-pop p{margin:2px 4px 8px;font-size:13px;color:#5b6168;word-break:keep-all}',
    '.or-pop button,.or-pop a{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;min-height:44px;padding:0 12px;margin:0 0 4px;border:1px solid var(--or-line);border-radius:8px;background:#fff;color:var(--or-fg);font:500 15px/1 "IBM Plex Sans KR",sans-serif;text-decoration:none;cursor:pointer;text-align:left}',
    '.or-pop button:hover,.or-pop a:hover{border-color:var(--or-accent);color:var(--or-accent)}',
    '.or-pop svg{width:18px;height:18px;flex:none}',
    '.or-pop .or-msg{margin:6px 4px 0;font-size:13px;color:var(--or-accent);min-height:1em}',
    /* 꼭지 줄: 메뉴가 ≡ 단추 뒤로 접힌 화면(폰·태블릿)에서만 보이고, 그때 ≡ 단추는 숨긴다 */
    '.or-strip{display:none}',
    'html.or-collapsed .or-strip{display:block;position:sticky;z-index:2147482000;background:var(--or-bg);border-bottom:1px solid var(--or-line);font-family:"IBM Plex Sans KR",sans-serif;margin:0;padding:0;width:100%;box-sizing:border-box}',
    'html.or-collapsed .or-menu{display:none!important}',
    '.or-strip-in{display:flex;gap:2px;overflow-x:auto;padding:0 10px;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-padding:0 10px}',
    '.or-strip-in::-webkit-scrollbar{display:none}',
    '.or-strip a{flex:none;display:inline-block;padding:11px 9px 9px;font-size:15px;line-height:1.2;font-weight:500;color:var(--or-fg2);text-decoration:none;white-space:nowrap;border-bottom:2px solid transparent;-webkit-tap-highlight-color:transparent}',
    '.or-strip a.or-here{color:var(--or-accent);border-bottom-color:var(--or-accent);font-weight:600}',
    '.or-strip::after{content:"";position:absolute;top:0;right:0;bottom:1px;width:26px;background:linear-gradient(90deg,rgba(245,246,247,0),var(--or-bg));pointer-events:none}',
    /* 맨 아래 설문 참여 띠 */
    '.or-foot{margin:48px 0 0;padding:36px 16px 44px;background:var(--or-panel);border-top:1px solid var(--or-line);font-family:"IBM Plex Sans KR",sans-serif;text-align:center;box-sizing:border-box;width:100%}',
    '.or-foot-in{max-width:560px;margin:0 auto}',
    '.or-foot-t{margin:0 0 8px;font-family:"Nanum Myeongjo",serif!important;font-weight:800;font-size:21px;line-height:1.35;color:var(--or-fg);word-break:keep-all}',
    '.or-foot-d{margin:0 0 18px;font-size:15px;line-height:1.65;color:var(--or-fg2);word-break:keep-all}',
    '.or-foot-btn{display:inline-flex;align-items:center;gap:8px;min-height:46px;padding:0 22px;border-radius:8px;background:var(--or-accent);color:#fff!important;font-size:15px;font-weight:600;text-decoration:none!important;-webkit-tap-highlight-color:transparent}',
    '.or-foot-btn:hover{filter:brightness(1.1)}',
    '.or-foot-btn:focus-visible{outline:2px solid var(--or-accent);outline-offset:3px}',
    '.or-foot-btn svg{width:15px;height:15px}',
    /* 폰: 헤더를 크게 */
    '@media (max-width:' + PHONE + 'px){',
    '  .or-head{min-height:64px!important}',
    '  .or-row{min-height:64px!important;align-items:center!important}',
    '  .or-brand{font-size:19px!important}',
    '  .or-show .or-mark{width:30px;margin-right:8px}',
    '  .or-mark{height:33px}',
    '  .or-share{width:42px;height:42px;margin:0 2px}',
    '  .or-share svg{width:22px;height:22px}',
    '}',
    '@media (min-width:' + (PHONE + 1) + 'px){.or-brand{font-size:18px!important}}',
    DEBUG ? '.or-head{outline:2px dashed #0a7!important}.or-brand{outline:2px dashed #07a!important}.or-link{outline:1px dotted #a70}.or-menu{display:inline-flex!important;outline:2px dashed #a07!important;opacity:.35}.or-hide{display:inline-flex!important;outline:2px solid red!important;opacity:.35}.or-strip{outline:2px dashed #70a!important}.or-foot{outline:2px dashed #0a7!important}' : ''
  ].join('\n');

  var ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>';
  var ICON = {
    kakao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.3-2.8c.5.1.9.1 1.4.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v8h4v-8h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>'
  };

  function addStyle() {
    if (document.getElementById('or-hdr-style')) return;
    var s = document.createElement('style'); s.id = 'or-hdr-style'; s.textContent = css;
    document.head.appendChild(s);
  }

  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect(); var cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  }
  function txt(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function isPhone() { return window.innerWidth <= PHONE; }
  function isRoot(a) {
    try { var u = new URL(a.getAttribute('href'), location.href); return (u.pathname === '/' || u.pathname === '') && !u.search && !u.hash; } catch (e) { return false; }
  }
  function ours(el) { return !!el.closest('.or-share,.or-pop,.or-strip'); }

  /* 맨 위 메뉴 줄 찾기: 화면 맨 위에 붙어 있고 폭이 거의 화면 전체인 요소 */
  function findHeader() {
    var W = window.innerWidth, best = null, bestScore = -1;
    var cands = document.querySelectorAll('header,nav,[class*="navbar" i],[class*="nav-bar" i],[class*="header" i],[id*="nav" i],[id*="header" i]');
    for (var i = 0; i < cands.length; i++) {
      var el = cands[i];
      if (el.closest('.notion-page-content,.notion-page,main article') || el.classList.contains('or-strip')) continue;
      var r = el.getBoundingClientRect();
      if (r.width < W * 0.85 || r.height < 28 || r.height > 160) continue;
      var top = r.top + (getComputedStyle(el).position === 'fixed' || getComputedStyle(el).position === 'sticky' ? 0 : window.scrollY);
      if (top > 12 && r.top > 12) continue;
      var score = r.width + (el.tagName === 'HEADER' || el.tagName === 'NAV' ? 50 : 0) + (el.querySelector('a') ? 100 : 0);
      if (score > bestScore) { best = el; bestScore = score; }
    }
    if (!best) {
      var p = document.elementFromPoint(W / 2, 4);
      while (p && p !== document.body) {
        var rr = p.getBoundingClientRect();
        if (rr.width >= W * 0.85 && rr.height >= 28 && rr.height <= 160 && p.querySelector('a')) { best = p; break; }
        p = p.parentElement;
      }
    }
    /* 겉 껍데기까지 올라가기 (같은 크기면 바깥 것) */
    while (best && best.parentElement && best.parentElement !== document.body) {
      var a = best.getBoundingClientRect(), b = best.parentElement.getBoundingClientRect();
      if (Math.abs(a.height - b.height) < 2 && Math.abs(a.width - b.width) < 2) best = best.parentElement; else break;
    }
    return best;
  }

  function isSearch(el) {
    var s = ((el.getAttribute('aria-label') || '') + ' ' + (el.getAttribute('placeholder') || '') + ' ' + (el.getAttribute('title') || '') + ' ' + (typeof el.className === 'string' ? el.className : '') + ' ' + (el.id || '')).toLowerCase();
    if (/search|검색/.test(s)) return true;
    var t = txt(el).toLowerCase();
    return t.length < 24 && (/^search|검색/.test(t) || /(⌘|ctrl)\s*\+?\s*k$/.test(t));
  }
  /* el 또는 box 아래쪽 조상 가운데 검색 표시가 있는지 */
  function searchish(el, box) { for (var e = el; e && e !== box; e = e.parentElement) if (isSearch(e)) return true; return false; }

  var MENUISH = '[aria-label*="menu" i],[aria-label*="메뉴"],[class*="hamburger" i],[class*="menu-toggle" i],[class*="burger" i],[class*="drawer" i],[class*="toggle" i]';
  /* 이 상자 안에 메뉴 단추(또는 메뉴처럼 보이는 것)가 있는가 */
  function hasMenuish(el, menu) {
    if (menu && (el === menu || el.contains(menu))) return true;
    if (el.matches(MENUISH) && !isSearch(el)) return true;
    var l = el.querySelectorAll(MENUISH);
    for (var i = 0; i < l.length; i++) if (!isSearch(l[i]) && !searchish(l[i], el)) return true;
    return false;
  }
  function hasTextLink(el) {
    if (el.tagName === 'A' && txt(el)) return true;
    var l = el.querySelectorAll('a');
    for (var i = 0; i < l.length; i++) if (txt(l[i])) return true;
    return false;
  }

  /* 검색 단추 찾기. 메뉴 단추나 사이트 이름을 같이 품은 상자는 통째로 숨기지 않고 한 단계씩 내려간다. */
  function isMenuEl(el, menu) { return el === menu || (el.matches(MENUISH) && !isSearch(el)); }
  function collectSearch(box, menu, brand, out) {
    if (!box || box === head || box.contains(head) || ours(box) || box === brand || isMenuEl(box, menu)) return;
    var leaf = box.matches('button,a,[role="button"],input');
    var holdsOther = hasMenuish(box, menu) || (brand && box.contains(brand));
    if (!holdsOther && (leaf || !hasTextLink(box))) {
      if (out.indexOf(box) < 0 && !out.some(function (o) { return o.contains(box); })) out.push(box);
      return;
    }
    if (leaf) return;
    var kids = box.children;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (ours(k) || k === brand || isMenuEl(k, menu) || k.tagName === 'STYLE' || k.tagName === 'SCRIPT') continue;
      if (hasMenuish(k, menu) || (brand && k.contains(brand))) { if (!k.matches('button,a,[role="button"],input')) collectSearch(k, menu, brand, out); continue; }
      var iconish = k.matches('svg,img,input') || k.querySelector('svg,img,input');
      if (isSearch(k) || (iconish && !hasTextLink(k) && !txt(k))) collectSearch(k, menu, brand, out);
    }
  }
  function findSearch(head, menu, brand) {
    var out = [], all = head.querySelectorAll('button,a,input,[role="button"],[class*="search" i],[aria-label*="search" i],[aria-label*="검색"],[placeholder*="search" i],[placeholder*="검색"]');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (ours(el) || !isSearch(el)) continue;
      var box = el.closest('button,a,[role="button"]') || el;
      /* 입력칸이면 감싸는 상자 */
      if (el.tagName === 'INPUT') { var p = el.parentElement; if (p && p !== head && p.getBoundingClientRect().width < 420) box = p; }
      collectSearch(box, menu, brand, out);
    }
    return out;
  }

  /* 폰 메뉴 단추: 글씨 없이 그림만 있는 단추 (검색 아님) */
  function findMenuButton(head) {
    var all = head.querySelectorAll('button,[role="button"],' + MENUISH);
    var cands = [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i].closest('button,[role="button"]') || all[i];
      /* 검색 단추 자체이거나 검색 단추 안에 든 것은 제외 (검색이라는 이름의 상자 안에 든 메뉴 단추는 제외하지 않음) */
      var up = el.parentElement ? el.parentElement.closest('button,a,[role="button"]') : null;
      if (ours(el) || isSearch(el) || (up && head.contains(up) && searchish(up, head.parentElement)) || cands.indexOf(el) >= 0) continue;
      var label = ((el.getAttribute('aria-label') || '') + (typeof el.className === 'string' ? el.className : '')).toLowerCase();
      var named = /menu|burger|메뉴|toggle|drawer/.test(label);
      if (named || (!txt(el) && el.querySelector('svg,img,span,div'))) cands.push(el);
    }
    var vis = cands.filter(visible);
    return vis.length ? vis[vis.length - 1] : (cands[cands.length - 1] || null);
  }

  function findBrand(head) {
    var as = head.querySelectorAll('a');
    for (var i = 0; i < as.length; i++) if (!ours(as[i]) && /작전명|수탉|rooster/i.test(txt(as[i]))) return as[i];
    for (i = 0; i < as.length; i++) if (!ours(as[i]) && isRoot(as[i])) return as[i];
    var all = head.querySelectorAll('*');
    for (i = 0; i < all.length; i++) if (all[i].children.length === 0 && /작전명\s*수탉/.test(txt(all[i]))) return all[i];
    return null;
  }

  function samePath(href) {
    try { var p = new URL(href, location.href).pathname.replace(/\/+$/, ''); return !!p && p === location.pathname.replace(/\/+$/, ''); } catch (e) { return false; }
  }
  function markLinks(head, brand) {
    var as = head.querySelectorAll('a');
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      if (a === brand || a.contains(brand) || brand && brand.contains(a) || ours(a) || isSearch(a)) continue;
      if (!txt(a)) continue;
      a.classList.add('or-link');
      a.classList.toggle('or-here', samePath(a.href));
    }
  }

  /* ---------- 폰: 여섯 꼭지로 바로 가는 줄 ---------- */
  function sectionIndex(label) {
    var t = label.replace(/[^가-힣A-Za-z ]/g, '').trim();
    for (var i = 0; i < SECTIONS.length; i++) for (var j = 0; j < SECTIONS[i].length; j++) {
      var a = SECTIONS[i][j]; if (t === a || t.indexOf(a) >= 0) return i;
    }
    return -1;
  }
  function harvestLinks(head, brand) {
    var seen = {}, out = [];
    function take(list, strict) {
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (ours(a) || a === brand || isSearch(a)) continue;
        var t = txt(a); if (!t || t.length > 20) continue;
        var href = a.getAttribute('href'); if (!href || /^(#|javascript:|mailto:|tel:)/i.test(href)) continue;
        var u; try { u = new URL(href, location.href); } catch (e) { continue; }
        if (u.pathname === '/' || u.pathname === '') continue;
        var idx = sectionIndex(t);
        if (strict && idx < 0) continue;
        if (idx < 0 && u.host !== location.host && !/op-rooster\.com$/.test(u.host)) continue;
        var key = u.pathname;
        if (seen[key]) continue; seen[key] = 1;
        out.push({ t: t, u: u.href, i: idx < 0 ? 99 : idx });
      }
    }
    take(head.querySelectorAll('a'), false);
    if (out.length < 3) take(document.querySelectorAll('a'), true);
    if (out.length < 3) take(document.querySelectorAll('.notion-page-link a,a.notion-page-link,.notion-page-link'), true);
    if (out.length >= 3) { try { localStorage.setItem('or-nav', JSON.stringify(out)); } catch (e) {} }
    else { try { var c = JSON.parse(localStorage.getItem('or-nav') || '[]'); if (c.length >= 3) out = c; } catch (e) {} }
    out.sort(function (a, b) { return a.i - b.i; });
    return out;
  }
  var strip;
  function buildStrip(head, brand) {
    var links = harvestLinks(head, brand);
    if (links.length < 2) { log('strip: links not found'); return null; }
    if (!strip) {
      strip = document.createElement('nav'); strip.className = 'or-strip'; strip.setAttribute('aria-label', '바로 가기');
      strip.innerHTML = '<div class="or-strip-in"></div>';
    }
    var inner = strip.firstChild, html = '';
    links.forEach(function (l) { html += '<a href="' + l.u.replace(/"/g, '&quot;') + '"' + (samePath(l.u) ? ' class="or-here"' : '') + '>' + l.t.replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }) + '</a>'; });
    if (inner.innerHTML !== html) inner.innerHTML = html;
    if (!strip.parentElement) {
      var par = head.parentElement, pcs = par ? getComputedStyle(par) : null;
      if (pcs && /flex/.test(pcs.display) && /row/.test(pcs.flexDirection)) { head.appendChild(strip); head.style.flexWrap = 'wrap'; strip.style.flexBasis = '100%'; strip.style.position = 'static'; }
      else head.insertAdjacentElement('afterend', strip);
    }
    var hcs = getComputedStyle(head), r = head.getBoundingClientRect();
    strip.style.top = (hcs.position === 'fixed' || hcs.position === 'sticky') ? Math.round(r.height + Math.max(0, r.top)) + 'px' : '0px';
    /* 지금 보는 꼭지를 가운데쯤으로 */
    var here = inner.querySelector('.or-here');
    if (here && !strip.__scrolled) { strip.__scrolled = true; inner.scrollLeft = Math.max(0, here.offsetLeft - (inner.clientWidth - here.offsetWidth) / 2); }
    return strip;
  }

  /* ---------- 맨 아래 설문 참여 띠 ---------- */
  var ICON_OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';
  var foot;
  function buildFoot() {
    if (foot && document.body.contains(foot)) return foot;
    if (!foot) {
      foot = document.createElement('section'); foot.className = 'or-foot'; foot.setAttribute('aria-label', '설문 참여 요청');
      foot.innerHTML = '<div class="or-foot-in"><p class="or-foot-t">설문에 참여해 주세요</p>' +
        '<p class="or-foot-d">작전명 수탉이 여러분의 생각을 묻는 설문을 진행하고 있어요. 잠시 시간을 내어 답해 주시면 큰 힘이 돼요.</p>' +
        '<a class="or-foot-btn" href="' + FORM_URL + '" target="_blank" rel="noopener">설문 참여하기' + ICON_OUT + '</a></div>';
    }
    /* 본문이 든 가장 바깥 상자의 부모 끝에 붙인다 (스크롤 상자 안이면 그 안의 끝) */
    var host = document.body;
    var content = document.querySelector('.notion-page-content,.notion-page,main,article,[class*="notion-page" i]');
    if (content && !head.contains(content)) {
      var e = content;
      while (e.parentElement && e.parentElement !== document.body) {
        var pcs = getComputedStyle(e.parentElement);
        if (/(auto|scroll)/.test(pcs.overflowY) && e.parentElement.scrollHeight > e.parentElement.clientHeight + 2) break;
        e = e.parentElement;
      }
      host = e.parentElement || document.body;
      var hcs = getComputedStyle(host);
      if (/flex/.test(hcs.display) && /row/.test(hcs.flexDirection)) host = document.body;
    }
    host.appendChild(foot);
    return foot;
  }

  /* ---------- 공유 ---------- */
  var pop, popMsg;
  function shareUrl() { var u = location.href.split('#')[0].replace(/[?&]orhdr=[^&]*/, '').replace(/\?$/, ''); return /bullet\.site|pages\.dev/.test(location.host) ? SITE + location.pathname : u; }
  function shareTitle() { var t = (document.title || '').trim(); return t && !/^작전명 수탉/.test(t) ? t + ' | 작전명 수탉' : '작전명 수탉 Operation Rooster'; }
  function say(t) { if (popMsg) popMsg.textContent = t; }
  function oldCopy(v) {
    var ta = document.createElement('textarea'); ta.value = v; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok;
  }
  function copy(v) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(v).then(function () { return true; }, function () { return oldCopy(v); });
    return Promise.resolve(oldCopy(v));
  }
  function loadKakao() {
    if (!KAKAO_KEY || window.Kakao || document.getElementById('or-kakao-sdk')) return;
    var sc = document.createElement('script'); sc.id = 'or-kakao-sdk'; sc.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'; sc.crossOrigin = 'anonymous'; sc.async = true;
    document.head.appendChild(sc);
  }
  function kakaoCard() {
    try {
      if (!window.Kakao || !Kakao.Share) return false;
      if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY);
      var u = shareUrl();
      Kakao.Share.sendDefault({ objectType: 'feed',
        content: { title: shareTitle(), description: '살처분 중심의 방역체계를 바꾸는 작전', imageUrl: CARD_IMG, imageWidth: 800, imageHeight: 400, link: { mobileWebUrl: u, webUrl: u } },
        buttons: [{ title: '사이트 보기', link: { mobileWebUrl: u, webUrl: u } }] });
      return true;
    } catch (e) { log('kakao', e); return false; }
  }
  var canNative = !!navigator.share;
  function nativeShare() {
    return navigator.share({ title: shareTitle(), text: '작전명 수탉: 살처분 대신 백신과 대안을', url: shareUrl() })
      .then(function () { return true; }, function (e) { return e && e.name === 'AbortError'; });
  }
  function buildPop() {
    if (pop) return pop;
    pop = document.createElement('div'); pop.className = 'or-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', '이 페이지 공유하기');
    pop.innerHTML = '<p>이 페이지를 주변에 알려 주세요.</p>' +
      '<button type="button" data-k="kakao">' + ICON.kakao + '카카오톡</button>' +
      '<button type="button" data-k="copy">' + ICON.copy + '링크 복사</button>' +
      '<a data-k="fb" target="_blank" rel="noopener">' + ICON.fb + '페이스북</a>' +
      '<a data-k="x" target="_blank" rel="noopener">' + ICON.x + 'X</a>' +
      (canNative ? '<button type="button" data-k="more">' + ICON.more + '다른 앱</button>' : '') +
      '<div class="or-msg" role="status" aria-live="polite"></div>';
    document.body.appendChild(pop);
    popMsg = pop.querySelector('.or-msg');
    pop.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return;
      var k = b.getAttribute('data-k'), u = shareUrl();
      if (k === 'fb' || k === 'x') { setTimeout(closePop, 300); return; }
      if (k === 'kakao') {
        if (kakaoCard()) { closePop(); return; }
        (canNative ? nativeShare() : Promise.resolve(false)).then(function (ok) {
          if (ok) { closePop(); return; }
          copy(u).then(function (c) { say(c ? '주소를 복사했어요. 카카오톡 대화창에 붙여 넣어 주세요.' : u); });
        });
      } else if (k === 'copy') {
        copy(u).then(function (c) { say(c ? '주소를 복사했어요.' : '복사가 막혀 있어요: ' + u); });
      } else if (k === 'more') {
        nativeShare().then(function (ok) { if (ok) closePop(); });
      }
    });
    document.addEventListener('click', function (e) { if (pop.classList.contains('on') && !pop.contains(e.target) && !e.target.closest('.or-share')) closePop(); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
    window.addEventListener('resize', closePop);
    return pop;
  }
  function openPop(btn) {
    buildPop(); loadKakao();
    var u = shareUrl();
    pop.querySelector('[data-k="fb"]').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(u);
    pop.querySelector('[data-k="x"]').href = 'https://x.com/intent/post?text=' + encodeURIComponent(shareTitle()) + '&url=' + encodeURIComponent(u);
    say('');
    var r = btn.getBoundingClientRect(), w = Math.min(280, window.innerWidth - 24);
    pop.style.top = Math.round(r.bottom + 8) + 'px';
    pop.style.left = Math.round(Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12))) + 'px';
    pop.classList.add('on'); btn.setAttribute('aria-expanded', 'true');
    var first = pop.querySelector('button'); if (first) first.focus({ preventScroll: true });
  }
  function closePop() {
    if (!pop) return; pop.classList.remove('on');
    var b = document.querySelector('.or-share'); if (b) b.setAttribute('aria-expanded', 'false');
  }
  function makeShare() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'or-share'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', '공유하기'); b.title = '공유하기';
    b.innerHTML = ICON_SHARE;
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (pop && pop.classList.contains('on')) closePop(); else openPop(b); });
    return b;
  }

  /* ---------- 큰 그림이 사라지면 작은 수탉 ---------- */
  var io, watched, head;
  function findHero() {
    var sel = '.notion-page-icon-hero,.notion-page-cover,.notion-page-cover-wrapper,[class*="page-icon" i] img,[class*="cover" i] img';
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) if (head && head.contains(list[i])) continue; else if (visible(list[i]) || list[i].getBoundingClientRect().height > 0) return list[i];
    var imgs = document.images;
    for (i = 0; i < imgs.length; i++) {
      var im = imgs[i]; if (head && head.contains(im) || ours(im)) continue;
      var r = im.getBoundingClientRect();
      if (r.width >= 56 && r.height >= 56 && r.top + window.scrollY < window.innerHeight * 0.9) return im;
      if (r.top + window.scrollY > window.innerHeight) break;
    }
    return document.querySelector('.notion-title,main h1,h1');
  }
  function watchHero() {
    var hero = findHero();
    if (hero === watched) return;
    if (io) io.disconnect();
    watched = hero;
    log('hero', hero);
    if (!hero) { head && head.classList.add('or-show'); return; }
    var h = head ? head.getBoundingClientRect().bottom : 60;
    io = new IntersectionObserver(function (ents) {
      var e = ents[ents.length - 1];
      if (head) head.classList.toggle('or-show', !e.isIntersecting);
    }, { rootMargin: '-' + Math.max(0, Math.round(h)) + 'px 0px 0px 0px', threshold: 0 });
    io.observe(hero);
  }

  /* ---------- 붙이기 ---------- */
  function setup() {
    addStyle();
    var h = findHeader();
    if (!h) { log('header not found'); return; }
    if (head && head !== h) head.classList.remove('or-head', 'or-show');
    head = h; head.classList.add('or-head');
    var brand = findBrand(head);
    if (brand) {
      brand.classList.add('or-brand');
      if (!brand.querySelector('.or-mark')) {
        var img = document.createElement('img'); img.className = 'or-mark'; img.src = MARK; img.alt = ''; img.setAttribute('aria-hidden', 'true');
        brand.insertBefore(img, brand.firstChild);
      }
      /* 브랜드가 든 줄도 높이 맞추기 */
      var row = brand.parentElement; if (row && row !== head) row.classList.add('or-row');
    }
    markLinks(head, brand);
    /* 전에 숨긴 ≡ 단추를 잠시 되살려 놓고 재야 접힘 여부를 제대로 안다 */
    var root = document.documentElement, wasCollapsed = root.classList.contains('or-collapsed');
    root.classList.remove('or-collapsed');
    var menu = findMenuButton(head);
    var menuWasVisible = !!(menu && visible(menu));
    if (menu) menu.classList.add('or-menu');
    var searches = findSearch(head, menu, brand);
    searches.forEach(function (s) { s.classList.add('or-hide'); });
    /* 메뉴가 ≡ 단추 뒤로 접힌 화면인가: 폰 폭이거나, 메뉴 링크는 안 보이는데 ≡ 단추가 보일 때 */
    var anyLink = [].some.call(head.querySelectorAll('a.or-link'), visible);
    var collapsed = isPhone() || (menuWasVisible && !anyLink);
    var st = collapsed ? buildStrip(head, brand) : null;
    root.classList.toggle('or-collapsed', !!st);
    if (wasCollapsed !== !!st) log('collapsed ->', !!st);
    /* 안전장치: 숨기다가 메뉴 단추까지 사라졌는데 바로 가기 줄도 못 만들었으면 숨김을 되돌림 */
    if (collapsed && menuWasVisible && !visible(menu) && !st) {
      searches.forEach(function (x) { x.classList.remove('or-hide'); });
      log('menu vanished; search hide undone');
    }
    if (!document.querySelector('.or-share')) {
      var b = makeShare();
      var anchor = searches.filter(function (s) { return s.parentElement; })[0];
      if (menu && menu.parentElement && (menuWasVisible || visible(menu))) menu.parentElement.insertBefore(b, menu);
      else if (anchor) anchor.parentElement.insertBefore(b, anchor);
      else if (menu && menu.parentElement) menu.parentElement.insertBefore(b, menu);
      else head.appendChild(b);
    }
    var ft = buildFoot();
    log('head', head, 'brand', brand, 'search', searches, 'menu', menu, 'strip', st, 'foot', ft && ft.parentElement);
    watchHero();
  }

  var t;
  function soon() { clearTimeout(t); t = setTimeout(function () { mo.disconnect(); try { setup(); } finally { mo.observe(document.body, { childList: true, subtree: true }); } }, 120); }
  var mo = new MutationObserver(soon);
  function start() { setup(); mo.observe(document.body, { childList: true, subtree: true }); setTimeout(loadKakao, 1500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('resize', soon);
})();
