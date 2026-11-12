/* WEBWALA — small progressive enhancements. No frameworks, no build step.
   Performance notes: all scroll/pointer work is coalesced into one
   requestAnimationFrame pass, element geometry is measured once instead of
   on every event, and continuous animations pause when off-screen. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var canObserve = 'IntersectionObserver' in window;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---------- 1. scroll progress bar ---------- */
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var scrollQueued = false;
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    raf(function () {
      scrollQueued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var percent = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, percent)) + '%';
      paintParallax();
    });
  }

  /* ---------- 2. reveal sections as they scroll into view ---------- */
  var revealItems = [].slice.call(document.querySelectorAll('.reveal'));

  ['.cards', '.steps', '.work-grid', '.contact-cards'].forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      [].slice.call(group.children).forEach(function (child, index) {
        if (child.classList.contains('reveal')) child.style.setProperty('--i', index);
      });
    });
  });

  if (reduceMotion || !canObserve) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 3. pause never-ending animations when off-screen ---------- */
  if (canObserve) {
    var animated = [].slice.call(document.querySelectorAll('.scene, .marquee'));
    var pauseObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '120px' });
    animated.forEach(function (el) { pauseObserver.observe(el); });
  }

  /* ---------- 4. numbers count up when they scroll in ---------- */
  function countUp(el) {
    var match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1], 10);
    var suffix = match[2];
    if (target < 2) return;
    var start = performance.now();
    function frame(now) {
      var ratio = Math.min(1, (now - start) / 1100);
      var eased = 1 - Math.pow(1 - ratio, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (ratio < 1) raf(frame);
    }
    raf(frame);
  }
  var counters = [].slice.call(document.querySelectorAll('.stat .big'));
  if (!reduceMotion && canObserve && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); counterObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- 5. 3D tilt + spotlight, coalesced to one frame ---------- */
  var pointerX = 0;
  var pointerY = 0;
  var pointerMoved = false;
  var activeTilt = null;
  var tiltQueued = false;

  function applyPointer() {
    tiltQueued = false;
    if (!pointerMoved) return;
    pointerMoved = false;

    if (activeTilt) {
      var geom = activeTilt.geom;
      var px = (pointerX - geom.left) / geom.width;
      var py = (pointerY - geom.top) / geom.height;
      var maxTilt = activeTilt.max;
      var el = activeTilt.el;
      el.style.setProperty('--tiltY', ((px - 0.5) * 2 * maxTilt).toFixed(2) + 'deg');
      el.style.setProperty('--tiltX', ((0.5 - py) * 2 * maxTilt).toFixed(2) + 'deg');
    }

    if (sceneInner) {
      var cx = pointerX / window.innerWidth - 0.5;
      var cy = pointerY / window.innerHeight - 0.5;
      sceneInner.style.setProperty('--tiltY', (cx * 9).toFixed(2) + 'deg');
      sceneInner.style.setProperty('--tiltX', (-cy * 7).toFixed(2) + 'deg');

      // each card drifts a different amount, which is what sells the depth
      floatCards.forEach(function (card, index) {
        var depth = parseFloat(card.dataset.depth) || 1;
        card.style.setProperty('--sx', (cx * 26 * depth).toFixed(1) + 'px');
        card.style.setProperty('--sy', (cy * 18 * depth).toFixed(1) + 'px');
      });
    }
  }

  function queuePointer() {
    if (!tiltQueued) { tiltQueued = true; raf(applyPointer); }
  }

  var sceneInner = finePointer && !reduceMotion ? document.querySelector('.scene-inner') : null;
  var floatCards = sceneInner ? [].slice.call(document.querySelectorAll('.float-card')) : [];

  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointerenter', function () {
        // measure once per hover, not per mouse move
        var rect = el.getBoundingClientRect();
        activeTilt = {
          el: el,
          max: parseFloat(el.dataset.tilt) || 7,
          geom: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        };
        el.style.willChange = 'transform';
      });

      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--tiltX', '0deg');
        el.style.setProperty('--tiltY', '0deg');
        el.style.willChange = 'auto';
        if (activeTilt && activeTilt.el === el) activeTilt = null;
      });
    });

    document.addEventListener('pointermove', function (event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerMoved = true;
      queuePointer();
    }, { passive: true });
  }

  /* ---------- 6. gentle parallax (geometry cached, no layout reads) ---------- */
  var parallaxItems = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
    return {
      el: el,
      speed: parseFloat(el.dataset.parallax) || 0.12,
      top: 0,
      height: 0,
      visible: false
    };
  });

  function measureParallax() {
    parallaxItems.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      item.top = rect.top + window.scrollY;
      item.height = rect.height;
    });
  }

  function paintParallax() {
    if (!parallaxItems.length || reduceMotion) return;
    var viewportCenter = window.scrollY + window.innerHeight / 2;
    parallaxItems.forEach(function (item) {
      if (!item.visible) return;
      var offset = -(item.top + item.height / 2 - viewportCenter) * item.speed;
      item.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
  }

  if (parallaxItems.length && !reduceMotion) {
    if (canObserve) {
      var parallaxObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var item = parallaxItems.filter(function (i) { return i.el === entry.target; })[0];
          if (item) item.visible = entry.isIntersecting;
        });
        paintParallax();
      }, { rootMargin: '150px' });
      parallaxItems.forEach(function (item) { parallaxObserver.observe(item.el); });
    } else {
      parallaxItems.forEach(function (item) { item.visible = true; });
    }
    measureParallax();
    paintParallax();
    window.addEventListener('resize', function () { measureParallax(); paintParallax(); }, { passive: true });
    window.addEventListener('load', function () { measureParallax(); paintParallax(); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 7. quote builder: writes the message for the visitor ---------- */
  var form = document.getElementById('quote-builder');
  if (!form) return;

  var PHONE = '917973857238';
  var EMAIL = 'amrit172003@gmail.com';

  function value(id) {
    var field = document.getElementById(id);
    return field && field.value.trim() ? field.value.trim() : '';
  }

  function buildMessage() {
    return [
      "Hi Webwala, I'd like a quote.",
      '',
      'Business: ' + (value('qb-business') || '-'),
      'Service: ' + (value('qb-service') || 'not sure yet'),
      'Current website: ' + (value('qb-site') || 'none'),
      'Deadline: ' + (value('qb-deadline') || 'flexible')
    ].join('\n');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var message = buildMessage();
    var button = event.submitter || document.activeElement;
    var sendBy = button && button.dataset.send;

    if (sendBy === 'email') {
      window.open(
        'https://mail.google.com/mail/?view=cm&fs=1&to=' + EMAIL +
        '&su=' + encodeURIComponent('Website enquiry') +
        '&body=' + encodeURIComponent(message),
        '_blank', 'noopener'
      );
    } else {
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
    }
  });
})();
