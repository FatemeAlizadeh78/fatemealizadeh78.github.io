/* Decorative graph: fixed dots, with a spring-following cursor connection hub. */
(() => {
  const canvas = document.querySelector('.network');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let width = 0, height = 0, nodes = [], frame = 0, previous = 0;
  const target = { x: 0, y: 0, active: false };
  const hub = { x: 0, y: 0, vx: 0, vy: 0 };
  const enabled = () => !reduce.matches && fine.matches && !document.hidden &&
    document.documentElement.dataset.motion !== 'paused';
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const active = enabled() && target.active;
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach(b => {
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const nearby = active && Math.hypot(a.x - hub.x, a.y - hub.y) < 135;
        if (distance > (nearby ? 105 : 65)) return;
        ctx.strokeStyle = nearby ? '#c6c6c68c' : '#a0a0a04d';
        ctx.lineWidth = nearby ? 1.25 : .9;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      if (active && Math.hypot(a.x - hub.x, a.y - hub.y) < 125) {
        ctx.strokeStyle = '#cececeaa'; ctx.lineWidth = 1.15;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(hub.x, hub.y); ctx.stroke();
      }
      ctx.fillStyle = i % 4 === 0 ? '#cccccc' : '#aaaaaa';
      ctx.beginPath(); ctx.arc(a.x, a.y, i % 4 === 0 ? 3.6 : 2.6, 0, Math.PI * 2); ctx.fill();
    });
    if (active) {
      ctx.fillStyle = '#d0d0d0'; ctx.beginPath(); ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2); ctx.fill();
    }
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  function tick(time) {
    frame = 0;
    if (!enabled() || !target.active) { previous = 0; draw(); return; }
    // Run the same spring at 75% speed for gentler connection tracking.
    const dt = Math.min((time - (previous || time - 16)) / 1000, .025) * .75;
    previous = time;
    // A damped spring: mass 1, stiffness 100, damping 10.
    for (const axis of ['x', 'y']) {
      const velocity = axis === 'x' ? 'vx' : 'vy';
      hub[velocity] += ((target[axis] - hub[axis]) * 100 - hub[velocity] * 10) * dt;
      hub[axis] += hub[velocity] * dt;
    }
    draw();
    if (Math.hypot(target.x - hub.x, target.y - hub.y) > .15 || Math.hypot(hub.vx, hub.vy) > .15)
      frame = requestAnimationFrame(tick);
    else previous = 0;
  }
  function resize() {
    stop(); width = innerWidth; height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * scale; canvas.height = height * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    // Deterministic placement avoids flicker when the viewport is resized.
    let seed = 8147;
    const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    nodes = Array.from({ length: Math.min(150, Math.max(40, Math.round(width * height / 12000))) }, () => ({
      x: (.06 + random() * .88) * width,
      y: (.05 + random() * .9) * height
    }));
    target.active = false; draw();
  }
  document.addEventListener('pointermove', event => {
    if (!enabled()) return;
    target.x = event.clientX; target.y = event.clientY;
    if (!target.active) { hub.x = target.x; hub.y = target.y; hub.vx = hub.vy = 0; }
    target.active = true;
    if (!frame) frame = requestAnimationFrame(tick);
  });
  document.documentElement.addEventListener('pointerleave', () => { target.active = false; stop(); draw(); });
  function sync() { target.active = false; stop(); draw(); }
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  window.addEventListener('resize', resize);
  resize();
  reduce.addEventListener('change', sync); fine.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
})();
