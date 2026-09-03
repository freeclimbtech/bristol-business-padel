(() => {
  "use strict";

  const JAMES_EMAIL = "james@bristolbusinesspadel.co.uk"; // TODO: replace with James's real email

  // Padel loading animation: plays once (ball enters, hits the racket,
  // returns), then holds on the racket-only frame until the page has
  // actually finished loading, then fades out. A safety cap stops a slow
  // load from trapping visitors behind it indefinitely.
  const loader = document.getElementById("siteLoader");
  if (loader) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      loader.remove();
    } else {
      const MIN_HOLD_MS = 1400; // matches the CSS animation duration
      const MAX_WAIT_MS = 4000; // never block visitors longer than this
      const startedAt = Date.now();
      let hidden = false;

      const hideLoader = () => {
        if (hidden) return;
        hidden = true;
        const wait = Math.max(0, MIN_HOLD_MS - (Date.now() - startedAt));
        setTimeout(() => {
          loader.classList.add("is-hidden");
          loader.addEventListener("transitionend", () => loader.remove(), { once: true });
        }, wait);
      };

      if (document.readyState === "complete") {
        hideLoader();
      } else {
        window.addEventListener("load", hideLoader, { once: true });
      }
      setTimeout(hideLoader, MAX_WAIT_MS);
    }
  }

  // Scroll-reveal via IntersectionObserver. Elements are visible by default
  // in CSS (motion only enhances them), but as a safety net, force-reveal
  // anything still hidden shortly after load — covers short pages where
  // content already fits the viewport and a real scroll/intersection event
  // may never fire.
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }, 1200);
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Join form -> mailto handoff (no backend wired up yet)
  const form = document.getElementById("joinForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const business = (data.get("business") || "").toString().trim();
      const level = (data.get("level") || "").toString().trim();

      const subject = `Bristol Business Padel — join request from ${name}`;
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Business / role: ${business}`,
        `Padel level: ${level}`,
      ].filter(Boolean);

      const mailto = `mailto:${JAMES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
    });
  }

  // Mobile nav: hamburger toggle opens/closes the nav as a dropdown panel
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    const closeNav = () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    const openNav = () => {
      mainNav.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      mainNav.classList.contains("is-open") ? closeNav() : openNav();
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", (e) => {
      if (!mainNav.contains(e.target) && e.target !== navToggle) closeNav();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Map picker: pick Apple Maps / Google Maps / Waze for the venue address
  document.querySelectorAll(".map-picker").forEach((picker) => {
    const trigger = picker.querySelector(".map-picker-trigger");
    const menu = picker.querySelector(".map-picker-menu");
    if (!trigger || !menu) return;

    const close = () => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });
    document.addEventListener("click", (e) => {
      if (!picker.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  });
})();
