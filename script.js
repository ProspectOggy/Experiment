(function () {
  "use strict";

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll(".site-nav__link");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const testimonialText = document.getElementById("testimonial-text");
  const testimonialAttr = document.getElementById("testimonial-attr");
  const tPrev = document.getElementById("testimonial-prev");
  const tNext = document.getElementById("testimonial-next");
  const carousel = document.getElementById("testimonial-carousel");

  const testimonials = [
    {
      quote:
        "We engaged BRAND across multiple disciplines for a complex project. Coordinating everything under one team reduced delays and miscommunication. Their advice was practical, commercially aware, and aligned with stakeholder expectations. The project moved through approvals smoothly and stayed on program.",
      attr: "— Director, Sample Client, Location",
    },
    {
      quote:
        "BRAND gave us clear options, realistic timeframes, and documentation that satisfied both the certifier and our build team. No theatre — just straight engineering and planning support that kept the job moving.",
      attr: "— Project Manager, Placeholder Build Co.",
    },
    {
      quote:
        "From pre-lodgement advice to construction-phase queries, the team was responsive and easy to work with. Having civil, structural, and approvals input in one place was a game-changer for our development program.",
      attr: "— Development Director, Example Holdings",
    },
  ];

  let tIndex = 0;
  let tTimer = null;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setScrolledHeader() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  setScrolledHeader();
  window.addEventListener("scroll", setScrolledHeader, { passive: true });

  function closeMobileNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openMobileNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (l) {
        l.classList.remove("is-active");
      });
      link.classList.add("is-active");
      if (window.matchMedia("(max-width: 1023px)").matches) {
        closeMobileNav();
      }
    });
  });

  function renderTestimonial(index) {
    if (!testimonialText || !testimonialAttr) return;
    const item = testimonials[index];
    testimonialText.textContent = item.quote;
    testimonialAttr.textContent = item.attr;
  }

  function goTestimonial(delta) {
    tIndex = (tIndex + delta + testimonials.length) % testimonials.length;
    renderTestimonial(tIndex);
  }

  function startTestimonialTimer() {
    stopTestimonialTimer();
    tTimer = window.setInterval(function () {
      goTestimonial(1);
    }, 7000);
  }

  function stopTestimonialTimer() {
    if (tTimer) {
      window.clearInterval(tTimer);
      tTimer = null;
    }
  }

  if (tPrev) tPrev.addEventListener("click", function () {
    goTestimonial(-1);
    startTestimonialTimer();
  });
  if (tNext) tNext.addEventListener("click", function () {
    goTestimonial(1);
    startTestimonialTimer();
  });

  if (carousel) {
    carousel.addEventListener("mouseenter", stopTestimonialTimer);
    carousel.addEventListener("mouseleave", startTestimonialTimer);
  }

  renderTestimonial(0);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reduceMotion.matches) {
    startTestimonialTimer();
  }

  const sectionIds = ["top", "services", "contact", "about", "faqs", "portfolio", "blog"];
  const sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("data-nav") === id) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const obs = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });
        if (visible[0] && visible[0].target.id) {
          setActiveNav(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );
    sections.forEach(function (sec) {
      obs.observe(sec);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!formFeedback) return;

      if (!form.checkValidity()) {
        formFeedback.textContent = "";
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const plain = {};
      data.forEach(function (value, key) {
        plain[key] = value;
      });
      console.log("Contact form submission", plain);

      formFeedback.textContent = "Thanks — your details were captured locally (placeholder).";
      form.reset();
    });
  }
})();
