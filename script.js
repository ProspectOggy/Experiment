(function () {
  "use strict";

  const panelTitles = [
    "Hero",
    "Practical",
    "Approach",
    "Delivery",
    "Craft",
    "Software",
    "Coomera",
    "Field Notes",
    "Principles",
    "Contact",
  ];

  const body = document.body;
  const track = document.getElementById("track");
  const panels = Array.from(document.querySelectorAll(".panel"));
  const progressTicks = document.getElementById("progress-ticks");
  const progressLabels = document.getElementById("progress-labels");
  const progressActive = document.getElementById("progress-active");
  const cursorPixel = document.getElementById("cursor-pixel");
  const hint = document.getElementById("hint");

  if (!track || !panels.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cursorEnabled = !reduceMotion;

  let panelPitch = 0;
  let panelWidth = 0;
  let gap = 0;
  let minX = 0;
  const maxX = 0;
  let currentX = 0;
  let targetX = 0;
  let rafId = 0;
  let snapTimer = 0;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;

  let cursorX = -999;
  let cursorY = -999;
  let cursorNeedsPaint = false;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function nearestPanelIndexFromX(x) {
    if (!panelPitch) return 0;
    const idx = Math.round(Math.abs(x) / panelPitch);
    return clamp(idx, 0, panels.length - 1);
  }

  function updateLayout() {
    panelWidth = panels[0].offsetWidth;
    const cs = window.getComputedStyle(track);
    gap = parseFloat(cs.columnGap || cs.gap || "0") || 0;
    panelPitch = panelWidth + gap;
    minX = -((panels.length - 1) * panelPitch);

    currentX = clamp(currentX, minX, maxX);
    targetX = clamp(targetX, minX, maxX);
    paintTrack();
    updateProgress(nearestPanelIndexFromX(currentX));
  }

  function paintTrack() {
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }

  function updateProgress(index) {
    const ticks = progressTicks.querySelectorAll(".progress__tick");
    const labels = progressLabels.querySelectorAll(".progress__label");
    if (!ticks.length) return;

    const tick = ticks[index];
    if (tick && progressActive) {
      const left = tick.offsetLeft + tick.offsetWidth * 0.5;
      progressActive.style.transform = `translateX(calc(${left}px - 50%))`;
    }

    labels.forEach((label, i) => {
      label.classList.toggle("is-visible", Math.abs(i - index) === 1);
    });
  }

  function animate() {
    if (reduceMotion) {
      currentX = targetX;
    } else {
      const k = 0.16;
      currentX += (targetX - currentX) * k;
    }

    paintTrack();
    updateProgress(nearestPanelIndexFromX(currentX));

    if (Math.abs(targetX - currentX) <= 0.05) {
      currentX = targetX;
      paintTrack();
    }
    rafId = requestAnimationFrame(animate);
  }

  function snapToNearest() {
    const i = nearestPanelIndexFromX(targetX);
    targetX = clamp(-(i * panelPitch), minX, maxX);
  }

  function handleWheel(e) {
    e.preventDefault();
    targetX -= e.deltaY * 1.5;
    const localMaxX = 0;
    const localMinX = -((panels.length - 1) * (panelWidth + gap));
    targetX = Math.max(localMinX, Math.min(localMaxX, targetX));
    console.log("wheel fired, targetX:", targetX);
    clearTimeout(snapTimer);
    snapTimer = setTimeout(snapToNearest, 300);
  }

  function onDragStart(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragStartOffset = targetX;
    clearTimeout(snapTimer);
  }

  function onDragMove(clientX) {
    if (!isDragging) return;
    const dx = clientX - dragStartX;
    targetX = clamp(dragStartOffset + dx, minX, maxX);
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    snapToNearest();
  }

  function goToPanel(index) {
    const i = clamp(index, 0, panels.length - 1);
    targetX = clamp(-(i * panelPitch), minX, maxX);
  }

  function buildProgress() {
    panelTitles.forEach((title, i) => {
      const tick = document.createElement("button");
      tick.type = "button";
      tick.className = "progress__tick";
      tick.setAttribute("aria-label", `Go to panel ${i + 1}: ${title}`);
      tick.addEventListener("click", () => goToPanel(i));
      progressTicks.appendChild(tick);

      const label = document.createElement("span");
      label.className = "progress__label";
      label.textContent = title;
      progressLabels.appendChild(label);
    });

    const ticks = progressTicks.querySelectorAll(".progress__tick");
    const labels = progressLabels.querySelectorAll(".progress__label");
    ticks.forEach((tick, i) => {
      const cx = tick.offsetLeft + tick.offsetWidth * 0.5;
      labels[i].style.left = `${cx}px`;
    });
  }

  function onKeyDown(e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToPanel(nearestPanelIndexFromX(targetX) + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPanel(nearestPanelIndexFromX(targetX) - 1);
    } else if (e.key.toLowerCase() === "c") {
      cursorEnabled = !cursorEnabled;
      body.classList.toggle("cursor-on", !cursorEnabled);
      if (!cursorEnabled && cursorPixel) {
        cursorPixel.style.transform = "translate(-999px, -999px)";
      }
    }
  }

  function paintCursor() {
    if (!cursorPixel) return;
    cursorNeedsPaint = false;
    if (!cursorEnabled || window.matchMedia("(hover: none)").matches) return;
    cursorPixel.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  }

  function queueCursorPaint() {
    if (cursorNeedsPaint) return;
    cursorNeedsPaint = true;
    requestAnimationFrame(paintCursor);
  }

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    queueCursorPaint();
  });

  window.addEventListener("wheel", handleWheel, { passive: false });
  track.addEventListener("pointerdown", (e) => {
    track.setPointerCapture(e.pointerId);
    onDragStart(e.clientX);
  });
  track.addEventListener("pointermove", (e) => onDragMove(e.clientX));
  track.addEventListener("pointerup", onDragEnd);
  track.addEventListener("pointercancel", onDragEnd);

  window.addEventListener("keydown", onKeyDown);

  window.addEventListener("resize", () => {
    updateLayout();
    const ticks = progressTicks.querySelectorAll(".progress__tick");
    const labels = progressLabels.querySelectorAll(".progress__label");
    ticks.forEach((tick, i) => {
      const cx = tick.offsetLeft + tick.offsetWidth * 0.5;
      labels[i].style.left = `${cx}px`;
    });
    snapToNearest();
  });

  buildProgress();
  updateLayout();
  goToPanel(0);
  rafId = requestAnimationFrame(animate);

  setTimeout(() => {
    if (hint) hint.classList.add("is-hidden");
  }, 4000);
})();
