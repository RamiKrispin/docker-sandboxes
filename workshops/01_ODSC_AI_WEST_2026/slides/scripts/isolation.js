/* Slides 06–09. Illustrations change emphasis only; the demo command is never run here. */
(() => {
  'use strict';
  const isolation = {
    direct: ['The existing host session', "The host's kernel", 'User access; little extra setup, broad integration'],
    os: ['A process under OS policy', "The host's kernel", 'Process policies; guarantees and compatibility vary'],
    container: ['An isolated process environment', 'The underlying Linux kernel, shared', 'Mounts and capabilities; efficient, deliberate sharing'],
    microvm: ['A lightweight virtual machine', 'Its own guest kernel', 'VM resources and integrations; extra startup and resource cost']
  };
  document.querySelectorAll('[data-isolation]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.isolation;
    document.querySelectorAll('[data-isolation]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-isolation-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.isolationPanel === selected));
    const values = isolation[selected];
    document.querySelector('[data-isolation-where]').textContent = values[0];
    document.querySelector('[data-isolation-kernel]').textContent = values[1];
    document.querySelector('[data-isolation-tradeoff]').textContent = values[2];
  }));

  const mountDetail = {
    project: ['01', 'Share the files the task needs.', 'A chosen project mount grants file access. It does not, by itself, grant control of the Docker daemon.'],
    socket: ['02', 'Socket access adds daemon control.', 'A client can request new containers and bind mounts, subject to the daemon’s privileges and host sharing constraints.']
  };
  document.querySelectorAll('[data-mount-mode]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.mountMode;
    document.querySelectorAll('[data-mount-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('.mount-diagram').dataset.mode = selected;
    const detail = document.querySelector('#mount-detail');
    const values = mountDetail[selected];
    detail.querySelector('.detail-number').textContent = values[0];
    detail.querySelector('h3').textContent = values[1];
    detail.querySelector('p').textContent = values[2];
  }));

  const stage = document.querySelector('.socket-stage');
  const play = document.querySelector('#socket-play');
  const pause = document.querySelector('#socket-pause');
  const replay = document.querySelector('#socket-replay');
  const sceneStatus = document.querySelector('#socket-status');
  const sceneCaption = document.querySelector('#socket-caption');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 11000;
  const sceneSteps = [
    ['Connect to the deliberately mounted socket.', 'Container A has a Docker client and a connection to the host daemon. It has no mount of the dummy folder.'],
    ['Send the request to that daemon.', 'The client asks the host Docker daemon to start another container. The request goes through the socket.'],
    ['The daemon creates container B.', 'B is a new container launched by the daemon. A did not break its own process boundary.'],
    ['The daemon mounts the dummy folder read-only.', 'The daemon resolves the host path and makes that chosen folder available inside B.'],
    ['B reads the file through its mount.', 'The dummy contents return through the request chain. The text in this comic is an illustration, not live output.']
  ];
  let running = false;
  let elapsed = 0;
  let startedAt = 0;
  let animationFrame = 0;
  let sceneStep = 0;

  function controls() {
    play.disabled = running;
    pause.disabled = !running;
    play.textContent = !running && elapsed > 0 && elapsed < duration ? 'Resume' : 'Play scene';
    stage.dataset.running = String(running);
  }
  function renderScene(step) {
    if (sceneStep === step) return;
    sceneStep = step;
    stage.dataset.step = String(step);
    document.querySelectorAll('[data-socket-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.socketStep) === step)));
    stage.querySelectorAll('[data-mechanism-at]').forEach(element => element.classList.toggle('visible', Number(element.dataset.mechanismAt) <= step));
    stage.querySelectorAll('[data-mechanism-wire]').forEach(wire => wire.classList.toggle('active', Number(wire.dataset.mechanismWire) === step || step === 5));
    const text = sceneSteps[step - 1];
    sceneCaption.querySelector('h3').textContent = step + ' · ' + text[0];
    sceneCaption.querySelector('p').textContent = text[1];
    sceneStatus.textContent = step === 5 ? 'Final illustrated result' : 'Step ' + step + ' of 5';
    stage.setAttribute('aria-label', 'Illustrated Docker socket request chain. Step ' + step + ': ' + text[0] + ' ' + text[1]);
  }
  function stepAt(time) { return Math.min(5, Math.floor(time / 2200) + 1); }
  function tick(now) {
    if (!running) return;
    elapsed = Math.min(duration, now - startedAt);
    renderScene(stepAt(elapsed));
    if (elapsed >= duration) {
      running = false;
      animationFrame = 0;
      sceneStatus.textContent = 'Final still · illustration';
      controls();
      return;
    }
    animationFrame = requestAnimationFrame(tick);
  }
  function startScene(reset = false) {
    if (running && !reset) return;
    cancelAnimationFrame(animationFrame);
    if (reset || elapsed >= duration) { elapsed = 0; renderScene(1); }
    running = true;
    startedAt = performance.now() - elapsed;
    controls();
    animationFrame = requestAnimationFrame(tick);
  }
  function pauseScene(reason = 'Paused') {
    if (!running) return;
    elapsed = Math.min(duration, performance.now() - startedAt);
    running = false;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    renderScene(stepAt(elapsed));
    sceneStatus.textContent = reason + ' · step ' + sceneStep;
    controls();
  }
  function finalStill() {
    pauseScene();
    elapsed = duration;
    renderScene(5);
    sceneStatus.textContent = 'Final still · reduced motion';
    controls();
  }
  play.addEventListener('click', () => startScene());
  pause.addEventListener('click', () => pauseScene());
  replay.addEventListener('click', () => startScene(true));
  document.querySelectorAll('[data-socket-step]').forEach(button => button.addEventListener('click', () => {
    pauseScene();
    const step = Number(button.dataset.socketStep);
    elapsed = step === 5 ? duration : (step - 1) * 2200;
    renderScene(step);
    sceneStatus.textContent = 'Selected step ' + step + ' of 5';
    controls();
  }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseScene('Paused while hidden'); });
  window.addEventListener('pagehide', () => pauseScene());
  window.addEventListener('beforeprint', () => pauseScene('Paused for print'));
  reducedMotion.addEventListener('change', event => { if (event.matches) finalStill(); });
  if (reducedMotion.matches) finalStill();
  else { renderScene(1); sceneStatus.textContent = '11-second scene · ready'; controls(); }
  window.SocketComic = Object.freeze({ pause: pauseScene, finalStill, getState: () => ({ running, elapsed, step: sceneStep }) });

  // Capture the exact six source lines before RevealHighlight creates its clones.
  const sourceCode = document.querySelector('#socket-command');
  const completeCommand = sourceCode.textContent;
  const copyStatus = document.querySelector('#socket-copy-status');
  document.querySelector('#socket-copy').addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(completeCommand); copied = true; }
    } catch { /* Use a local fallback when clipboard permissions are unavailable. */ }
    if (!copied) {
      const previousFocus = document.activeElement;
      const textarea = document.createElement('textarea');
      textarea.value = completeCommand;
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-label', 'Complete Docker socket demonstration command');
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      textarea.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    copyStatus.textContent = copied ? 'Copied all six lines.' : 'Copy unavailable. Select the code.';
  });

  const codeSteps = [
    { title: 'Start container A with a Docker client.', text: 'Lines 1 and 3 choose the first container and its client image. The complete command runs from the host shell.', targets: ['host', 'a'], links: ['launch'] },
    { title: 'Connect A to the host daemon.', text: 'Line 2 mounts the host daemon socket into A. This grants daemon access; the dummy folder is not mounted in A.', targets: ['a', 'daemon'], links: ['socket'] },
    { title: 'Ask that daemon to start container B.', text: 'Line 4 is the Docker command executed by the client inside A. The host daemon handles the request.', targets: ['a', 'daemon', 'b'], links: ['socket', 'request'] },
    { title: 'Mount the dummy host folder read-only.', text: 'Line 5 supplies the bind mount. DEMO_DIR expands in the host shell; the daemon resolves and mounts that path into B.', targets: ['host', 'daemon', 'b', 'folder'], links: ['mount'] },
    { title: 'Read the fixture inside B.', text: 'Line 6 starts Alpine and reads /host-data/proof.txt. Observe the real result in the prepared terminal.', targets: ['b', 'folder'], links: ['mount'] },
    { title: 'Follow the complete request chain.', text: 'Host shell → A’s client → host socket → daemon → B → read-only dummy folder. This is a deliberate socket configuration.', targets: ['host', 'a', 'daemon', 'b', 'folder'], links: ['launch', 'socket', 'request', 'mount'] }
  ];
  let deck = null;
  function synchronizeCode() {
    if (!deck || deck.getCurrentSlide()?.id !== 'socket-demo') return;
    const fragment = deck.getIndices().f ?? -1;
    const index = Math.max(0, Math.min(codeSteps.length - 1, fragment + 1));
    const step = codeSteps[index];
    const caption = document.querySelector('#socket-code-caption');
    caption.dataset.step = String(index + 1);
    caption.querySelector('h3').textContent = (index + 1) + ' · ' + step.title;
    caption.querySelector('p').textContent = step.text;
    document.querySelectorAll('[data-demo-target]').forEach(target => target.classList.toggle('active', step.targets.includes(target.dataset.demoTarget)));
    document.querySelectorAll('[data-demo-link]').forEach(link => link.classList.toggle('active', step.links.includes(link.dataset.demoLink)));
  }
  function synchronizeSlide() {
    if (deck.getCurrentSlide()?.id !== 'socket-mechanism') pauseScene('Paused on slide change');
    synchronizeCode();
  }
  window.WorkshopIsolation = Object.freeze({
    attach(instance) {
      deck = instance;
      deck.on('ready', synchronizeSlide);
      deck.on('slidechanged', synchronizeSlide);
      deck.on('fragmentshown', synchronizeCode);
      deck.on('fragmenthidden', synchronizeCode);
    }
  });
})();
