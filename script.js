// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.track');
  const panels = document.querySelectorAll('.panel');
  
  if (!track) {
    console.error('No .track element found! Check your HTML.');
    return;
  }
  
  console.log('Track found:', track);
  console.log('Panels found:', panels.length);
  
  // Get panel width including gap
  const firstPanel = panels[0];
  const panelStyle = window.getComputedStyle(firstPanel);
  const panelWidth = firstPanel.offsetWidth;
  const gap = 64; // 4rem in pixels — adjust if your CSS uses different
  const stride = panelWidth + gap;
  
  let targetX = 0;
  let currentX = 0;
  const minX = -(panels.length - 1) * stride;
  const maxX = 0;
  
  // Animation loop
  function animate() {
    currentX += (targetX - currentX) * 0.08;
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    requestAnimationFrame(animate);
  }
  animate();
  
  // Wheel handler — must use { passive: false } for preventDefault
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetX -= e.deltaY * 1.5;
    targetX = Math.max(minX, Math.min(maxX, targetX));
    console.log('wheel fired, targetX:', targetX);
    
    // Snap to nearest panel after scroll stops
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      const nearest = Math.round(targetX / stride) * stride;
      targetX = Math.max(minX, Math.min(maxX, nearest));
    }, 200);
  }, { passive: false });
  
  // Arrow key navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      targetX = Math.max(minX, targetX - stride);
    } else if (e.key === 'ArrowLeft') {
      targetX = Math.min(maxX, targetX + stride);
    }
  });
  
  // Touch/drag support
  let isDragging = false;
  let dragStartX = 0;
  let dragStartTargetX = 0;
  
  window.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartTargetX = targetX;
  });
  
  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    targetX = dragStartTargetX + delta;
    targetX = Math.max(minX, Math.min(maxX, targetX));
  });
  
  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    const nearest = Math.round(targetX / stride) * stride;
    targetX = Math.max(minX, Math.min(maxX, nearest));
  });
});
