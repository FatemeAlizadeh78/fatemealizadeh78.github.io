'use strict';
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activate(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activate(tabs[next]); tabs[next].focus(); }
  });
});
const toggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle?.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open');
}));
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
