WEBWALA — website files
========================

HOW TO VIEW
-----------
Double-click index.html. It opens in any browser.

The whole site is static (plain HTML + CSS + a small script), so there
is nothing to install and no server needed to look at it.

PAGES
-----
index.html      Home — hero, services, typical builds, included-with-every-job, process, stats
services.html   Services & prices + the FAQ (accordion, no JavaScript needed)
about.html      About, what I build, and "when I'm not the right fit"
contact.html    Contact + the message builder form

styles.css      Shared styling for all pages
script.js       Fade-in on scroll, 3D tilt, and the message builder
assets/         Brand files only: favicon.svg (tab icon) and og.png
                (the preview image shown when the link is shared)

WHAT'S NEW IN THIS VERSION
--------------------------
- Prices now match on every page (₹9,999 → ₹4,999, ₹7,499 → ₹3,499,
  ₹6,599 → ₹2,499, ₹10,000 → ₹6,500), with the old price struck through.
- New "Three typical builds" section on the home page.
- New "Every project comes with this" section (fixed quote, you own
  everything, free tweaks, speed).
- New FAQ on the services page — 8 questions, opens and closes with
  plain HTML.
- New "When I'm not the right fit" section on the about page. Saying
  what you DON'T do builds more trust than another sales paragraph.
- Contact page: a builder form. The visitor types their business,
  picks a service, and the buttons open WhatsApp or Gmail with the
  whole message already written. Nothing is stored or emailed by the
  site itself — it only opens the app.
- Phones now get a fixed bottom bar with Call / WhatsApp / Free Quote.
  Before this, the menu simply disappeared on small screens.
- The two stock photos are gone (the portrait was not a real photo of
  you). In their place: a 3D floating-card scene in the hero, a CSS
  browser-window mock in the about/split sections, and a generated
  share image. Everything is drawn with code, so there is nothing to
  replace and nothing that looks like a stock picture.
- Modern motion layer: a thin scroll-progress bar at the top, cards
  that tilt in 3D, floating cards that move with the mouse, numbers
  that count up, gradient headline text, and a shine across buttons
  on hover. All of it is turned off automatically for visitors whose
  device asks for reduced motion.
- Page titles + descriptions for Google and WhatsApp link previews.
- Small polish: fade-ins, hover lift on cards, visible keyboard focus,
  "skip to content" link, icons marked for screen readers, marquee
  pauses on hover.

HOW THE CONTACT LINKS BEHAVE
----------------------------
- Phone link opens the phone dialler.
- WhatsApp link opens WhatsApp with a message already typed.
- Email link opens a pre-filled Gmail compose window in a new tab.
- The builder form opens WhatsApp or Gmail with your answers filled in.
All of these are ordinary links, so the number and address can be
changed by editing the href="" values in the HTML files.

Phone / WhatsApp : +91 79738 57238   (wa.me/917973857238)
Email            : amrit172003@gmail.com

If the phone number or email changes, search for them in the four
.html files (and script.js) and replace every occurrence.

BEFORE YOU PUBLISH — PLEASE READ
--------------------------------
1. The "40+ projects delivered" stat and the three "typical builds" are
   descriptions of the kind of work done, not named client case studies.
   If you have real numbers or real clients, use those instead — they
   are more convincing than round figures.
2. There are no testimonials on the site. Add three real ones (name,
   business, city) as soon as you have them; a reviews section is the
   single biggest missing piece for a service business.
3. The FAQ answers describe payment terms (half up front, half at
   launch) and free-tweak periods. Make sure those match what you
   actually offer before this goes live.

SPEED (why the page should feel light)
--------------------------------------
No photos at all now, so the whole site is roughly 40 KB of code plus
two Google fonts. On top of that:

- The floating hero cards no longer animate by themselves; they only
  shift when the mouse moves, and the depth is still there.
- The big soft colour glows are plain gradients, not blur filters. A
  460-pixel CSS blur was the single biggest cause of stutter.
- Sections far below the screen are not laid out or painted until you
  scroll near them.
- The ticker and the few remaining animations pause when off-screen.
- Scroll and mouse effects are batched into one frame each, and element
  positions are measured once instead of on every event.

If it still feels slow on a specific computer, that machine is probably
doing software rendering (no graphics acceleration) - try it in Chrome
or Edge with hardware acceleration enabled in the browser settings.

TO PUT IT ONLINE
----------------
This repository is published with GitHub Pages: Settings → Pages, source
"Deploy from a branch", branch main, folder / (root).
Any other static host (Netlify, Cloudflare Pages, Vercel) works too —
the site needs no build step.

NOTES
-----
- Fonts (Anton + Archivo) load from Google Fonts, so the page needs an
  internet connection to show the exact typography. Offline it falls
  back to Impact / Arial.
- The logo mark and small icons are text characters, not image files.
