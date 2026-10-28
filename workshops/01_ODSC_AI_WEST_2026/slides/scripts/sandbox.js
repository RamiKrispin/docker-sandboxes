/* Slides 10–12: sandbox architecture, an illustrative comic, and launch source. */
(() => {
  'use strict';
  const architecturePaths = {
    host: { title: 'The socket connects the client to the host daemon.', text: 'The daemon handles the request and manages the resulting containers. This is the configuration we just demonstrated.', nodes: ['host-client', 'host-daemon', 'host-children'], routes: ['host-request', 'host-children'] },
    sandbox: { title: 'The sandbox client uses the sandbox engine.', text: 'Docker work uses this VM’s engine. App containers and their separate Linux kernel stay inside the VM.', nodes: ['sandbox-client', 'sandbox-engine', 'sandbox-children'], routes: ['sandbox-request', 'sandbox-children'] },
    workspace: { title: 'Workspace sharing is intentional.', text: 'The chosen project crosses the boundary with configured access. Writable edits still reach host project files.', nodes: ['sandbox-client', 'workspace'], routes: ['workspace'] },
    network: { title: 'Outbound access follows network policy.', text: 'Choose destinations for the task. Outbound policy must allow the model-provider connections the agent needs.', nodes: ['sandbox-engine', 'network'], routes: ['network'] }
  };
  function selectArchitecture(selected) {
    const data = architecturePaths[selected];
    document.querySelectorAll('[data-sandbox-path]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sandboxPath === selected)));
    document.querySelectorAll('[data-sandbox-node]').forEach(node => node.classList.toggle('emphasized', data.nodes.includes(node.dataset.sandboxNode)));
    document.querySelectorAll('[data-sandbox-route]').forEach(route => route.classList.toggle('emphasized', data.routes.includes(route.dataset.sandboxRoute)));
    const caption = document.querySelector('#sandbox-path-caption');
    caption.dataset.path = selected;
    caption.querySelector('h3').textContent = data.title;
    caption.querySelector('p').textContent = data.text;
  }
  document.querySelectorAll('[data-sandbox-path]').forEach(button => button.addEventListener('click', () => selectArchitecture(button.dataset.sandboxPath)));
  selectArchitecture('host');

  const stage = document.querySelector('.microvm-stage');
  const robot = document.querySelector('#micro-robot');
  const hose = document.querySelector('#micro-hose');
  const play = document.querySelector('#microvm-play');
  const pause = document.querySelector('#microvm-pause');
  const replay = document.querySelector('#microvm-replay');
  const status = document.querySelector('#microvm-status');
  const caption = document.querySelector('#microvm-caption');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 11000;
  const phases = [
    { at: 0, title: 'Build successfully with the sandbox engine.', text: 'The robot’s useful Docker work stays inside the microVM.', status: 'An internal build succeeds' },
    { at: 2500, title: 'Try a different destination: the host daemon.', text: 'The robot takes its hose toward the microVM boundary. That is not its internal Docker engine.', status: 'Trying the host daemon' },
    { at: 4300, title: 'BOING! No default host-engine connection.', text: 'The hose does not connect through this boundary. The host daemon is separate from the sandbox engine.', status: 'The default engine boundary holds' },
    { at: 6200, title: 'Return to the sandbox engine.', text: 'The robot heads back to the engine already available inside its VM.', status: 'Back to the internal engine' },
    { at: 8500, title: 'Keep useful Docker work inside the microVM.', text: 'The sandbox engine still builds successfully. Shared resources still need deliberate access decisions.', status: 'Final still · useful work continues' }
  ];
  let running = false;
  let elapsed = 0;
  let startedAt = 0;
  let animationFrame = 0;
  let currentPhase = -1;
  let robotPosition = 160;
  function phaseAt(time) {
    let result = 0;
    phases.forEach((phase, index) => { if (time >= phase.at) result = index; });
    return result;
  }
  function smooth(value) { const x = Math.max(0, Math.min(1, value)); return x * x * (3 - 2 * x); }
  function lerp(from, to, value) { return from + (to - from) * value; }
  function renderMotion(time, phase) {
    let x = 160;
    let rotation = 0;
    let squash = 1;
    if (!reducedMotion.matches) {
      if (time >= 2500 && time < 4300) x = lerp(160, 850, smooth((time - 2500) / 1800));
      else if (time >= 4300 && time < 4550) { x = 850; squash = lerp(1, .88, smooth((time - 4300) / 250)); }
      else if (time >= 4550 && time < 5350) { const progress = smooth((time - 4550) / 800); x = lerp(850, 620, progress); rotation = -18 * Math.sin(progress * Math.PI / 2); }
      else if (time >= 5350 && time < 6200) { const progress = smooth((time - 5350) / 850); x = lerp(620, 670, progress); rotation = lerp(-18, 0, progress); }
      else if (time >= 6200 && time < 8500) x = lerp(670, 160, smooth((time - 6200) / 2300));
    } else if (phase === 1 || phase === 2) x = 850;
    robotPosition = x;
    robot.setAttribute('transform', `translate(${x.toFixed(2)} 108) rotate(${rotation.toFixed(2)} 80 90) scale(${squash.toFixed(3)} 1)`);
    const startX = Math.min(1005, x + 145);
    hose.setAttribute('d', `M${startX.toFixed(2)} 238 Q${Math.min(1006, startX + 58).toFixed(2)} 263 1008 243`);
  }
  function render(time) {
    const phase = phaseAt(time);
    renderMotion(time, phase);
    if (currentPhase === phase) return;
    currentPhase = phase;
    stage.dataset.phase = String(phase);
    const data = phases[phase];
    caption.querySelector('h3').textContent = data.title;
    caption.querySelector('p').textContent = data.text;
    status.textContent = data.status;
    stage.setAttribute('aria-label', 'MicroVM comic. ' + data.title + ' ' + data.text);
  }
  function controls() {
    play.disabled = running;
    pause.disabled = !running;
    play.textContent = !running && elapsed > 0 && elapsed < duration ? 'Resume' : 'Play scene';
    stage.dataset.running = String(running);
  }
  function tick(now) {
    if (!running) return;
    elapsed = Math.min(duration, now - startedAt);
    render(elapsed);
    if (elapsed >= duration) {
      running = false;
      animationFrame = 0;
      controls();
      return;
    }
    animationFrame = requestAnimationFrame(tick);
  }
  function start(reset = false) {
    if (running && !reset) return;
    cancelAnimationFrame(animationFrame);
    if (reset || elapsed >= duration) { elapsed = 0; render(elapsed); }
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
    render(elapsed);
    status.textContent = reason + ' · ' + phases[currentPhase].status.toLowerCase();
    controls();
  }
  function finalStill() {
    pauseScene();
    elapsed = duration;
    render(elapsed);
    status.textContent = 'Final still · reduced motion';
    controls();
  }
  play.addEventListener('click', () => start());
  pause.addEventListener('click', () => pauseScene());
  replay.addEventListener('click', () => start(true));
  reducedMotion.addEventListener('change', event => { if (event.matches) finalStill(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseScene('Paused while hidden'); });
  window.addEventListener('pagehide', () => pauseScene());
  window.addEventListener('beforeprint', () => pauseScene('Paused for print'));
  if (reducedMotion.matches) finalStill();
  else { render(0); status.textContent = '11-second scene · ready'; controls(); }
  window.MicrovmComic = Object.freeze({ pause: pauseScene, finalStill, getState: () => ({ running, elapsed, phase: currentPhase, robotX: robotPosition }) });

  const launchSource = document.querySelector('#launch-command').textContent;
  const copyStatus = document.querySelector('#launch-copy-status');
  document.querySelector('#launch-copy').addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(launchSource); copied = true; }
    } catch { /* Fall back to a local clipboard action when permission is unavailable. */ }
    if (!copied) {
      const previousFocus = document.activeElement;
      const textarea = document.createElement('textarea');
      textarea.value = launchSource;
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-label', 'Complete sandbox launch command');
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      textarea.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    copyStatus.textContent = copied ? 'Copied all six lines.' : 'Copy unavailable. Select the code.';
  });

  const launchSteps = [
    { title: 'Enter the demo folder.', text: 'Line 1 enters the folder containing both explicitly named workspaces.', nodes: ['folder'], routes: [] },
    { title: 'Run a named sandbox.', text: 'Lines 2–3 start detached, name odsc-basics, and allocate two CPUs and 4 GiB. These settings apply to a new sandbox.', nodes: ['folder', 'name'], routes: ['name'] },
    { title: 'Select the coding agent.', text: 'Line 4 chooses Codex. Agent authentication is prepared separately before the session.', nodes: ['agent'], routes: ['agent'] },
    { title: 'Set writable and read-only boundaries.', text: 'Lines 5–6 name both folders: demo-workspace is writable by default, while :ro restricts reference.', nodes: ['folder', 'workspace'], routes: ['workspace'] },
    { title: 'Make the launch explicit.', text: 'Folder names, sandbox name, agent, and workspace boundaries are visible. Next, inspect status, verify access, and practice stop/restart before Demo 03.', nodes: ['folder', 'name', 'agent', 'workspace'], routes: ['name', 'agent', 'workspace'] }
  ];
  let deck = null;
  function synchronizeLaunch() {
    if (!deck || deck.getCurrentSlide()?.id !== 'agent-launch') return;
    const index = Math.max(0, Math.min(launchSteps.length - 1, (deck.getIndices().f ?? -1) + 1));
    const data = launchSteps[index];
    const output = document.querySelector('#launch-code-caption');
    output.dataset.step = String(index + 1);
    output.querySelector('h3').textContent = (index + 1) + ' · ' + data.title;
    output.querySelector('p').textContent = data.text;
    document.querySelectorAll('[data-launch-node]').forEach(node => node.classList.toggle('emphasized', data.nodes.includes(node.dataset.launchNode)));
    document.querySelectorAll('[data-launch-route]').forEach(route => route.classList.toggle('emphasized', data.routes.includes(route.dataset.launchRoute)));
  }
  function synchronizeSlide() {
    if (deck.getCurrentSlide()?.id !== 'microvm-boundary') pauseScene('Paused on slide change');
    synchronizeLaunch();
  }
  window.WorkshopSandbox = Object.freeze({
    attach(instance) {
      deck = instance;
      deck.on('ready', synchronizeSlide);
      deck.on('slidechanged', synchronizeSlide);
      deck.on('fragmentshown', synchronizeLaunch);
      deck.on('fragmenthidden', synchronizeLaunch);
    }
  });
})();
