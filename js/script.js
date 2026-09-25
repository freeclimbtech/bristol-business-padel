(() => {
  "use strict";

  // Padel loading animation: plays once (ball enters, hits the racket,
  // returns), then holds on the racket-only frame until the page has
  // actually finished loading, then fades out. A safety cap stops a slow
  // load from trapping visitors behind it indefinitely.
  const loader = document.getElementById("siteLoader");
  if (loader) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      loader.remove();
    } else {
      const MIN_HOLD_MS = 1240; // matches the CSS animation duration
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

  // Forms -> real submission via Web3Forms (no backend of our own needed;
  // the access key is a public per-domain form identifier, not a secret).
  // Any <form data-web3form data-success="id"> gets this behaviour.
  document.querySelectorAll("form[data-web3form]").forEach((form) => {
    const errorEl = form.querySelector(".form-error");
    const successEl = document.getElementById(form.dataset.success);
    const submitBtn = form.querySelector("button[type=submit]");
    const submitLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    const idleLabel = submitLabel ? submitLabel.textContent : "";

    const setError = (message) => {
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.hidden = !message;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Native required/type=email validation first - reportValidity()
      // shows the browser's own accessible error UI.
      if (!form.reportValidity()) return;

      setError("");
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending…";

      try {
        const payload = Object.fromEntries(new FormData(form));
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
          form.hidden = true;
          if (successEl) successEl.hidden = false;
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (err) {
        setError("Something went wrong sending that. Nothing has been lost, so please check your details and try again in a moment.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = idleLabel;
      }
    });
  });

  // /contact?topic=partnering pre-selects the topic on the message form
  const topicSelect = document.getElementById("enq-topic");
  if (topicSelect) {
    const wanted = new URLSearchParams(window.location.search).get("topic");
    if (wanted && [...topicSelect.options].some((o) => o.value === wanted)) {
      topicSelect.value = wanted;
    }
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
