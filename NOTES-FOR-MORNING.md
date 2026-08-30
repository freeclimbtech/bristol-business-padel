# Bristol Business Padel — build notes

Live at: **https://freeclimbtech.github.io/bristol-business-padel/**
(GitHub Pages, auto-deploys from the `main` branch of
github.com/freeclimbtech/bristol-business-padel every time changes are pushed)

Local dev: static site, no build step. Open `index.html` directly, or run
the `padel-static` dev server config (port 5174).

## Picking this back up
Just reply in this conversation whenever you're back online (even "continue"
is enough) — full context of everything below carries over automatically,
no need to re-explain anything.

## Pages
- `index.html` — home: hero, "What happens", hosts overview, video
  showcase, venue, join form
- `about.html` — James & Yinka (organisers) and Gabby & Will (coaches),
  each with direct contact
- `partners.html` — partner benefits, 299 Lighting as current supporter,
  "Become a partner" CTA

## What's done
- Full multi-page site, dark/white alternating sections, real padel
  photography (Pexels, free to use), custom logo, Anton/Inter type.
- **About page**: James (299 Lighting logo + link), Yinka (LinkedIn +
  Courts and Connections, his corporate padel events business, with link),
  Gabby and Will Edlin as coaches, each with a direct contact button
  (Gabby: placeholder email, Will: real WhatsApp number from his business
  card).
- **Partners page**: benefits list, 299 Lighting shown as current
  supporter, "Become a Partner" CTA emailing James.
- **Video showcase** on the homepage: the two 299 Lighting LinkedIn posts
  about the group. Built as clickable photo cards (play button, opens the
  real LinkedIn post in a new tab) rather than embedding LinkedIn's own
  iframe — their embed can't be stripped of its cookie-consent banner or
  caption from outside (cross-origin), and true inline autoplay would mean
  downloading and rehosting their video file, which I won't do (their
  copyrighted content, against their terms).
- Real Rocket Padel venue photo now in place (`assets/venue-1.jpg`).
- Mobile: header CTA shortens to "Join us" below 480px so it never wraps.
- Ball scroll animation was tried, iterated on, and ultimately removed
  per your call — homepage is back to a static hero, no scroll-jacking.

## Still open
1. **Join form has no real backend.** "Send request" opens the visitor's
   own email client addressed to `james@bristolbusinesspadel.co.uk`
   (placeholder — **not real**, swap it in `js/script.js`). Consider
   Formspree/Netlify Forms for a proper one-click submit once you give me
   James's real address.
2. ~~Gabby's contact info~~ — done. Real email (`book@padelbygabriela.com`)
   and Instagram (`@padelbygabriela`) now in `about.html`.
3. ~~Host/coach photos~~ — James and Gabby now have real headshots.
   Yinka and Will still show as initial-letter avatars; send real photos
   to replace them.
4. Confirm the WhatsApp group is genuinely invite-only via James manually
   adding people — if there's a direct join link instead, easy swap.

## Stack note
Plain HTML/CSS/JS, hosted free on GitHub Pages under your GitHub account
(`freeclimbtech`). Say the word if you'd rather move it to your usual
paid hosting tier with a real domain, or rebuild it in Framer/Webflow.
