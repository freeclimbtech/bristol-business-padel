/*
 * Bristol Business Padel — scroll-scrubbed ball spin.
 *
 * Deliberately NOT pinned: rotation is scrubbed to normal scroll progress
 * while the section is in view, so the page never locks or fights the
 * user's scroll (the previous pinned version felt heavy for exactly that
 * reason). Every tween uses ease: "none" — scrub itself provides the
 * smoothing, so motion stays 1:1 with actual scroll input rather than
 * drifting in and out of sync with it.
 *
 * Two masked copies of the same source image rotate at different rates
 * to fake depth from one flat asset: the ball core spins one way, the
 * water-droplet ring spins faster and the opposite way, so droplets read
 * as flinging outward rather than rotating rigidly with the ball.
 *
 * Progressive enhancement: no-op if GSAP/ScrollTrigger fail to load, or
 * the visitor has requested reduced motion — the ball simply stays in
 * its static resting pose, which is fully visible either way.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var librariesReady = window.gsap && window.ScrollTrigger;

  if (prefersReducedMotion || !librariesReady) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var scene = document.getElementById("ball-stage");
  var core = document.querySelector(".ball-core");
  var ring = document.querySelector(".ball-ring");

  if (!scene || !core || !ring) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5
    }
  })
    .fromTo(core, { rotation: 0 }, { rotation: 640, ease: "none" }, 0)
    .fromTo(ring, { rotation: 0, scale: 1, opacity: 1 }, { rotation: -760, scale: 1.08, opacity: 0.75, ease: "none" }, 0);

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
