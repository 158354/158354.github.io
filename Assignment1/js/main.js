/* =========================================================
   《傲慢与偏见》名著影像解读 · 交互脚本
   1) 进入界面特效（珍珠帷幕开幕 → 揭示页面）
   2) 随机散落珠光玫瑰（香槟玫瑰 / 珍珠细枝 / 花簇，避开核心阅读区）
   3) 背景油画滚动视差
   4) 内容区块进入视口淡入上浮
   5) 幕次短视频点击播放 / 单例播放
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     装饰素材（透明底 PNG）
     --------------------------------------------------------- */
  var DECOS = [
    { src: 'images/dec-rose-bloom.png',   min: 60,  max: 118, weight: 1.05, oMin: 0.52, oMax: 0.86 },
    { src: 'images/dec-rose-branch.png',  min: 96,  max: 168, weight: 0.85, oMin: 0.42, oMax: 0.72 },
    { src: 'images/dec-rose-cluster.png', min: 68,  max: 130, weight: 0.72, oMin: 0.48, oMax: 0.82 }
  ];
  var DECO_TOTAL = DECOS.reduce(function (s, d) { return s + d.weight; }, 0);

  function rand(min, max) { return min + Math.random() * (max - min); }

  function pickDeco() {
    var r = Math.random() * DECO_TOTAL;
    for (var i = 0; i < DECOS.length; i++) {
      r -= DECOS[i].weight;
      if (r <= 0) return DECOS[i];
    }
    return DECOS[0];
  }

  /* ---------------------------------------------------------
     1. 进入界面特效
     --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = (el.dataset.revealDelay || '0') + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    for (var k = 0; k < items.length; k++) {
      var el = items[k];
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.dataset.revealDelay = String(k * 110);
      }
      io.observe(el);
    }

    // 双保险：个别环境下 IntersectionObserver 首次回调可能延迟，
    // 这里对当前视口内的区块直接补一次进场。
    function markVisibleNow() {
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('is-in')) continue;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) {
          el.style.transitionDelay = (el.dataset.revealDelay || '0') + 'ms';
          el.classList.add('is-in');
          io.unobserve(el);
        }
      }
    }
    window.setTimeout(markVisibleNow, 650);
    window.setTimeout(markVisibleNow, 1600);
  }

  var revealReady = false;
  function startReveal() {
    if (revealReady) return;
    revealReady = true;
    initReveal();
  }

  var entered = false;
  function enterPage() {
    if (entered) return;
    entered = true;

    var intro = document.getElementById('intro');
    root.classList.remove('intro-lock');
    root.classList.add('entered');          // 触发页面淡入
    if (intro) {
      intro.classList.add('is-open');       // 帷幕拉开
      window.setTimeout(function () {
        if (intro.parentNode) intro.parentNode.removeChild(intro);
      }, 1700);
    }
    window.setTimeout(startReveal, 320);
  }

  function startIntro() {
    var intro = document.getElementById('intro');
    if (!intro || reduceMotion) { enterPage(); return; }

    var go = function () { enterPage(); };

    // 至少展示 2.3s，并等待资源就绪；另有 4.6s 兜底
    var minWait = new Promise(function (r) { window.setTimeout(r, 2300); });
    var ready = new Promise(function (r) {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    Promise.all([minWait, ready]).then(go);
    window.setTimeout(go, 4600);

    intro.addEventListener('click', go);
    intro.addEventListener('touchstart', go, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') go();
    });
  }

  /* ---------------------------------------------------------
     2. 随机散落珠光玫瑰
        规则：始终落在核心内容阅读区（.page 正文栏）之外
     --------------------------------------------------------- */
  var field = document.getElementById('roseField');

  function buildRoses() {
    if (!field) return;
    field.innerHTML = '';

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var docH = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body.scrollHeight || 0,
      vh
    );
    field.style.height = docH + 'px';

    var contentW = Math.min(1080, vw);
    var gutter = Math.max(0, (vw - contentW) / 2);

    var narrow = vw < 760;
    var count, maxO, inGutter;

    if (narrow) {
      count = 7;  maxO = 0.62; inGutter = false;
    } else if (gutter >= 74) {
      count = 15; maxO = 0.86; inGutter = true;
    } else if (gutter >= 34) {
      count = 11; maxO = 0.76; inGutter = false;
    } else {
      count = 8;  maxO = 0.62; inGutter = false;
    }

    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var deco = pickDeco();
      var size = rand(deco.min, deco.max);
      if (inGutter) size = Math.min(size, Math.max(56, gutter - 20));

      var side = Math.random() < 0.5 ? 'left' : 'right';
      var x;
      if (inGutter) {
        var span = Math.max(10, gutter - size - 12);
        var off = rand(8, 8 + span);
        x = side === 'left' ? off : vw - size - off;
      } else {
        var edge = Math.max(2, vw * 0.03);
        var eo = rand(0, edge);
        x = side === 'left' ? eo : vw - size - eo;
      }

      // 纵向分布：向页面上部轻微偏移，保证首屏即有装饰
      var y = (docH - size) * Math.pow(Math.random(), 1.2);

      var rose = document.createElement('div');
      rose.className = 'rose';
      rose.style.left = Math.round(x) + 'px';
      rose.style.top = Math.round(y) + 'px';
      rose.style.width = Math.round(size) + 'px';
      rose.style.height = Math.round(size) + 'px';
      rose.style.setProperty('--dur', rand(17, 32).toFixed(1) + 's');
      rose.style.setProperty('--glow', rand(5.5, 9.5).toFixed(1) + 's');
      rose.style.setProperty('--dx', rand(-20, 20).toFixed(1) + 'px');
      rose.style.setProperty('--dy', rand(-34, -12).toFixed(1) + 'px');
      rose.style.setProperty('--o', rand(deco.oMin, Math.min(deco.oMax, maxO)).toFixed(2));
      rose.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';

      rose.innerHTML =
        '<div class="rose-float">' +
          '<div class="rose-glow">' +
            '<img class="rose-img" src="' + deco.src + '" alt="" ' +
                 'style="transform:scaleX(' + (Math.random() < 0.5 ? -1 : 1) + ') ' +
                 'rotate(' + rand(-70, 70).toFixed(0) + 'deg)">' +
          '</div>' +
        '</div>';

      frag.appendChild(rose);
    }

    field.appendChild(frag);
  }

  /* ---------------------------------------------------------
     3. 背景油画滚动视差（极缓慢、有界的正弦位移）
     --------------------------------------------------------- */
  var parallaxEl = document.querySelector('.bg-parallax');
  var scrollY = 0;
  var curY = 0;

  function onScroll() { scrollY = window.pageYOffset || window.scrollY || 0; }

  function parallaxLoop() {
    if (parallaxEl) {
      curY += (scrollY - curY) * 0.075;
      var offset = Math.sin(curY / 900) * 26;   // ±26px 轻微位移，缓慢往复
      parallaxEl.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)';
    }
    window.requestAnimationFrame(parallaxLoop);
  }

  /* ---------------------------------------------------------
     4. 幕次短视频：点击播放 / 单例播放
     --------------------------------------------------------- */
  function pauseOthers(except) {
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      if (vids[i] !== except && !vids[i].paused) vids[i].pause();
    }
  }

  function setPlayingState(video, playing) {
    var media = video.closest ? video.closest('.act-media') : null;
    if (media) media.classList.toggle('is-playing', !!playing);
  }

  function initClips() {
    var medias = document.querySelectorAll('.act-media');
    Array.prototype.forEach.call(medias, function (media) {
      var video = media.querySelector('video.clip');
      if (!video) return;

      var toggle = function (e) {
        if (e) e.preventDefault();
        if (video.paused) {
          pauseOthers(video);
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* 自动播放策略拦截时忽略 */ });
        } else {
          video.pause();
        }
      };

      video.addEventListener('click', toggle);
      var btn = media.querySelector('.clip-play');
      if (btn) btn.addEventListener('click', toggle);

      video.addEventListener('play', function () { setPlayingState(video, true); });
      video.addEventListener('pause', function () { setPlayingState(video, false); });
      video.addEventListener('ended', function () {
        setPlayingState(video, false);
        try { video.currentTime = 0; } catch (err) {}
      });
    });

    // 主视频播放时，暂停所有幕次短视频
    var main = document.querySelector('.film-video');
    if (main) main.addEventListener('play', function () { pauseOthers(main); });
  }

  /* ---------------------------------------------------------
     启动
     --------------------------------------------------------- */
  function init() {
    try { buildRoses(); } catch (e) {}
    try { initClips(); } catch (e) {}
    onScroll();
    if (!reduceMotion) window.requestAnimationFrame(parallaxLoop);
    try { startIntro(); } catch (e) { enterPage(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 终极兜底：任何异常都不能把访问者挡在进入界面之外
  window.setTimeout(function () {
    if (!entered) { startReveal(); enterPage(); }
  }, 6500);

  window.addEventListener('scroll', onScroll, { passive: true });

  // 尺寸变化：重建玫瑰（防抖）
  var resizeTimer = null;
  var lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (Math.abs(window.innerWidth - lastW) < 40) return;
    lastW = window.innerWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildRoses, 260);
  });

  // 图片加载完成后页面高度可能变化，补一次装饰重建
  window.addEventListener('load', function () {
    window.setTimeout(buildRoses, 400);
  });
})();
