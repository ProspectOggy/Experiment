(function () {
  "use strict";

  const projects = [
    {
      slug: "coomera",
      title: "Coomera Connector",
      description:
        "Piling and barrier separation works adjacent to the Gold Coast Light Rail corridor. Stage 1 delivery for GoldlinQ.",
      tags: "Civil Engineering, Rail Safety, HAZID",
      timezone: { label: "GLD", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #0C2040, #1a3868)",
      artifactPlaceholder: "#29A8E0",
    },
    {
      slug: "gclr",
      title: "Gold Coast Light Rail",
      description:
        "Track corridor protection, crane lift planning, and structural review for adjacent developments.",
      tags: "Structural Review, Crane Studies, TMP",
      timezone: { label: "GLD", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #1a3868, #0C2040)",
      artifactPlaceholder: "#5dc0ec",
    },
    {
      slug: "bribie",
      title: "Bribie Pontoons",
      description:
        "Marine structural assessment and pontoon upgrades for council-maintained community infrastructure.",
      tags: "Marine Civil, Durability, Community Infrastructure",
      timezone: { label: "BNE", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #0a0d12, #1a3868)",
      artifactPlaceholder: "#29A8E0",
    },
    {
      slug: "moreton",
      title: "Moreton Bay Marina",
      description:
        "Berthing loads, wave action, and coastal engineering inputs for marina expansion and dredging interfaces.",
      tags: "Coastal Engineering, Marine Structures",
      timezone: { label: "BNE", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #0C2040, #0a0d12)",
      artifactPlaceholder: "#5dc0ec",
    },
    {
      slug: "sunshine",
      title: "Sunshine Coast Civic",
      description:
        "Civil infrastructure coordination for civic precinct upgrades and staged traffic staging plans.",
      tags: "Civil Works, Staging, TMP",
      timezone: { label: "SCN", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #142a52, #0C2040)",
      artifactPlaceholder: "#29A8E0",
    },
    {
      slug: "ballarat",
      title: "Ballarat Civil Works",
      description:
        "Regional civil design and structural oversight for transport-adjacent infrastructure upgrades.",
      tags: "Regional Civil, Structural, Compliance",
      timezone: { label: "BNE", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #1a3868, #0a0d12)",
      artifactPlaceholder: "#5dc0ec",
    },
    {
      slug: "all",
      title: "All Projects",
      description:
        "Explore our full portfolio across infrastructure, transport, marine, and civic works.",
      tags: "Portfolio",
      timezone: { label: "BNE", offsetHours: 10 },
      bgPlaceholder: "linear-gradient(135deg, #0a0d12, #0C2040)",
      artifactPlaceholder: "#29A8E0",
    },
  ];

  const IDLE_BG =
    "linear-gradient(135deg, #0C2040 0%, #0a0d12 60%, #1a3868 100%)";
  const IDLE_TITLE_HTML = "We engineer<br />infrastructure";
  const IDLE_DESC =
    "Since 2018, JCE has delivered civil and structural engineering for infrastructure, transport, and development projects across Queensland and beyond.";

  function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  function initHeroStage() {
    const stage = document.querySelector(".hero-stage");
    if (!stage) return;

    const bgA = stage.querySelector(".hero-stage__bg--a");
    const bgB = stage.querySelector(".hero-stage__bg--b");
    const rail = document.getElementById("hero-rail");
    const eyebrowEl = document.getElementById("hero-eyebrow");
    const artifactWrap = document.getElementById("hero-artifact-wrap");
    const artifactEl = document.getElementById("hero-artifact");
    const titleTextEl = document.getElementById("hero-title-text");
    const descEl = document.getElementById("hero-desc");
    const clockWrap = document.getElementById("hero-clock");
    const clockLabelEl = document.getElementById("hero-clock-label");
    const clockTimeEl = document.getElementById("hero-clock-time");
    const a11yLive = document.getElementById("hero-a11y-live");
    const cursorDot = document.getElementById("cursor-dot");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.documentElement.setAttribute(
      "data-reduced-motion",
      reducedMotion ? "true" : "false"
    );

    const projectBySlug = {};
    projects.forEach(function (p) {
      projectBySlug[p.slug] = p;
    });

    let currentSlug = "idle";
    let bgFrontIsA = true;
    let idleTimer = null;
    let keyboardLockedSlug = null;
    const mqCoarse = window.matchMedia("(max-width: 1023px)");

    function getBrisbaneTimeString() {
      return new Date().toLocaleTimeString("en-AU", {
        timeZone: "Australia/Brisbane",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (clockTimeEl) {
      clockTimeEl.textContent = getBrisbaneTimeString();
      window.setInterval(function () {
        if (clockTimeEl) clockTimeEl.textContent = getBrisbaneTimeString();
      }, 1000);
    }

    function setClockLabel(nextLabel) {
      if (!clockLabelEl || !clockWrap) return;
      if (reducedMotion) {
        clockLabelEl.textContent = nextLabel;
        return;
      }
      clockWrap.classList.add("hero-stage__clock--dip");
      window.setTimeout(function () {
        clockLabelEl.textContent = nextLabel;
        clockWrap.classList.remove("hero-stage__clock--dip");
      }, 100);
    }

    function crossfadeBackground(gradientCss) {
      if (!bgA || !bgB) return;
      const front = bgFrontIsA ? bgA : bgB;
      const back = bgFrontIsA ? bgB : bgA;

      back.style.background = gradientCss;
      back.style.zIndex = "3";
      front.style.zIndex = "2";

      if (!reducedMotion) {
        back.style.transform = "scale(1.05)";
        back.style.transition = "none";
        void back.offsetWidth;
        back.style.transition =
          "opacity 600ms cubic-bezier(0.65, 0, 0.35, 1), transform 800ms cubic-bezier(0.65, 0, 0.35, 1)";
        front.style.transition =
          "opacity 600ms cubic-bezier(0.65, 0, 0.35, 1)";
      }

      back.style.opacity = "1";
      if (!reducedMotion) {
        window.requestAnimationFrame(function () {
          back.style.transform = "scale(1)";
        });
      } else {
        back.style.transform = "scale(1)";
      }
      front.style.opacity = "0";

      bgFrontIsA = !bgFrontIsA;

      window.setTimeout(function () {
        front.style.zIndex = "1";
        back.style.zIndex = "2";
        front.style.transform = "scale(1)";
      }, reducedMotion ? 0 : 620);
    }

    function runTitleChange(htmlOrText, isHtml) {
      if (!titleTextEl) return;
      if (reducedMotion) {
        if (isHtml) titleTextEl.innerHTML = htmlOrText;
        else titleTextEl.innerHTML = escapeHtml(htmlOrText);
        return;
      }
      titleTextEl.classList.remove("is-settled", "is-entering");
      titleTextEl.classList.add("is-leaving");
      window.setTimeout(function () {
        titleTextEl.innerHTML = isHtml ? htmlOrText : escapeHtml(htmlOrText);
        titleTextEl.classList.remove("is-leaving");
        titleTextEl.classList.add("is-entering");
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            titleTextEl.classList.remove("is-entering");
            titleTextEl.classList.add("is-settled");
          });
        });
      }, 400);
    }

    function runDescChange(text) {
      if (!descEl) return;
      if (reducedMotion) {
        descEl.textContent = text;
        return;
      }
      descEl.classList.remove("is-settled");
      descEl.classList.add("is-leaving");
      window.setTimeout(function () {
        descEl.textContent = text;
        descEl.classList.remove("is-leaving");
        descEl.classList.add("is-entering");
        void descEl.offsetWidth;
        window.setTimeout(function () {
          descEl.classList.remove("is-entering");
          descEl.classList.add("is-settled");
        }, 150);
      }, 120);
    }

    function setPillsActive(slug) {
      if (!rail) return;
      rail.querySelectorAll(".hero-stage__pill").forEach(function (btn) {
        if (btn.dataset.slug === slug && slug !== "idle") {
          btn.classList.add("is-active");
        } else {
          btn.classList.remove("is-active");
        }
      });
    }

    function announce(text) {
      if (a11yLive) a11yLive.textContent = text;
    }

    let transitioning = false;

    function transitionTo(nextSlug) {
      if (transitioning) return;
      if (nextSlug === currentSlug) return;
      transitioning = true;

      const isIdle = nextSlug === "idle";
      const proj = isIdle ? null : projectBySlug[nextSlug];

      if (isIdle) {
        crossfadeBackground(IDLE_BG);
        setClockLabel("BNE");
        runTitleChange(IDLE_TITLE_HTML, true);
        runDescChange(IDLE_DESC);
        if (eyebrowEl) {
          eyebrowEl.setAttribute("hidden", "hidden");
          eyebrowEl.setAttribute("aria-hidden", "true");
          eyebrowEl.textContent = "";
        }
        if (artifactWrap) {
          artifactWrap.classList.add("is-hidden");
        }
      } else if (proj) {
        crossfadeBackground(proj.bgPlaceholder);
        setClockLabel(proj.timezone.label);
        runTitleChange(proj.title, false);
        runDescChange(proj.description);
        if (eyebrowEl) {
          eyebrowEl.removeAttribute("hidden");
          eyebrowEl.removeAttribute("aria-hidden");
          eyebrowEl.textContent = proj.tags;
        }
        if (artifactEl && artifactWrap) {
          artifactWrap.classList.remove("is-hidden");
          artifactEl.style.background = proj.artifactPlaceholder;
        }
        announce("Showing project: " + proj.title);
      }

      setPillsActive(isIdle ? null : nextSlug);
      currentSlug = nextSlug;

      window.setTimeout(function () {
        transitioning = false;
      }, reducedMotion ? 0 : 1000);
    }

    if (rail) {
      projects.forEach(function (p, idx) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "hero-stage__pill" + (p.slug === "all" ? " hero-stage__pill--all" : "");
        btn.dataset.slug = p.slug;
        btn.dataset.index = String(idx);
        btn.textContent = p.slug === "all" ? "All Projects" : p.title;
        btn.setAttribute(
          "aria-label",
          p.slug === "all" ? "View all projects" : "View project: " + p.title
        );
        rail.appendChild(btn);
      });

      const pills = rail.querySelectorAll(".hero-stage__pill");

      function cancelIdleTimer() {
        if (idleTimer) {
          window.clearTimeout(idleTimer);
          idleTimer = null;
        }
      }

      function scheduleIdle() {
        if (mqCoarse.matches || keyboardLockedSlug) return;
        cancelIdleTimer();
        idleTimer = window.setTimeout(function () {
          keyboardLockedSlug = null;
          transitionTo("idle");
        }, 200);
      }

      pills.forEach(function (pill) {
        pill.addEventListener("mouseenter", function () {
          if (mqCoarse.matches) return;
          keyboardLockedSlug = null;
          cancelIdleTimer();
          transitionTo(pill.dataset.slug);
        });
        pill.addEventListener("mouseleave", function () {
          if (mqCoarse.matches) return;
          scheduleIdle();
        });
        pill.addEventListener("click", function () {
          if (!mqCoarse.matches) return;
          const slug = pill.dataset.slug;
          if (currentSlug === slug) {
            transitionTo("idle");
          } else {
            transitionTo(slug);
          }
        });
      });

      rail.addEventListener("keydown", function (e) {
        const list = Array.prototype.slice.call(pills);
        const i = list.indexOf(document.activeElement);
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          if (i >= 0 && i < list.length - 1) list[i + 1].focus();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          if (i > 0) list[i - 1].focus();
        } else if (e.key === "Enter" || e.key === " ") {
          if (
            document.activeElement &&
            document.activeElement.classList.contains("hero-stage__pill")
          ) {
            e.preventDefault();
            const slug = document.activeElement.dataset.slug;
            keyboardLockedSlug = slug;
            transitionTo(slug);
          }
        } else if (e.key === "Escape") {
          keyboardLockedSlug = null;
          transitionTo("idle");
        }
      });

      stage.addEventListener("click", function (e) {
        if (!mqCoarse.matches) return;
        if (e.target.closest(".hero-stage__pill")) return;
        if (e.target.closest("a, button, .hero-stage__menu-pill")) return;
        transitionTo("idle");
      });
    }

    if (bgA) {
      bgA.style.background = IDLE_BG;
      bgA.style.opacity = "1";
      bgA.style.zIndex = "2";
    }
    if (bgB) {
      bgB.style.opacity = "0";
      bgB.style.zIndex = "1";
    }

    if (artifactWrap) artifactWrap.classList.add("is-hidden");

    /** Cursor follower */
    if (cursorDot && window.matchMedia("(hover: hover)").matches) {
      let cx = 0;
      let cy = 0;
      let tx = 0;
      let ty = 0;
      document.addEventListener(
        "mousemove",
        function (e) {
          tx = e.clientX;
          ty = e.clientY;
          var overPill = e.target.closest && e.target.closest(".hero-stage__pill");
          if (overPill) {
            cursorDot.classList.add("is-wide");
          } else {
            cursorDot.classList.remove("is-wide");
          }
        },
        { passive: true }
      );
      function cursorTick() {
        cx += (tx - cx) * 0.15;
        cy += (ty - cy) * 0.15;
        cursorDot.style.transform = "translate(" + cx + "px, " + cy + "px)";
        window.requestAnimationFrame(cursorTick);
      }
      window.requestAnimationFrame(cursorTick);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroStage);
  } else {
    initHeroStage();
  }

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
  const testimonialQuoteEl = document.querySelector(".testimonial-carousel__quote");

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
  let testimonialGlowSkipFirst = true;

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

  const heroSection = document.getElementById("top");
  function setPastHeroHeader() {
    if (!header || !heroSection) return;
    var bottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > bottom - 96) {
      header.classList.add("site-header--past-hero");
    } else {
      header.classList.remove("site-header--past-hero");
    }
  }

  function onScrollHeader() {
    setScrolledHeader();
    setPastHeroHeader();
  }

  setScrolledHeader();
  setPastHeroHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  window.addEventListener("resize", setPastHeroHeader, { passive: true });

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

    if (testimonialQuoteEl && !testimonialGlowSkipFirst) {
      testimonialQuoteEl.classList.remove("is-glowing");
      window.requestAnimationFrame(function () {
        testimonialQuoteEl.classList.add("is-glowing");
        window.clearTimeout(testimonialQuoteEl._glowTimeout);
        testimonialQuoteEl._glowTimeout = window.setTimeout(function () {
          testimonialQuoteEl.classList.remove("is-glowing");
        }, 600);
      });
    }
    testimonialGlowSkipFirst = false;
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
