// AJIS INTERIOR CREATIONS — site behaviour
// Vanilla JS, no build step, no third-party trackers except AdSense
// (loaded separately in <head>, once approved).

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { mainNav.classList.remove('open'); });
    });
  }

  /* ---- Contact form: build a WhatsApp message + mailto fallback ----
     This site is static (no server), so form submissions are handed
     off to WhatsApp (primary) and a mailto link (backup) rather than
     silently going nowhere. Replace the WhatsApp number / email
     below if they ever change. */
  var WHATSAPP_NUMBER = '2348137378110';
  var CONTACT_EMAIL = 'anthonyjoseph348@gmail.com';

  var form = document.getElementById('consult-form');
  var status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var firstName = (data.get('firstName') || '').trim();
      var lastName = (data.get('lastName') || '').trim();
      var phone = (data.get('phone') || '').trim();
      var service = (data.get('service') || '').trim();
      var message = (data.get('message') || '').trim();

      if (!firstName || !phone) {
        status.textContent = 'Please enter your name and phone number so we can reach you.';
        status.style.color = '#8a4327';
        return;
      }

      var lines = [
        'New enquiry from the Ajis Interior Creations website:',
        'Name: ' + firstName + ' ' + lastName,
        'Phone: ' + phone,
        service ? 'Project type: ' + service : null,
        message ? 'Details: ' + message : null
      ].filter(Boolean);

      var text = encodeURIComponent(lines.join('\n'));
      var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

      status.innerHTML = 'Thanks, ' + firstName + ' — opening WhatsApp to send your request. ' +
        'If it does not open, email us directly at ' +
        '<a href="mailto:' + CONTACT_EMAIL + '?subject=Consultation%20request&body=' + text + '">' + CONTACT_EMAIL + '</a>.';
      status.style.color = '#3f6b3a';

      window.open(waUrl, '_blank', 'noopener');
      form.reset();
    });
  }

  /* ---- Cookie / privacy notice ----
     Simple, no third-party consent-management vendor. Records the
     choice in localStorage so it only shows once. */
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    var KEY = 'ajis-cookie-notice-ack';
    if (!localStorage.getItem(KEY)) {
      banner.hidden = false;
    }
    var ackBtn = document.getElementById('cookie-accept');
    if (ackBtn) {
      ackBtn.addEventListener('click', function () {
        localStorage.setItem(KEY, '1');
        banner.hidden = true;
      });
    }
  }

  /* ---- Hero background slideshow (looping, sliding) ---- */
  var slidesEl = document.getElementById('hero-slides');
  var dotsEl = document.getElementById('hero-dots');
  if (slidesEl && dotsEl) {
    var slides = slidesEl.querySelectorAll('.hero-slide');
    var total = slides.length;
    var current = 0;
    var AUTO_MS = 5000;

    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      (function (idx) {
        dot.addEventListener('click', function () { goTo(idx); resetTimer(); });
      })(i);
      dotsEl.appendChild(dot);
    }
    var dots = dotsEl.querySelectorAll('button');

    function render() {
      slidesEl.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }
    function goTo(idx) { current = (idx + total) % total; render(); }
    function next() { goTo(current + 1); }

    var timer = setInterval(next, AUTO_MS);
    function resetTimer() { clearInterval(timer); timer = setInterval(next, AUTO_MS); }

    render();
  }

  /* ---- Project video cards: click-to-play ---- */
  document.querySelectorAll('.video-card').forEach(function (card) {
    var video = card.querySelector('video');
    var playBtn = card.querySelector('.vc-play');
    if (!video || !playBtn) return;
    playBtn.addEventListener('click', function () {
      card.classList.add('is-playing');
      video.controls = true;
      video.muted = false;
      video.play();
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0) card.classList.remove('is-playing');
    });
  });

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
