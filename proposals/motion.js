'use strict';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduce.matches;
const activeAnimations = new Set();
const timers = new Map();
function syncMotion() {
  document.documentElement.dataset.motion = paused || reduce.matches ? 'paused' : 'running';
  document.querySelectorAll('[data-motion-toggle]').forEach(button => {
    button.textContent = paused || reduce.matches ? 'Resume motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(paused || reduce.matches));
    button.disabled = reduce.matches;
    if (reduce.matches) button.textContent = 'Reduced motion';
  });
  if (paused || reduce.matches) {
    activeAnimations.forEach(animation => animation.finish()); activeAnimations.clear();
    document.querySelectorAll('[data-play]').forEach(button => stopFlow(button.closest('[data-flow]')));
  }
}
document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => { paused = !paused; syncMotion(); }));
reduce.addEventListener('change', syncMotion);
function appear(element, keyboard = false) {
  if (keyboard || paused) return;
  const frames = reduce.matches
    ? [{ opacity: .65 }, { opacity: 1 }]
    : [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }];
  const animation = element.animate(frames, { duration: reduce.matches ? 120 : 300, easing: 'cubic-bezier(0.23,1,0.32,1)' });
  activeAnimations.add(animation);
  animation.finished.then(() => activeAnimations.delete(animation)).catch(() => activeAnimations.delete(animation));
}
const seen = new WeakSet();
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !seen.has(entry.target)) { seen.add(entry.target); appear(entry.target); observer.unobserve(entry.target); }
  });
}, { threshold: .1 });
document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
const flowCopy = [
  'Read a scientific sentence and keep its exact wording available.',
  'Gemma LoRA proposes typed entities: Method, Task and Dataset.',
  'SciBERT classifies directed pairs of those predicted entities.',
  'Reconstruct the entity–relation JSON and inspect extraction errors.'
];
function stopFlow(flow) {
  if (!flow) return;
  (timers.get(flow) || []).forEach(clearTimeout); timers.delete(flow);
  const play = flow.querySelector('[data-play]');
  if (play) { play.textContent = 'Replay extraction ↗'; play.setAttribute('aria-pressed', 'false'); }
}
function selectStep(flow, index, keyboard) {
  const nodes = [...flow.querySelectorAll('[data-step]')];
  nodes.forEach((node, i) => { node.classList.toggle('is-active', i === index); node.setAttribute('aria-pressed', String(i === index)); });
  const status = flow.querySelector('[data-flow-status]'); status.textContent = flowCopy[index]; appear(status, keyboard);
  flow.querySelectorAll('[data-packet]').forEach(packet => { packet.style.transform = reduce.matches ? 'none' : `translateX(${index * 95}px)`; });
}
document.querySelectorAll('[data-flow]').forEach(flow => {
  flow.querySelectorAll('[data-step]').forEach((button, index) => button.addEventListener('click', event => { stopFlow(flow); selectStep(flow, index, event.detail === 0); }));
  flow.querySelector('[data-play]').addEventListener('click', event => {
    const wasRunning = timers.has(flow); stopFlow(flow);
    if (wasRunning) return;
    if (reduce.matches || paused || event.detail === 0) { selectStep(flow, 3, true); return; }
    const play = flow.querySelector('[data-play]'); play.textContent = 'Pause walkthrough'; play.setAttribute('aria-pressed','true');
    selectStep(flow, 0, false);
    const ids = [1, 2, 3].map(i => setTimeout(() => selectStep(flow, i, false), i * 1000));
    ids.push(setTimeout(() => stopFlow(flow), 3500)); timers.set(flow, ids);
  });
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', event => {
  const value = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-category]').forEach(card => {
    const show = value === 'all' || card.dataset.category === value; const wasHidden = card.hidden; card.hidden = !show;
    if (show && wasHidden) appear(card, event.detail === 0);
  });
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = value === 'all' ? 'Showing all three studies.' : 'Showing the selected research area.';
}));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('[data-flow]').forEach(stopFlow);
    document.documentElement.dataset.motion = 'paused';
  } else syncMotion();
});
syncMotion();
