/* Slides 13–17. The browser illustrates commands; it never executes them. */
(() => {
  'use strict';
  const source = JSON.parse(document.querySelector('#finishing-source-data').textContent);
  let deck = null;
  let rebuilding = false;
  function releasePointerFocus(event) {
    if (event.detail > 0) event.currentTarget.blur();
  }

  async function copySource(value, status, message) {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch { /* File URLs and denied clipboard access use the local fallback. */ }
    if (!copied) {
      const previous = document.activeElement;
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-label', 'Complete source of the selected code block');
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      textarea.remove();
      previous?.focus({ preventScroll: true });
    }
    status.textContent = copied ? message : 'Copy unavailable. Select the code.';
  }

  function replaceCode(wrapper, id, data, fragmentIndex) {
    const code = document.createElement('code');
    code.id = id;
    code.className = 'language-' + data.language;
    code.dataset.lineNumbers = data.ranges;
    code.textContent = data.source;
    wrapper.replaceChildren(code);
    if (deck?.isReady()) {
      rebuilding = true;
      deck.getPlugin('highlight').highlightBlock(code);
      deck.sync();
      const indices = deck.getIndices();
      deck.slide(indices.h, indices.v, fragmentIndex);
      rebuilding = false;
    }
  }

  const appViews = {
    task: {
      source: source.CSV, language: 'plaintext', ranges: '1|2-3|1-3',
      context: 'Synthetic CSV · prepared task', tags: ['CSV columns', 'Sample rows'],
      steps: [
        ['Four columns define the task.', 'Dates, regions, products and revenue are synthetic data for this workshop.', [0]],
        ['Inspect representative rows.', 'Each row records revenue for one date, region and product. These are harmless workshop fixtures.', [1]],
        ['Keep the task focused on this data.', 'The goal is a filtered dashboard, an image and a running app. Prompt instructions describe the task; configuration enforces access.', [0, 1]]
      ]
    },
    python: {
      source: source.PYTHON, language: 'python', ranges: '1|2-4|5|6|1-6',
      context: 'Prepared app.py · lines 11–16', tags: ['CSV load', 'Filter inputs', 'Row selection', 'Revenue'],
      steps: [
        ['Load the local sales CSV.', 'DATA is the prepared app’s local CSV path. Parsing dates supports the time trend.', [0]],
        ['Choose the region and product values.', 'The two multiselect inputs start with all available choices. Product choices use the product column.', [1]],
        ['Keep the rows matching both selections.', 'The filter combines region membership and product membership. Both conditions must hold.', [2]],
        ['Calculate revenue from the filtered rows.', 'The total responds to the same selection as the charts. The complete app also handles an empty result.', [3]],
        ['Follow data into a useful dashboard.', 'Load → select → filter → aggregate. The full source also groups revenue for the time and regional charts.', [0, 1, 2, 3]]
      ]
    },
    docker: {
      source: source.DOCKER, language: 'dockerfile', ranges: '1|2-4|5-6|7-8|1-8',
      context: 'Prepared Dockerfile · app image', tags: ['Base + dependencies', 'App + data', 'Start service'],
      steps: [
        ['Choose the Python base image.', 'The app image begins with the Python 3.12 slim tag used in the prepared Dockerfile.', [0]],
        ['Install the app’s dependencies.', 'Choose /app, copy requirements.txt, then install its pinned dependencies.', [0]],
        ['Include the app and synthetic data.', 'The image receives the Python source and local CSV directory. It does not need an external data API.', [1]],
        ['Start a service that listens on port 8501.', 'CMD launches Streamlit on 0.0.0.0:8501. EXPOSE documents the port; a separate mapping makes it reachable.', [2]],
        ['Package the complete application.', 'Base, dependencies, source and start command form the image. Build and run it using the sandbox’s own engine.', [0, 1, 2]]
      ]
    },
    build: {
      source: source.BUILD, language: 'bash', ranges: '1|2|1-2',
      context: 'Sandbox shell · project directory', tags: ['Sandbox build', 'Sandbox container', 'Port mapping'],
      steps: [
        ['Build with the sandbox engine.', 'Run from the sandbox project containing the Dockerfile. This tags the image odsc-sales:workshop.', [0]],
        ['Run the app container inside the sandbox.', 'The -p 8501:8501 mapping sends sandbox port 8501 to the container’s listening port 8501.', [1, 2]],
        ['Keep Docker execution inside the VM.', 'The sandbox engine manages this image and container. Host-side sbx publishing is a separate port hop.', [0, 1, 2]]
      ]
    },
    publish: {
      source: source.PUBLISH, language: 'bash', ranges: '1|2|1-2',
      context: 'Host shell · publish sandbox port', tags: [],
      steps: [
        ['Publish sandbox port 8501.', 'Run sbx from the host shell. The app container must already map its listening port to sandbox port 8501.', []],
        ['Inspect the actual assigned host port.', 'Open the binding reported by sbx ports. The screenshot at right is a prepared example, not a new live result.', []],
        ['Trace both port hops.', 'Container 8501 → sandbox 8501 → assigned host port. Test a filter in the observed app and explain where it runs.', []]
      ]
    }
  };
  const appSection = document.querySelector('#app-hub');
  let appView = 'task';
  let lastDockerView = 'docker';
  const appPositions = Object.fromEntries(Object.keys(appViews).map(key => [key, -1]));

  function currentStep(length) {
    return Math.max(0, Math.min(length - 1, (deck?.getIndices().f ?? -1) + 1));
  }
  function synchronizeApp() {
    if (!deck || deck.getCurrentSlide()?.id !== 'app-hub' || rebuilding) return;
    const data = appViews[appView];
    const index = currentStep(data.steps.length);
    appPositions[appView] = deck.getIndices().f ?? -1;
    const step = data.steps[index];
    const caption = document.querySelector('#app-code-caption');
    caption.dataset.step = String(index + 1);
    caption.querySelector('h3').textContent = (index + 1) + ' · ' + step[0];
    caption.querySelector('p').textContent = step[1];
    document.querySelectorAll('#app-flow span').forEach((tag, position) => tag.classList.toggle('active', step[2].includes(position)));
    document.querySelectorAll('[data-port-node]').forEach(node => {
      const active = index === 2 || (index === 0 && ['sandbox', 'host'].includes(node.dataset.portNode)) || (index === 1 && node.dataset.portNode === 'host');
      node.classList.toggle('active', active);
    });
    document.querySelectorAll('[data-port-path]').forEach(path => path.classList.toggle('active', index === 2 || (index === 0 && path.dataset.portPath === 'outer')));
  }
  function selectApp(view) {
    if (view === appView) return;
    if (deck?.getCurrentSlide()?.id === 'app-hub') appPositions[appView] = deck.getIndices().f ?? -1;
    appView = view;
    if (view === 'docker' || view === 'build') lastDockerView = view;
    appSection.dataset.appView = view;
    const data = appViews[view];
    const dockerFamily = view === 'docker' || view === 'build';
    document.querySelectorAll('[data-app-tab]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.appTab === (dockerFamily ? 'docker' : view))));
    document.querySelectorAll('[data-app-subview]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.appSubview === view)));
    document.querySelector('#app-subtabs').hidden = !dockerFamily;
    document.querySelector('#app-context').textContent = data.context;
    ['app-task', 'app-published', 'app-port-flow'].forEach(id => {
      const element = document.getElementById(id);
      const visible = id === 'app-task' ? view === 'task' : view === 'publish';
      element.hidden = !visible;
      element.inert = !visible;
    });
    const flow = document.querySelector('#app-flow');
    flow.hidden = view === 'publish';
    flow.replaceChildren(...data.tags.map(text => {
      const span = document.createElement('span');
      span.textContent = text;
      return span;
    }));
    document.querySelector('#app-copy-status').textContent = '';
    replaceCode(document.querySelector('#app-code-wrapper'), 'app-active-code', data, appPositions[view]);
    synchronizeApp();
  }
  document.querySelectorAll('[data-app-tab]').forEach(button => button.addEventListener('click', event => {
    selectApp(button.dataset.appTab === 'docker' ? lastDockerView : button.dataset.appTab);
    releasePointerFocus(event);
  }));
  document.querySelectorAll('[data-app-subview]').forEach(button => button.addEventListener('click', event => {
    selectApp(button.dataset.appSubview);
    releasePointerFocus(event);
  }));
  document.querySelector('#app-copy').addEventListener('click', () => copySource(appViews[appView].source, document.querySelector('#app-copy-status'), 'Copied complete code.'));
  ['app-published', 'app-port-flow'].forEach(id => { document.getElementById(id).inert = true; });

  let workspaceMode = 'direct';
  let controlFocus = 'workspace';
  function synchronizeControls() {
    const diagram = document.querySelector('.workspace-diagram');
    diagram.dataset.workspace = workspaceMode;
    diagram.dataset.focus = controlFocus;
    document.querySelectorAll('[data-workspace-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workspaceMode === workspaceMode)));
    document.querySelectorAll('[data-control-focus]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.controlFocus === controlFocus)));
    document.querySelector('#workspace-detail-title').textContent = workspaceMode === 'direct' ? 'Direct edits reach host files.' : 'Clone edits stay in a separate working copy.';
    document.querySelector('#workspace-detail-text').textContent = workspaceMode === 'direct'
      ? 'The selected project is shared read-write. Agent edits change that host working tree.'
      : 'The source at /run/sandbox/source is read-only, but still readable, including ignored and untracked files.';
    document.querySelector('#control-focus-title').textContent = controlFocus === 'workspace' ? 'File access is the highlighted path.' : 'Network access is the highlighted path.';
    document.querySelector('#control-focus-text').textContent = controlFocus === 'workspace'
      ? 'Workspace mode selects where edits go. It does not change the independently chosen network policy.'
      : 'Outbound requests follow network policy. This emphasis does not change workspace mode or real access settings.';
  }
  document.querySelectorAll('[data-workspace-mode]').forEach(button => button.addEventListener('click', event => {
    workspaceMode = button.dataset.workspaceMode;
    synchronizeControls();
    releasePointerFocus(event);
  }));
  document.querySelectorAll('[data-control-focus]').forEach(button => button.addEventListener('click', event => {
    controlFocus = button.dataset.controlFocus;
    synchronizeControls();
    releasePointerFocus(event);
  }));

  const evidenceCases = {
    workspace: {
      source: 'sbx run --name odsc-direct codex .\nsbx run --clone --name odsc-clone codex .',
      language: 'bash', ranges: '1|2|1-2', context: 'Host shell · alternative prepared environments',
      prediction: 'Direct edits reach the host project. Clone edits stay in the clone until deliberately transferred.',
      steps: [
        ['Prepare the direct workspace.', 'Start from the sanitized Git fixture in the runbook. Direct workspace sharing is read-write.'],
        ['Prepare a separate clone environment.', '--clone creates a separate working copy. It is not a mode switch on the direct sandbox.'],
        ['Compare where the edits go.', 'Use the harmless marker file and inspect actual host and clone contents. Record output and exit status, not an assumed result.']
      ]
    },
    source: {
      source: 'sbx exec odsc-clone cat /run/sandbox/source/ignored-demo.txt\nsbx exec odsc-clone sh -c \\\n  \'printf "%s\\n" "Source edit" > /run/sandbox/source/marker.txt\'',
      language: 'bash', ranges: '1|2-3|1-3', context: 'Host shell · commands execute inside odsc-clone',
      prediction: 'The harmless ignored source file remains readable. A write to the read-only source mount should fail.',
      steps: [
        ['Read the harmless ignored source file.', 'The host command invokes cat inside the clone. Read-only source access does not hide ignored or untracked contents.'],
        ['Attempt a write to that source mount.', 'The target is the disposable source marker, not the clone working copy. Inspect the real error and exit status.'],
        ['Separate write isolation from secrecy.', 'A readable source and a denied source write can coexist. Check both observations in the prepared environment.']
      ]
    },
    allowed: {
      source: 'sbx policy ls odsc-direct --wide\nsbx policy check network --sandbox odsc-direct example.com:443\nsbx exec odsc-direct curl -I --max-time 10 https://example.com',
      language: 'bash', ranges: '1|2|3|1-3', context: 'Host shell · policy check + real sandbox request',
      prediction: 'After preparing the explicit sandbox-local allow, the policy check should allow this destination. Verify the real request separately.',
      steps: [
        ['Inspect the active policy.', 'Prepare only the sandbox-scoped demo rules from the runbook. Preserve provider access and record existing rule IDs first.'],
        ['Evaluate the authorization decision.', 'The policy check evaluates host and port. It does not send HTTP or establish that the endpoint is reachable.'],
        ['Make an actual request inside the sandbox.', 'sbx exec runs curl in odsc-direct. Capture HTTP output and exit status; other restrictions or connectivity failures can still matter.'],
        ['Join the policy decision to the request evidence.', 'Record the observed result and matching rule. Organization governance can prevent a local allow from granting access.']
      ]
    },
    denied: {
      source: 'sbx policy ls odsc-direct --wide\nsbx policy check network --sandbox odsc-direct example.org:443\nsbx exec odsc-direct curl -I --max-time 10 https://example.org',
      language: 'bash', ranges: '1|2|3|1-3', context: 'Host shell · explicit deny + real sandbox request',
      prediction: 'After preparing the explicit sandbox-local deny, this destination should be denied. Correlate the real request failure with that decision and rule.',
      steps: [
        ['Inspect the explicit sandbox-local deny.', 'Prepare the rehearsed example.org:443 deny from the runbook. Do not reset global policy or change provider access.'],
        ['Check the authorization decision.', 'This checks policy without sending HTTP. The explicit deny is different from unmatched approval-required access.'],
        ['Attempt the real request inside the sandbox.', 'Capture the request’s output and exit status. A network failure alone does not prove that policy denied it.'],
        ['Match the actual result to the rule.', 'Correlate the denial decision, request and policy log. Leave this as a prediction if no enforcement run has been observed.']
      ]
    }
  };
  let evidenceCase = 'workspace';
  const evidencePositions = Object.fromEntries(Object.keys(evidenceCases).map(key => [key, -1]));
  const observations = Object.fromEntries(Object.keys(evidenceCases).map(key => [key, '']));
  const observedResult = document.querySelector('#observed-result');
  function updateStaticObservation(key) {
    const output = document.querySelector('[data-static-observation="' + key + '"]');
    output.textContent = observations[key] ? 'Presenter-entered observation: ' + observations[key] : 'No observed result recorded.';
  }
  function synchronizeEvidence() {
    if (!deck || deck.getCurrentSlide()?.id !== 'boundary-checks' || rebuilding) return;
    const data = evidenceCases[evidenceCase];
    const index = currentStep(data.steps.length);
    evidencePositions[evidenceCase] = deck.getIndices().f ?? -1;
    const output = document.querySelector('#evidence-code-caption');
    output.dataset.step = String(index + 1);
    output.querySelector('h3').textContent = (index + 1) + ' · ' + data.steps[index][0];
    output.querySelector('p').textContent = data.steps[index][1];
  }
  function selectEvidence(key) {
    if (key === evidenceCase) return;
    if (deck?.getCurrentSlide()?.id === 'boundary-checks') evidencePositions[evidenceCase] = deck.getIndices().f ?? -1;
    observations[evidenceCase] = observedResult.value;
    updateStaticObservation(evidenceCase);
    evidenceCase = key;
    const data = evidenceCases[key];
    document.querySelector('#boundary-checks').dataset.evidenceCase = key;
    document.querySelectorAll('button[data-evidence-case]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.evidenceCase === key)));
    document.querySelector('#evidence-context').textContent = data.context;
    document.querySelector('#evidence-prediction').textContent = data.prediction;
    document.querySelector('#evidence-copy-status').textContent = '';
    observedResult.value = observations[key];
    replaceCode(document.querySelector('#evidence-code-wrapper'), 'evidence-active-code', data, evidencePositions[key]);
    synchronizeEvidence();
  }
  document.querySelectorAll('button[data-evidence-case]').forEach(button => button.addEventListener('click', event => {
    selectEvidence(button.dataset.evidenceCase);
    releasePointerFocus(event);
  }));
  document.querySelector('#evidence-copy').addEventListener('click', () => copySource(evidenceCases[evidenceCase].source, document.querySelector('#evidence-copy-status'), 'Copied complete code.'));
  document.querySelector('#evidence-clear').addEventListener('click', event => {
    observations[evidenceCase] = '';
    observedResult.value = '';
    updateStaticObservation(evidenceCase);
    releasePointerFocus(event);
  });
  observedResult.addEventListener('input', () => {
    observations[evidenceCase] = observedResult.value;
    updateStaticObservation(evidenceCase);
  });
  // Keep native caret movement and newlines while excluding this editor from deck navigation.
  const editorKeys = new Set([' ', 'Spacebar', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
  ['keydown', 'keyup'].forEach(type => document.addEventListener(type, event => {
    if (event.target === observedResult && editorKeys.has(event.key)) event.stopImmediatePropagation();
  }, true));

  const environmentScenarios = {
    workload: { card: 'container', text: 'A familiar application can fit an ordinary container when its mounts, permissions and capabilities match the task.' },
    agent: { card: 'sandbox', text: 'When agent tools need their own VM and Docker engine, a sandbox changes that boundary. Shared resources still need review.' },
    review: { card: null, text: 'Review broad credentials and host tools first. A VM boundary cannot choose appropriate grants or contain host-side integrations for us.' }
  };
  document.querySelectorAll('[data-environment-scenario]').forEach(button => button.addEventListener('click', event => {
    const selected = button.dataset.environmentScenario;
    const data = environmentScenarios[selected];
    document.querySelectorAll('[data-environment-scenario]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-choice-card]').forEach(card => card.classList.toggle('active', card.dataset.choiceCard === data.card));
    document.querySelector('#choice-explanation p').textContent = data.text;
    releasePointerFocus(event);
  }));

  const onSlideChanged = () => { synchronizeApp(); synchronizeEvidence(); };
  window.WorkshopFinishing = Object.freeze({
    attach(instance) {
      deck = instance;
      deck.on('ready', onSlideChanged);
      deck.on('slidechanged', onSlideChanged);
      deck.on('fragmentshown', onSlideChanged);
      deck.on('fragmenthidden', onSlideChanged);
    },
    getAppState: () => ({ view: appView, positions: { ...appPositions } }),
    getControlState: () => ({ workspace: workspaceMode, focus: controlFocus }),
    getEvidenceState: () => ({ selected: evidenceCase, positions: { ...evidencePositions } })
  });
})();
