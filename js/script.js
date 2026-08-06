(() => {
  "use strict";

  const JAMES_EMAIL = "james@bristolbusinesspadel.co.uk"; // TODO: replace with James's real email

  // Scroll-reveal via IntersectionObserver
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
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
