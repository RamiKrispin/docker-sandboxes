(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress');
  let index = 0;
  let previous = -1;

  slides.forEach((slide, i) => {
    const folio = slide.querySelector('[data-folio]');
    if (folio) {
      folio.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  });

  function show(next, updateHash = true) {
    previous = index;
    index = Math.max(0, Math.min(slides.length - 1, next));
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    if (index !== previous) {
      const scene = slides[index].querySelector('iframe[data-restart]');
      if (scene) scene.src = scene.src;
    }
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    if (updateHash) history.replaceState(null, '', `#${index + 1}`);
  }

  function fromHash() {
    const value = location.hash.slice(1);
    const numeric = /^\d+$/.test(value) ? Number(value) - 1 : -1;
    const named = slides.findIndex(slide => slide.id === value);
    show(numeric >= 0 ? numeric : Math.max(0, named));
  }

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey ||
        event.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
    let next;
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) next = index + 1;
    else if (event.key === ' ') next = index + (event.shiftKey ? -1 : 1);
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) next = index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = slides.length - 1;
    else return;
    event.preventDefault();
    show(next);
  });

  document.addEventListener('click', event => {
    if (event.target.closest('a, button, input, textarea, select, pre, code') ||
        window.getSelection()?.toString()) return;
    show(index + 1);
  });
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
