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
  let minX = 0;
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

  function centerPanelOffset(index) {
    const panel = panels[index];
    const panelLeft = panel.offsetLeft;
    const centered = window.innerWidth * 0.5 - (panelLeft + panel.offsetWidth * 0.5);
    return clamp(centered, minX, 0);
  }

  function nearestPanelIndexFromX(x) {
    let nearest = 0;
    let best = Infinity;
    panels.forEach((_, i) => {
      const d = Math.abs(x - centerPanelOffset(i));
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    return nearest;
  }

  function updateLayout() {
    panelPitch = panels.length > 1 ? panels[1].offsetLeft - panels[0].offsetLeft : panels[0].offsetWidth;
    const rightMostOffset = centerPanelOffset(panels.length - 1);
    minX = Math.min(0, rightMostOffset);

    if (currentX === 0 && targetX === 0) {
      currentX = centerPanelOffset(0);
      targetX = currentX;
    } else {
      currentX = clamp(currentX, minX, 0);
      targetX = clamp(targetX, minX, 0);
    }
    paintTrack();
    updateProgress(nearestPanelIndexFromX(currentX));
  }

  function paintTrack() {
    track.style.transform = `translateX(${currentX}px)`;
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
    const snapIndex = nearestPanelIndexFromX(targetX);

    if (reduceMotion) {
      currentX = targetX;
    } else {
      const k = 0.16;
      currentX += (targetX - currentX) * k;
    }

    paintTrack();
    updateProgress(nearestPanelIndexFromX(currentX));

    if (Math.abs(targetX - currentX) > 0.1) {
      rafId = requestAnimationFrame(animate);
    } else {
      currentX = targetX;
      paintTrack();
      updateProgress(snapIndex);
      rafId = 0;
    }
  }

  function requestAnimate() {
    if (!rafId) rafId = requestAnimationFrame(animate);
  }

  function snapToNearest() {
    const i = nearestPanelIndexFromX(targetX);
    targetX = centerPanelOffset(i);
    requestAnimate();
  }

  function onWheel(e) {
    e.preventDefault();
    targetX = clamp(targetX - e.deltaY * 0.9, minX, 0);
    requestAnimate();
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
    targetX = clamp(dragStartOffset + dx, minX, 0);
    requestAnimate();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    snapToNearest();
  }

  function goToPanel(index) {
    const i = clamp(index, 0, panels.length - 1);
    targetX = centerPanelOffset(i);
    requestAnimate();
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

  window.addEventListener("wheel", onWheel, { passive: false });
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

  setTimeout(() => {
    if (hint) hint.classList.add("is-hidden");
  }, 4000);
})();
