(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const hero = document.getElementById("top");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const form = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const reveals = document.querySelectorAll(".reveal");

  function updateStickyHeader() {
    if (!header || !hero) return;
    const threshold = hero.offsetTop + hero.offsetHeight - 120;
    header.classList.toggle("is-sticky", window.scrollY > threshold);
  }

  updateStickyHeader();
  window.addEventListener("scroll", updateStickyHeader, { passive: true });
  window.addEventListener("resize", updateStickyHeader, { passive: true });

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.delay || 0);
          window.setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach(function (el, idx) {
      el.dataset.delay = String((idx % 3) * 80);
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!formFeedback) return;

      if (!form.checkValidity()) {
        formFeedback.textContent = "Please complete all required fields.";
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const plain = {};
      data.forEach(function (value, key) {
        plain[key] = value;
      });

      console.log("Contact form submission", plain);
      formFeedback.textContent = "Thanks. Your enquiry has been captured locally.";
      form.reset();
    });
  }
})();
