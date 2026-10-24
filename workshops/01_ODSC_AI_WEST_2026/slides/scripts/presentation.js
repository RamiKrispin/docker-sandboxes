/* All teaching interactions are local. Selection changes emphasis, never access. */
(() => {
  'use strict';
  const actionData = {
    commands: ['01', "Run the project's tests.", 'The agent starts a process. That process runs with the access its environment gives it.'],
    files: ['02', 'Update the dashboard source.', 'The agent reads and writes the workspace files its tools can reach.'],
    packages: ['03', 'Fetch and install a dependency.', 'The agent reaches a package source and changes its software environment.'],
    builds: ['04', 'Build an application image.', 'The Docker client asks a Docker engine to perform the build. Which engine matters.']
  };
  const scenarioData = {
    suggest: { detail: ['01', 'Propose a change from supplied context.', 'We can ask for a suggestion without granting local tool access.'], resources: [] },
    edit: { detail: ['02', 'Read and update a chosen project.', 'We grant access to the project files. The whole home directory is not needed.'], resources: ['project'] },
    build: { detail: ['03', 'Build a container and fetch its dependencies.', 'This example needs project files, package network access and a Docker daemon. Which daemon is an access decision.'], resources: ['project', 'network', 'docker'] }
  };
  const boundaryData = {
    workspace: ['01', 'Share a chosen workspace.', "File access follows the workspace's mount mode and permissions. Shared writable files remain writable."],
    network: ['02', 'Choose allowed destinations.', 'Network access follows the environment’s policy. Decide which services the task should reach.'],
    credentials: ['03', 'Grant only the credentials the task needs.', 'Shared credentials still carry authority. A sandbox does not make a shared secret harmless.']
  };

  function updateDetail(selector, data) {
    const detail = document.querySelector(selector);
    detail.querySelector('.detail-number').textContent = data[0];
    detail.querySelector('h3').textContent = data[1];
    detail.querySelector('p').textContent = data[2];
  }

  function pressedGroup(selector, key, selected) {
    document.querySelectorAll(selector).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[key] === selected)));
  }

  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.action;
    pressedGroup('[data-action]', 'action', selected);
    document.querySelectorAll('[data-wire]').forEach(path => path.classList.toggle('active', path.dataset.wire === selected));
    updateDetail('#action-detail', actionData[selected]);
  }));

  document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.scenario;
    pressedGroup('[data-scenario]', 'scenario', selected);
    const data = scenarioData[selected];
    document.querySelectorAll('[data-resource]').forEach(resource => {
      const active = data.resources.includes(resource.dataset.resource);
      resource.classList.toggle('active', active);
      resource.querySelector('.resource-status').textContent = active ? 'Needed in this example' : 'Not needed here';
    });
    updateDetail('#scenario-detail', data.detail);
  }));

  document.querySelectorAll('[data-boundary]').forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.boundary;
    pressedGroup('[data-boundary]', 'boundary', selected);
    document.querySelectorAll('[data-path]').forEach(path => path.classList.toggle('active', path.dataset.path === selected));
    updateDetail('#boundary-detail', boundaryData[selected]);
  }));

  // Let native button activation work; keep widget navigation out of Reveal's key handler.
  const navigationKeys = new Set([' ', 'Spacebar', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
  const interactive = 'button, a, input, select, textarea, [contenteditable="true"], [role="tab"]';
  ['keydown', 'keyup'].forEach(type => document.addEventListener(type, event => {
    if (event.target.closest(interactive) && navigationKeys.has(event.key)) {
      event.stopImmediatePropagation();
      if (event.key.startsWith('Arrow') || ['PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) event.preventDefault();
    }
  }, true));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const deck = new Reveal(document.querySelector('.reveal'), {
    width: 1600,
    height: 900,
    margin: 0,
    minScale: 0.1,
    maxScale: 3,
    view: 'slide',
    center: false,
    controls: false,
    progress: true,
    hash: true,
    respondToHashChanges: true,
    history: false,
    transition: reducedMotion.matches ? 'none' : 'fade',
    transitionSpeed: 'default',
    backgroundTransition: 'none',
    slideNumber: false,
    touch: true,
    overview: false,
    help: true,
    autoPlayMedia: false,
    pdfSeparateFragments: false,
    plugins: [RevealNotes, RevealHighlight]
  });
  // Expose the real Reveal instance for presenter tools and local verification.
  window.deck = deck;
  window.WorkshopIsolation?.attach(deck);
  window.WorkshopSandbox?.attach(deck);
  window.WorkshopFinishing?.attach(deck);

  function synchronizeActiveSlide() {
    const current = deck.getCurrentSlide();
    document.querySelectorAll('.slides > section').forEach(slide => {
      const active = slide === current;
      if (!active && slide.contains(document.activeElement)) document.activeElement.blur();
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (!current || current.id !== 'approval-fatigue') window.WorkshopComic?.pause('Paused on slide change');
  }
  deck.on('ready', synchronizeActiveSlide);
  deck.on('slidechanged', synchronizeActiveSlide);
  reducedMotion.addEventListener('change', event => deck.configure({ transition: event.matches ? 'none' : 'fade' }));
  deck.initialize().then(synchronizeActiveSlide);
})();
