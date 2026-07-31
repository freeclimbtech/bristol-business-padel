/*
 * Bristol Business Padel — scroll-driven ball scene.
 *
 * Plays in its own pinned section directly after the (fully static, always
 * visible) hero. GSAP ScrollTrigger scrubs a single beat to real scroll
 * position: the ball settles in, rotates once, then the section releases
 * into "What happens".
 *
 * Progressive enhancement: this whole file is a no-op if GSAP/ScrollTrigger/
 * Lenis fail to load, or the visitor has requested reduced motion — the
 * ball simply stays in its static CSS resting pose.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var librariesReady = window.gsap && window.ScrollTrigger && window.Lenis;

  if (prefersReducedMotion || !librariesReady) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var scene = document.getElementById("ball-stage");
  var ballSpin = document.querySelector(".ball-spin");

  if (!scene || !ballSpin) return;

  /* ---------------------------------------------------------------------
   * Smooth scroll (Lenis), wired into GSAP's own ticker per GSAP's
   * documented Lenis integration so ScrollTrigger stays in sync.
   * ------------------------------------------------------------------- */
  var lenis = new window.Lenis({
    duration: 1.1,
    easing: function (t) { return 1 - Math.pow(1 - t, 3); }
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  gsap.set(ballSpin, { rotation: 0, scale: 0.8, opacity: 0 });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: scene,
      start: "top top",
      end: "+=120%",
      scrub: 0.6,
      pin: true,
      anticipatePin: 1
    }
  });

  // Settle in, then one full rotation (water spinning with it), done.
  tl.to(ballSpin, { opacity: 1, scale: 1, duration: 20, ease: "power2.out" }, 0)
    .to(ballSpin, { rotation: 360, duration: 80, ease: "power1.inOut" }, 20);

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
