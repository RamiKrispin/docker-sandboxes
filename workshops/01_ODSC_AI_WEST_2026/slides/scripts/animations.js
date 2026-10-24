/* Approval-fatigue comic: manual start, a 12-second route, stable final frame. */
(() => {
  'use strict';
  const stage = document.querySelector('.comic-stage');
  if (!stage) return;
  const startButton = document.querySelector('#comic-start');
  const pauseButton = document.querySelector('#comic-pause');
  const replayButton = document.querySelector('#comic-replay');
  const status = document.querySelector('#comic-status');
  const dialog = document.querySelector('#comic-dialog-text');
  const question = document.querySelector('#comic-question');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 12000;
  const frames = [
    { at: 0, dialog: "Run the project's tests?", status: 'Thoughtful review', question: 'A thoughtful first approval. Then another request arrives.' },
    { at: 2400, dialog: 'Install a package?', status: 'Another request', question: 'A package install. A file edit. Another command.' },
    { at: 5000, dialog: 'Modify this file?', status: 'Requests accumulate', question: 'The requests keep arriving. Attention starts to drift.' },
    { at: 7800, dialog: 'Run another command?', status: 'Approval becomes a reflex', question: 'The stamp keeps moving. How much review remains?' },
    { at: duration, dialog: 'Run another command?', status: 'Final still', question: 'If every click is approval, are we still reviewing?' }
  ];
  let elapsed = 0;
  let startedAt = 0;
  let animationFrame = 0;
  let running = false;
  let currentFrame = -1;

  function renderFrame(index) {
    if (currentFrame === index) return;
    currentFrame = index;
    const frame = frames[index];
    stage.dataset.stage = String(index);
    dialog.textContent = frame.dialog;
    status.textContent = frame.status;
    question.textContent = frame.question;
    question.classList.toggle('is-final', index === frames.length - 1);
    stage.setAttribute('aria-label', 'Approval fatigue comic: ' + frame.status + '. ' + frame.question);
  }

  function frameFor(time) {
    let index = 0;
    frames.forEach((frame, i) => { if (time >= frame.at) index = i; });
    return index;
  }

  function updateControls() {
    startButton.disabled = running;
    startButton.textContent = !running && elapsed > 0 && elapsed < duration ? 'Resume' : 'Start scene';
    pauseButton.disabled = !running;
    stage.dataset.running = String(running);
  }

  function tick(now) {
    if (!running) return;
    elapsed = Math.min(duration, now - startedAt);
    renderFrame(frameFor(elapsed));
    if (elapsed >= duration) {
      running = false;
      animationFrame = 0;
      updateControls();
      return;
    }
    animationFrame = requestAnimationFrame(tick);
  }

  function start(reset = false) {
    if (running && !reset) return;
    cancelAnimationFrame(animationFrame);
    if (reset || elapsed >= duration) {
      elapsed = 0;
      renderFrame(0);
    }
    running = true;
    startedAt = performance.now() - elapsed;
    updateControls();
    animationFrame = requestAnimationFrame(tick);
  }

  function pause(reason = 'Paused') {
    if (!running) return;
    elapsed = Math.min(duration, performance.now() - startedAt);
    running = false;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    renderFrame(frameFor(elapsed));
    status.textContent = reason + ' · ' + frames[frameFor(elapsed)].status.toLowerCase();
    updateControls();
  }

  function finalStill() {
    pause();
    elapsed = duration;
    renderFrame(frames.length - 1);
    status.textContent = 'Final still · reduced motion';
    updateControls();
  }

  startButton.addEventListener('click', () => start());
  replayButton.addEventListener('click', () => start(true));
  pauseButton.addEventListener('click', () => pause());
  reducedMotion.addEventListener('change', event => { if (event.matches) finalStill(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Paused while hidden'); });
  window.addEventListener('pagehide', () => pause());
  window.addEventListener('beforeprint', () => pause('Paused for print'));
  if (reducedMotion.matches) finalStill();
  else {
    renderFrame(0);
    status.textContent = '12-second scene · ready';
    updateControls();
  }
  window.WorkshopComic = Object.freeze({ pause, finalStill, getState: () => ({ elapsed, running, frame: currentFrame }) });
})();
